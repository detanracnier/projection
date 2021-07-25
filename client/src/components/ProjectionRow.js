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
                ? <div className="row bg-info">
                    {getMonthName(rowData.date)}
                </div>
                : null
            }
            <div className="row border-bottom">
                <div className="col-1">
                    {rowData.date.months + 1} - {rowData.date.date}
                </div>
                {rowData.accounts.map((account) => {
                    return (
                        // Account column
                        <div className="col">
                            <div className="row">
                                {/* Transaction column */}
                                <div className="col">
                                    {account.transactions.map((transaction) => {
                                        return <div className="row">{transaction.label}: {transaction.value}</div>
                                    })}
                                </div>
                                {/* Balance column */}
                                <div className="col">
                                    <div className="row">
                                        {account.balance}
                                    </div>
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