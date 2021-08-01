import React, { useState, useEffect } from 'react';
import TransferForm from "./TransferForm";
import axios from "axios";
const moment = require('moment');

function TransferPage() {

    const [transfers, setTransfers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [transferToEdit, setTransferToEdit] = useState();

    // API calls to get initial state
    useEffect(() => {
        //get all transfers
        axios.post('/api/transfer/search', {})
            .then(response => {
                console.log("Setting Transfers", response.data);
                setTransfers(response.data);
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
        console.log("transfers", transfers);
    }, [transfers])

    // -------------------------
    //    Utility Functions
    // -------------------------

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
        handleUpdateTransfer("delete", id);
    }

    function handleEdit(event) {
        let id = event.target.value;
        let index = transfers.map((t)=>t._id).indexOf(id);
        setTransferToEdit(transfers[index]);
        setShowForm(true);
    }

    function handleNew() {
        setTransferToEdit();
        setShowForm(true);
    }

    function handleUpdateTransfer(method, transfer) {
        let newTransfersList = JSON.parse(JSON.stringify(transfers));
        console.log("Updating", transfer);
        if (method === "delete") {
            axios.post('/api/transfer/delete/' + transfer)
            .then(response => {
                console.log("Delete Response", response.data);
                newTransfersList = newTransfersList.filter((t) => t._id !== transfer);
                setTransfers(newTransfersList);
            })
            .catch(err => {
                console.log(err);
            });
        }
        if (method === "new") {
            axios.post('/api/transfer/', transfer)
            .then(response => {
                console.log("Add New Response", response.data)
                transfer._id = response.data._id;
                newTransfersList.push(transfer);
                setTransfers(newTransfersList);
            })
            .catch(err => {
                console.log(err);
            });
        }
        if (method === "update") {
            axios.put('/api/transfer/' + transfer._id, transfer)
            .then(response => {
                console.log("Update Response", response.data)
                let index = newTransfersList.map((t)=>t._id).indexOf(transfer._id);
                newTransfersList[index] = transfer;
                setTransfers(newTransfersList);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    // -------------------------
    //    Render Functions
    // -------------------------

    function renderTransfer(transfer) {
        return (
            <div id={transfer._id} className="row transaction-container" >
                <div className="col-10">
                    <div className="row cool-gradient round-tl" >
                        <div className="col-8 transaction-label">
                            Transfer
                        </div>
                        <div className="col-4">
                            {transfer.value}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            {transfer.occurrence} : {transfer.date.months+1}-{transfer.date.date}-{transfer.date.years}
                        </div>
                        <div className="col-4">
                            From: {getAccountLabel(transfer.fromAccountId)}
                        </div>
                        <div className="col-4">
                            To: {getAccountLabel(transfer.toAccountId)}
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <button
                        value={transfer._id}
                        className="btn btn-info btn-block"
                        onClick={handleDelete}
                    >Delete</button>
                    <button
                        value={transfer._id}
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
                ? <TransferForm
                    transferToEdit={transferToEdit}
                    accounts={accounts}
                    handleUpdateTransfer={handleUpdateTransfer}
                    setShowForm={setShowForm}
                />
                : null}
            <div className="row">
                <div className="col-12">
                    <button
                        className="btn btn-info btn-lg"
                        onClick={handleNew}
                    >Add new transfer</button>
                </div>
            </div>
            {transfers.map((transfer) => {
                return renderTransfer(transfer);
            })}
        </div>
    )
}
export default TransferPage