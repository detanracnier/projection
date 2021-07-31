import React, { useState, useEffect } from "react";
import ProjectionRow from "./ProjectionRow";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const moment = require('moment');

let numDaysToProject = 90
let numRows = [];
for (let x = 0; x < numDaysToProject; x++) {
  numRows.push(x);
}

function ProjectionPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  // ----------
  let startFromDate = moment().add(-7,'days').toObject();
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
    for (let row = 0; row < numRows.length; row++) {
      const rowDate = moment(startFromDate).add(row, 'days').startOf('day').toObject();
      // Create a projection row
      projection.push(
        {
          date: rowDate,
          accounts: []
        });
      // Add accounts to projection row
      accounts.forEach((account, index) => {
        projection[row].accounts.push({ transactions: [], transfers: [], balance: accountBalances[index] });
      })

      transfers.forEach((transfer) => {
        if (dateMatch(transfer, rowDate)) {
          let accountFromIndex = -1;
          let accountToIndex = -1;
          accounts.forEach((account, index) => {
            if(account.id === transfer.fromAccountId){
              accountFromIndex = index;
            }
            if(account.id === transfer.toAccountId){
              accountToIndex = index;
            }
          })

          let newBalance = accountBalances[accountFromIndex] - transfer.value;
          accountBalances[accountFromIndex] = newBalance;
          // Add the FROM account transfer and balance to the projection rows account
          projection[row].accounts[accountFromIndex].transfers.push(transfer);
          projection[row].accounts[accountFromIndex].balance = newBalance;

          newBalance = accountBalances[accountToIndex] + transfer.value;
          accountBalances[accountToIndex] = newBalance;
          // Add the TO account transfer and balance to the projection rows account
          projection[row].accounts[accountToIndex].transfers.push(transfer);
          projection[row].accounts[accountToIndex].balance = newBalance;
        }
      });
      transactions.forEach((transaction) => {
        if (dateMatch(transaction, rowDate)) {
          let accountIndex = accounts.map((account) => account.id).indexOf(transaction.accountId);
          let newBalance = accountBalances[accountIndex] + transaction.value;
          accountBalances[accountIndex] = newBalance;
          // Add the transaction and balance to the projection rows account
          projection[row].accounts[accountIndex].transactions.push(transaction);
          projection[row].accounts[accountIndex].balance = newBalance;
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
  //    Render Functions
  // -------------------------
  function renderRows() {
    let projection = getProjection();
    console.log("projection",projection);
    return projection.map((rowData) => {
      return <ProjectionRow
        key={uuidv4()}
        rowData={rowData}
      />;
    });
  }

  return (
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
  );
}

export default ProjectionPage;
