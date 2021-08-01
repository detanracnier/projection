import React, { useState, useEffect } from 'react';
import TransactionForm from "./TransactionForm";
import axios from "axios";
const moment = require('moment');

function TransactionsPage() {

    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState();

    // API calls to get initial state
    useEffect(() => {
        //get all transactions
        axios.post('/api/transaction/search', {})
            .then(response => {
                console.log("Setting Transactions", response.data);
                setTransactions(response.data);
            })
            .catch(err => {
                console.log(err);
            });
        //get all accounts
        axios.post('/api/account/search', {})
            .then(response => {
                console.log("Setting Accounts", response.data);
                setAccounts(response.data);
            })
            .catch(err => {
                console.log(err);
            });

    }, []);

    useEffect(() => {
        console.log("transactions", transactions);
    }, [transactions])

    // -------------------------
    //    Utility Functions
    // -------------------------

    function getNumberFix(date) {
        let fix = "";
        let lastNum = date % 10;
        if (lastNum === 1) { fix = "st"; }
        else if (lastNum === 2) {
            if (parseInt(date.date) === 12) { fix = "th"; }
            else { fix = "nd"; }}
        else if (lastNum === 3) { fix = "rd"; }
        else if (lastNum > 3) { fix = "th"; };
        
        return fix;
    }

    function getDateString(date, occurrence) {
        let myDate = moment(date);
        let string = ""
        if (occurrence === "One-time") {
            string += date.months + "-" + date.date + "-" + date.years;
        }
        if (occurrence === "Monthly") {
            let fix = getNumberFix(date.date);
            string += date.date + fix + " of every month";
        }
        if (occurrence === "Bi-Weekly") {
            string += "Every other " + myDate.format("dddd");
        }
        if (occurrence === "Weekly") {
            string += "Every " + myDate.format("dddd");
        }
        if (occurrence === "Every 4 Weeks") {
            string += "Every 4 Weeks on " + myDate.format("dddd");
        }
        return string;
    }

    function getAccountLabel(id) {
        let accountLabel = "";
        accounts.forEach((account) => {
            if (parseInt(account.id) === parseInt(id)) accountLabel = account.label
        })
        return accountLabel;
    }

    // -------------------------
    //    Handler Functions
    // -------------------------

    function handleDelete(event) {
        let id = event.target.value;
        handleUpdateTransactions("delete", id);
    }

    function handleEdit(event) {
        let id = event.target.value;
        let index = transactions.map((t) => t._id).indexOf(id);
        setTransactionToEdit(transactions[index]);
        setShowForm(true);
    }

    function handleNew() {
        setTransactionToEdit();
        setShowForm(true);
    }

    function handleUpdateTransactions(method, transaction) {
        let newTransactionsList = JSON.parse(JSON.stringify(transactions));
        console.log("Updating", transaction);
        if (method === "delete") {
            axios.post('/api/transaction/delete/' + transaction)
                .then(response => {
                    console.log("Delete Response", response.data);
                    newTransactionsList = newTransactionsList.filter((t) => t._id !== transaction);
                    setTransactions(newTransactionsList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (method === "new") {
            transaction.type = transaction.value < 0 ? "bill" : "income";
            axios.post('/api/transaction/', transaction)
                .then(response => {
                    console.log("Add New Response", response.data)
                    transaction._id = response.data._id;
                    newTransactionsList.push(transaction);
                    setTransactions(newTransactionsList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (method === "update") {
            axios.put('/api/transaction/' + transaction._id, transaction)
                .then(response => {
                    console.log("Update Response", response.data)
                    let index = newTransactionsList.map((t) => t._id).indexOf(transaction._id);
                    newTransactionsList[index] = transaction;
                    setTransactions(newTransactionsList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    // -------------------------
    //    Render Functions
    // -------------------------

    function renderTransaction(transaction) {
        return (
            <div id={transaction._id} className="row transaction-container" >
                <div className="col-10">
                    <div className={transaction.type === "bill" ? "row danger-gradient round-tl" : "row success-gradient round-tl"} >
                        <div className="col-8 transaction-label">
                            {transaction.label}
                        </div>
                        <div className="col-4">
                            {transaction.value}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            {transaction.occurrence}
                        </div>
                        <div className="col-4">
                            {getDateString(transaction.date, transaction.occurrence)}
                        </div>
                        <div className="col-4">
                            {getAccountLabel(transaction.accountId)}
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <button
                        value={transaction._id}
                        className="btn btn-info btn-block"
                        onClick={handleDelete}
                    >Delete</button>
                    <button
                        value={transaction._id}
                        className="btn btn-info btn-block"
                        onClick={handleEdit}
                    >Edit</button>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid p-3">
            {showForm
                ? <TransactionForm
                    transactionToEdit={transactionToEdit}
                    accounts={accounts}
                    handleUpdateTransactions={handleUpdateTransactions}
                    setShowForm={setShowForm}
                />
                : null}
            <div className="row">
                <div className="col-12">
                    <button
                        className="btn btn-info btn-lg"
                        onClick={handleNew}
                    >Add new transaction</button>
                </div>
            </div>
            {transactions.map((transaction) => {
                return renderTransaction(transaction);
            })}
        </div>
    )
}
export default TransactionsPage