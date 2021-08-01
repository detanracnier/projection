import React, { useState, useEffect } from "react";
import ProjectionRow from "./ProjectionRow";
import AccountForm from "./AccountForm";
import TransferForm from "./TransferForm";
import TransactionForm from "./TransactionForm";
import FormControls from "./FormControls";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const moment = require('moment');

let numDaysToProject = 90
let lookBack = 7;

function ProjectionPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [clickedRowDate, setClickedRowDate] = useState(null);

  // ----------
  let startFromDate = moment().add(-lookBack, 'days').toObject();
  // ----------

  // API calls to get initial state
  useEffect(() => {
    //get all accounts
    axios.post('/api/account/search', {})
      .then(response => {
        console.log("Setting Accounts", response.data);
        setAccounts(response.data);
      })
      .catch(err => {
        console.log(err);
      });
    //get all transactions
    axios.post('/api/transaction/search', {})
      .then(response => {
        console.log("Setting Transactions", response.data);
        setTransactions(response.data);
      })
      .catch(err => {
        console.log(err);
      });
    //get all transfers
    axios.post('/api/transfer/search', {})
      .then(response => {
        console.log("Setting Transfers", response.data);
        setTransfers(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // -------------------------
  //    Utility Functions
  // -------------------------

  // Create an array of each row and the data it will need
  function getProjection() {
    let projection = [];
    let accountBalances = [];
    // Set initial account balances
    accounts.forEach((account) => {
      accountBalances.push(account.balance);
    })
    for (let row = 0; row < numDaysToProject; row++) {
      const rowDate = moment(startFromDate).add(row, 'days').startOf('day').toObject();
      // Create a projection row
      projection.push(
        {
          date: rowDate,
          accounts: []
        });
      // Add accounts to projection row
      accounts.forEach((account, index) => {
        projection[row].accounts.push({ label: account.label, _id: account._id, transactions: [], transfers: [], balance: accountBalances[index] });
      })

      transfers.forEach((transfer) => {
        if (dateMatch(transfer, rowDate)) {
          let accountFromIndex = -1;
          let accountToIndex = -1;
          accounts.forEach((account, index) => {
            if (account.id === transfer.fromAccountId) {
              accountFromIndex = index;
            }
            if (account.id === transfer.toAccountId) {
              accountToIndex = index;
            }
          })
          let newBalance = accountBalances[accountFromIndex] - parseInt(transfer.value);
          // Add the FROM account transfer and balance to the projection rows account
          transfer.fromAccountLabel = accounts[accountFromIndex].label;
          projection[row].accounts[accountFromIndex].transfers.push(transfer);
          if(lookBack < row){
            accountBalances[accountFromIndex] = newBalance;
            projection[row].accounts[accountFromIndex].balance = newBalance;
          }

          newBalance = accountBalances[accountToIndex] + parseInt(transfer.value);
          // Add the TO account transfer and balance to the projection rows account
          transfer.toAccountLabel = accounts[accountToIndex].label;
          projection[row].accounts[accountToIndex].transfers.push(transfer);
          if(lookBack < row){
            accountBalances[accountToIndex] = newBalance;
            projection[row].accounts[accountToIndex].balance = newBalance;
          }
        }
      });
      transactions.forEach((transaction) => {
        if (dateMatch(transaction, rowDate)) {
          let accountIndex = accounts.map((account) => account.id).indexOf(transaction.accountId);
          let newBalance = accountBalances[accountIndex] + parseInt(transaction.value);
          // Add the transaction and balance to the projection rows account
          projection[row].accounts[accountIndex].transactions.push(transaction);
          if(lookBack < row){
            accountBalances[accountIndex] = newBalance;
            projection[row].accounts[accountIndex].balance = newBalance;
          }
        }
      });
    }
    return projection;
  }
  // Check if a date matches with a transaction date
  function dateMatch(transaction, rowDate) {
    // One-time
    if (transaction.occurrence === "One-time") {
      return (transaction.date.date === rowDate.date)
        && (transaction.date.months === rowDate.months)
        && (transaction.date.years === rowDate.years);
    }
    // Monthly
    if (transaction.occurrence === "Monthly") {
      return transaction.date.date === rowDate.date;
    }

    let a = moment(transaction.date).startOf('day');
    let b = moment(rowDate).startOf('day');
    let difference = a.diff(b, 'days');
    // 4-Weeks
    if (transaction.occurrence === "Every 4 Weeks") {
      return difference % 28 === 0;
    }
    // Bi-Weekly
    if (transaction.occurrence === "Bi-Weekly") {
      return difference % 14 === 0;
    }
    // Weekly
    if (transaction.occurrence === "Weekly") {
      return difference % 7 === 0;
    }
    console.log("Transaction occurrance not found");
    return false;
  }

  // -------------------------
  //    Handler Functions
  // -------------------------

  function handleUpdate(method, newData, model) {
    let currentList = [];
    let setList = {};
    if (model === "transfer") {
      currentList = transfers;
      setList = setTransfers;
    } else if (model === "transaction") {
      currentList = transactions;
      setList = setTransactions;
    } else if (model === "account") {
      currentList = accounts;
      setList = setAccounts;
    }

    let newList = JSON.parse(JSON.stringify(currentList));
    console.log("Updating", newData);
    if (method === "delete") {
      axios.post('/api/' + model + '/delete/' + newData)
        .then(response => {
          console.log("Delete Response", response.data);
          newList = newList.filter((t) => t._id !== newData);
          setList(newList);
        })
        .catch(err => {
          console.log(err);
        });
    }
    if (method === "new") {
      axios.post('/api/' + model + '/', newData)
        .then(response => {
          console.log("Add New Response", response.data)
          newData._id = response.data._id;
          newList.push(newData);
          setList(newList);
        })
        .catch(err => {
          console.log(err);
        });
    }
    if (method === "update") {
      axios.put('/api/' + model + '/' + newData._id, newData)
        .then(response => {
          console.log("Update Response", response.data)
          let index = newList.map((t) => t._id).indexOf(newData._id);
          newList[index] = newData;
          setList(newList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  function handleCellClicked(event) {
    event.stopPropagation();
    let type = event.target.dataset.type;
    let eRowDate = JSON.parse(event.target.dataset.date);
    if(type === "empty"){
      let newTransaction = { label: "", value: null, occurrence: "One-time", accountId: 1, date:eRowDate }
      setItemToEdit(newTransaction);
      setShowTransactionForm(true);
      setClickedRowDate(eRowDate);
      return;
    }

    let id = event.target.id;
    if(type === "transaction"){
      let index = transactions.map((t)=>t._id).indexOf(id);
      setItemToEdit(transactions[index]);
      setShowTransactionForm(true);
      setClickedRowDate(eRowDate);
    }
    if(type === "transfer"){
      let index = transfers.map((t)=>t._id).indexOf(id);
      setItemToEdit(transfers[index]);
      setShowTransferForm(true);
      setClickedRowDate(eRowDate);
    }
    if(type === "account"){
      let index = accounts.map((t)=>t._id).indexOf(id);
      setItemToEdit(accounts[index]);
      setShowAccountForm(true);
    }
  }

  // -------------------------
  //    Render Functions
  // -------------------------
  function renderRows() {
    let projection = getProjection();
    return projection.map((rowData) => {
      return <ProjectionRow
        handleCellClicked={handleCellClicked}
        key={uuidv4()}
        rowData={rowData}
      />;
    });
  }

  return (
    <React.Fragment>
      {showTransferForm || showTransactionForm
        ? <FormControls
          setShowTransferForm={setShowTransferForm}
          setShowTransactionForm={setShowTransactionForm}
          setItemToEdit={setItemToEdit}
          clickedRowDate={clickedRowDate}
        />
        : null}
      {showTransferForm
        ? <TransferForm
          transferToEdit={itemToEdit}
          accounts={accounts}
          handleUpdateTransfer={handleUpdate}
          setShowForm={setShowTransferForm}
        />
        : null}
      {showTransactionForm
        ? <TransactionForm
          transactionToEdit={itemToEdit}
          accounts={accounts}
          handleUpdateTransactions={handleUpdate}
          setShowForm={setShowTransactionForm}
        />
        : null}
      {showAccountForm
        ? <AccountForm
          accountToEdit={itemToEdit}
          handleUpdateAccount={handleUpdate}
          setShowForm={setShowAccountForm}
        />
        : null}
      <div className="container-fluid p-3">
        {/* Header Row */}
        <div className="row header-row">
          <div className="col-1">Date</div>
          {accounts.map((account) => {
            return <div className="col">{account.label}</div>
          })}
        </div>
        {/* Date Rows */}
        {renderRows()}
      </div>
    </React.Fragment>
  );
}

export default ProjectionPage;
