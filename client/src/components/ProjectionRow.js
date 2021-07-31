import React, { useEffect } from "react";
const moment = require('moment');

function ProjectionRow(props) {
    const rowData = props.rowData;

    useEffect(() => {
        if (rowData.accounts.length > 0) {
            // console.log("Row data for " + rowData.date.date, rowData);
        }
    });

    // -------------------------
    //    Utility Functions
    // -------------------------
    function getMonthName(date) {
        let d = moment(date);
        let monthName = d.format("MMMM");
        return monthName;
    }

    return (
        <React.Fragment>
            {rowData.date.date === 1
                ? <div className="row bg-info pl-5">
                    {getMonthName(rowData.date)}
                </div>
                : null
            }
            <div className="row border-bottom">
                <div className="col-1 date-col">
                    {rowData.date.months + 1} - {rowData.date.date}
                </div>
                {rowData.accounts.map((account) => {
                    return (
                        // Account column
                        <div className="col">
                            <div className="row">
                                {/* Transaction column */}
                                <div className="col-8">
                                    {account.transactions.map((transaction) => {
                                        return <div className={transaction.type === "income" ? "row text-success" : "row"}>{transaction.label}: {transaction.value}</div>
                                    })}
                                    {account.transfers.map((transfer) => {
                                        return <div className="row text-primary">Transfer from {transfer.fromAccountId} to {transfer.toAccountId}: {transfer.value}</div>
                                    })}
                                </div>
                                {/* Balance column */}
                                <div className={account.balance < 120
                                    ? (account.balance < 0
                                        ? "col-4 account-balance danger"
                                        : "col-4 account-balance warning")
                                    : "col-4 account-balance"}>
                                    {account.balance}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </React.Fragment>
    );
}
export default ProjectionRow;