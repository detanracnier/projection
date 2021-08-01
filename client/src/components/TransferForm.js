import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const moment = require('moment');

function TransferForm(props) {

    const { transferToEdit, accounts, handleUpdateTransfer, setShowForm } = props
    const [transfer, setTransfer] = useState({ fromAccount: 0, toAccountId: 0, value: 0, occurrence: "One-time", date:moment().toObject() });
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        console.log("transfer",transfer);
    }, [transfer])

    // Set starting state
    useEffect(() => {
        console.log("transferToEdit",transferToEdit);
        if (transferToEdit) {
            setTransfer(transferToEdit);
        }
    }, [transferToEdit])

    function handleClickOut(event) {
        if (event.target.id === "modal-background") {
            setShowForm(false);
        }
    }

    function handleInputChange(event){
        setUnsavedChanges(true);
        setTransfer({
            ...transfer,
            [event.target.id]:event.target.value})
    }

    function handleDateChange(date){
        setUnsavedChanges(true);
        let newDate = moment(date).toObject();
        console.log(newDate);
        setTransfer({
            ...transfer,
            date:newDate})
    }

    function handleSave(){
        let method = "new"
        if(transfer.hasOwnProperty("_id")){
            method = "update"
        }
        console.log("Saving", method);
        handleUpdateTransfer(method, transfer, "transfer");
        setShowForm(false);
    }

    return (
        <div id="modal-background" className="modal-bg" onClick={handleClickOut}>
            <div class="transaction-modal" >
                <div className="row transaction-container" >
                    <div className="col-12 p-0">
                        <div className="row danger-gradient round-tl m-0" >
                            <div className="col-7 transaction-label">
                                Transfer
                            </div>
                            <div className="col-5 transaction-amount">
                                Amount:
                                <input
                                    type="number"
                                    id="value"
                                    style={{width:"100px"}}
                                    value={transfer.value}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="row m-3">
                            <div className="col-6">
                                <div>Occurrence:</div>
                                <select
                                    value={transfer.occurrence || "One-time"}
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
                            <div className="col-6">
                                <div>Select a Date:</div>
                                 <DatePicker selected={moment(transfer.date).toDate()} onChange={(date)=> handleDateChange(date)} />
                            </div>
                        </div>
                        <div className="row m-3">
                            <div className="col-6">
                                <div>From:</div>
                                <select
                                    value={transfer.fromAccountId || 1}
                                    id="fromAccountId"
                                    onChange={handleInputChange}
                                >
                                    {accounts.map((account)=> {
                                        return <option value={account.id}>{account.label}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col-6">
                                <div>To:</div>
                                <select
                                    value={transfer.toAccountId || 2}
                                    id="toAccountId"
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
export default TransferForm;