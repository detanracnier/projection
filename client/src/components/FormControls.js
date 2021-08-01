import React from "react";

function FormControls(props){

    const {
        setItemToEdit,
        clickedRowDate,
        setShowTransactionForm,
        setShowTransferForm
    } = props;

    function handleNewTransfer(){
        let newTransfer = { fromAccount: 0, toAccountId: 0, value: null, occurrence: "One-time", date:clickedRowDate }
        setItemToEdit(newTransfer);
        setShowTransactionForm(false);
        setShowTransferForm(true)
    }

    function handleNewTransaction(){
        let newTransaction = { label: "", value: null, occurrence: "One-time", accountId: 1, date:clickedRowDate }
        setItemToEdit(newTransaction);
        setShowTransferForm(false)
        setShowTransactionForm(true);
    }

    return(
        <div className="form-controls">
            <div
                className="btn btn-success mr-2"
                onClick={handleNewTransaction}>
                +New transaction
            </div>
            <div
                className="btn btn-success"
                onClick={handleNewTransfer}>
                +New transfer
            </div>
        </div>
    )
}
export default FormControls;