import React from "react";


function AccountRow(props) {
    const newBalance = props.newBalance;
    const transactions = props.transactions;

    function renderRowTransactions(){
        return transactions.map((t) => {
            return (<div className="trans-label d-inline-block pr-2">{t.label}: {t.value}</div>)
        })
    }

    return (<div className="row border border-danger">
        <div className="col">
            {renderRowTransactions()}
        </div>
        <div className="col-2 p-0 m-0 text-center border border-success">
            {newBalance}
        </div>
    </div>)

}
export default AccountRow;