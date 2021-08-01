import React from "react";
import newTransfer from '../data/newTransfer';
import newTransaction from "../data/newTransaction";


function FormControls(props){

    const {
        setItemToEdit,
        clickedRowDate,
        setShowTransactionForm,
        setShowTransferForm
    } = props;

    function handleNewTransfer(){
        let newItem = newTransfer;
        newItem.date = clickedRowDate;
        setItemToEdit(newItem);
        setShowTransactionForm(false);
        setShowTransferForm(true)
    }

    function handleNewTransaction(){
        let newItem = newTransaction;
        newItem.date = clickedRowDate;
        setItemToEdit(newItem);
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