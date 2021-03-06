import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import newTransaction from "../data/newTransaction";
const moment = require('moment');

function TransactionForm(props) {

    const { transactionToEdit, accounts, handleUpdateTransactions, setShowForm, clickedRowDate } = props
    const [transaction, setTransaction] = useState(newTransaction);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        console.log("transaction",transaction);
    }, [transaction])

    // Set starting state
    useEffect(() => {
        console.log("transactionToEdit",transactionToEdit);
        if (transactionToEdit) {
            setTransaction(transactionToEdit);
        }
    }, [transactionToEdit])

    function handleClickOut(event) {
        if (event.target.id === "modal-background") {
            setShowForm(false);
        }
    }

    function handleInputChange(event){
        setUnsavedChanges(true);
        setTransaction({
            ...transaction,
            [event.target.id]:event.target.value})
    }

    function handleDateChange(date){
        setUnsavedChanges(true);
        let newDate = moment(date).toObject();
        console.log(newDate);
        setTransaction({
            ...transaction,
            date:newDate})
    }

    function handleSave(){
        let data = transaction;
        if(data.value > 0) {
            data.type = "income";
        }
        let method = "new"
        if(transaction.hasOwnProperty("_id")){
            method = "update"
        }
        console.log("Saving", method);
        handleUpdateTransactions(method, data, "transaction");
        setShowForm(false);
    }

    function handleDelete(){
        console.log("deleting");
        let data = transaction;
        if(data.occurrence === "One-time"){
            handleUpdateTransactions("delete", data._id, "transaction");
            setShowForm(false);
        } else {
            data.exceptions.push({date: clickedRowDate, offset: -60 });
            handleUpdateTransactions("update", data, "transaction");
            setShowForm(false);
        }
    }

    return (
        <div id="modal-background" className="modal-bg" onClick={handleClickOut}>
            <div class="transaction-modal" >
                <div className="row transaction-container" style={{position: "relative"}} >
                    <div className="col-12 p-0">
                        <div className="row danger-gradient round-tl m-0" >
                            <button
                                class="bg-danger delete-corner-button"
                                onClick={handleDelete}
                            >
                                X
                            </button>
                            <div className="col-7 transaction-label">
                                Label:
                                <input
                                    type="text"
                                    id="label"
                                    value={transaction.label || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-5 transaction-amount">
                                Amount:
                                <input
                                    type="number"
                                    id="value"
                                    style={{width:"100px"}}
                                    value={transaction.value}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="row m-3">
                            <div className="col-4">
                                <div>Occurrence:</div>
                                <select
                                    value={transaction.occurrence || "One-time"}
                                    id="occurrence"
                                    onChange={handleInputChange}
                                >
                                    <option value="One-time">One-time</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Every 4 Weeks">Every 4 Weeks</option>
                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                    <option value="Weekly">Weekly</option>
                                </select>
                            </div>
                            <div className="col-4">
                                <div>Select a Date:</div>
                                 <DatePicker selected={moment(transaction.date).toDate()} onChange={(date)=> handleDateChange(date)} />
                            </div>
                            <div className="col-4">
                                <div>Account:</div>
                                <select
                                    value={transaction.accountId || 1}
                                    id="accountId"
                                    onChange={handleInputChange}
                                >
                                    {accounts.map((account)=> {
                                        return <option value={account.id}>{account.label}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row justify-content-center m-0 pt-4">
                            <div className="col-4">
                                <button
                                    className="btn btn-success btn-lg btn-block"
                                    disabled={!unsavedChanges}
                                    onClick={handleSave}
                                    >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionForm;