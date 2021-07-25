import React from "react";
import AccountRow from "./AccountRow";
import { v4 as uuidv4 } from "uuid";
const moment = require('moment');

function AccountColumn(props) {
    const { numRows, account, transactions } = props;
    const rowBalances = [props.account.balance || 0];

    function renderAccountRows() {
        // Loop through number of rows
        return numRows.map((index) => {
            const rowDate = moment().add(index, 'days').toObject();
            // Get all the transactions that apply to that date
            let rowTransactions = getRowTransactions(rowDate);
            // Get the net total of the transactions
            let net = rowTransactions.reduce((total, curTrans) => total + curTrans.value, 0);
            let newBalance = rowBalances[index] + net;
            rowBalances.push(newBalance);
            return (<AccountRow
                key={uuidv4()}
                transactions={rowTransactions}
                newBalance={newBalance}
            />)
        });
    }

    function getRowTransactions(rowDate) {
        let rowTransactions = [];
        transactions.forEach(t => {
            if (t.occurrence === "Monthly") {
                if (t.date.date === rowDate.date) {
                    console.log("Adding", t);
                    rowTransactions.push(t);
                }
            }
        })
        return rowTransactions;
    }

    return (<div className="col border border-primary">
        <div className="row bg-primary text-white border">{account.label}</div>
        {renderAccountRows()}
    </div>)
}
export default AccountColumn;