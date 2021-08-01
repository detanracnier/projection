import React, { useState, useEffect } from 'react';

function AccountForm(props) {

    const { accountToEdit, handleUpdateAccount, setShowForm } = props
    const [account, setAccount] = useState({ id: 0, label:"", balance:0});
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        console.log("account",account);
    }, [account])

    // Set starting state
    useEffect(() => {
        console.log("accountToEdit",accountToEdit);
        if (accountToEdit) {
            setAccount(accountToEdit);
        }
    }, [accountToEdit])

    function handleClickOut(event) {
        if (event.target.id === "modal-background") {
            setShowForm(false);
        }
    }

    function handleInputChange(event){
        setUnsavedChanges(true);
        setAccount({
            ...account,
            [event.target.id]:parseInt(event.target.value)})
    }

    function handleSave(){
        let method = "new"
        if(account.hasOwnProperty("_id")){
            method = "update"
        }
        console.log("Saving", method);
        handleUpdateAccount(method, account, "account");
        setShowForm(false);
    }

    return (
        <div id="modal-background" className="modal-bg" onClick={handleClickOut}>
            <div class="account-modal" >
                <div className="row transaction-container" >
                    <div className="col-12 p-0">
                        <div className="row danger-gradient round-tl m-0" >
                            <div className="col-7 transaction-label">
                                {account.label || null}
                            </div>
                            <div className="col-5 transaction-amount">
                                Balance:
                                <input
                                    type="number"
                                    id="balance"
                                    style={{width:"100px"}}
                                    value={account.balance || null}
                                    onChange={handleInputChange}
                                />
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
export default AccountForm;