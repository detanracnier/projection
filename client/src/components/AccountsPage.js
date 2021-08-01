import React, { useState, useEffect } from 'react';
import AccountForm from "./AccountForm";
import axios from "axios";

function AccountsPage() {

    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState();

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

    }, []);

    useEffect(() => {
        console.log("accounts", accounts);
    }, [accounts])

    // -------------------------
    //    Utility Functions
    // -------------------------

    // -------------------------
    //    Handler Functions
    // -------------------------

    function handleUpdateAccount(method, account) {
        let newAccountList = JSON.parse(JSON.stringify(accounts));
        console.log("Updating", account);
        if (method === "delete") {
            axios.post('/api/account/delete/' + account)
                .then(response => {
                    console.log("Delete Response", response.data);
                    newAccountList = newAccountList.filter((t) => t._id !== account);
                    setAccounts(newAccountList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (method === "new") {
            axios.post('/api/account/', account)
                .then(response => {
                    console.log("Add New Response", response.data)
                    account._id = response.data._id;
                    newAccountList.push(account);
                    setAccounts(newAccountList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (method === "update") {
            axios.put('/api/account/' + account._id, account)
                .then(response => {
                    console.log("Update Response", response.data)
                    let index = newAccountList.map((t) => t._id).indexOf(account._id);
                    newAccountList[index] = account;
                    setAccounts(newAccountList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    function handleEdit(event) {
        let id = event.target.value;
        let index = accounts.map((a)=>a._id).indexOf(id);
        setAccountToEdit(accounts[index]);
        setShowForm(true);
    }

    // -------------------------
    //    Render Functions
    // -------------------------

    function renderAccount(account) {
        return (
            <div id={account._id} className="row account-container" >
                <div className="col-5">
                    {account.label}
                </div>
                <div className="col-5">
                    Balance: {account.balance}
                </div>
                <div className="col-2">
                    <button
                        value={account._id}
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
                ? <AccountForm
                    accountToEdit={accountToEdit}
                    handleUpdateAccount={handleUpdateAccount}
                    setShowForm={setShowForm}
                />
                : null}
            {accounts.map((account) => {
                return renderAccount(account);
            })}
        </div>
    )
}
export default AccountsPage