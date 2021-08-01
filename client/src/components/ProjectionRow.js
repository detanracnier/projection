import React from "react";
const moment = require('moment');

function ProjectionRow(props) {
    const {
        handleException,
        setDragElement,
        rowData,
        handleCellClicked
    } = props;

    // -------------------------
    //    Utility Functions
    // -------------------------
    function getMonthName(date) {
        let d = moment(date);
        let monthName = d.format("MMMM");
        return monthName;
    }

    function checkIfInPast(date) {
        let check = moment(date).isBefore(moment().startOf('day').toObject());
        return check;
    }

    // -------------------------
    //    Handler Functions
    // -------------------------

    function handleDragStart(event) {
        console.log("Dragging", event.target.id);
        let fromDate = event.target.dataset.date;
        let type = event.target.dataset.type;
        setDragElement(type+"::"+event.target.id+"::"+fromDate);
    }

    function handleDrag() {
        // console.log("Dragging");
    }

    function handleDragEnd(){
        // console.log("Ending");
    }

    function handleDrop(event) {
        // console.log("Dropped onto event", event);
        console.log("Dropped onto", event.target);
        let newDate = event.target.dataset.date;
        handleException(newDate);
        // let newDate = JSON.parse(event.target.dataset.date);
        // let thing = { newDate };
        // console.log("thing", thing);
    }

    function handleEnter(event) {
        // console.log("Entering");
    }

    function handleOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <React.Fragment>
            {rowData.date.date === 1
                ? <div className="row bg-info pl-5">
                    {getMonthName(rowData.date)}
                </div>
                : null
            }
            <div className={checkIfInPast(rowData.date) ? "row border-bottom in-past" : "row border-bottom"}>
                <div className="col-1 date-col">
                    {rowData.date.date}<span className="day-of-week-label">{moment(rowData.date).format('dddd')}</span>
                </div>
                {rowData.accounts.map((account) => {
                    return (
                        // Account column
                        <div className="col">
                            <div
                                className="row h100"
                                onClick={handleCellClicked}>
                                <div
                                    data-type="empty"
                                    data-date={JSON.stringify(rowData.date)}
                                    onDragEnter={handleEnter}
                                    onDragOver={handleOver}
                                    onDrop={handleDrop}
                                    className="col-8">
                                    {/* Transaction */}
                                    {account.transactions.map((transaction) => {
                                        return <div
                                            onClick={handleCellClicked}
                                            id={transaction._id}
                                            data-type="transaction"
                                            data-date={JSON.stringify(rowData.date)}
                                            draggable
                                            onDragStart={handleDragStart}
                                            onDrag={handleDrag}
                                            onDragEnd={handleDragEnd}
                                            className={transaction.type === "income"
                                                ? "row text-success"
                                                : "row"}>{transaction.label}: {transaction.value}</div>
                                    })}
                                    {/* Transfer */}
                                    {account.transfers.map((transfer) => {
                                        return (
                                            <div
                                                onClick={handleCellClicked}
                                                id={transfer._id}
                                                data-type="transfer"
                                                data-date={JSON.stringify(rowData.date)}
                                                className="row text-primary">
                                                {account.label === transfer.fromAccountLabel
                                                    ? (<React.Fragment><span className="text-sm">Transfer to </span> {transfer.toAccountLabel}: -</React.Fragment>)
                                                    : (<React.Fragment><span className="text-sm">Transfer from </span> {transfer.fromAccountLabel}: </React.Fragment>)}
                                                {transfer.value}
                                            </div>)
                                    })}
                                </div>
                                {/* Balance */}
                                {checkIfInPast(rowData.date)
                                    ? <div className="col-4 account-balance"></div>
                                    :
                                    <div
                                        onClick={handleCellClicked}
                                        id={account._id} data-type="account"
                                        className={account.balance < 120
                                            ? (account.balance < 0
                                                ? "col-4 account-balance danger"
                                                : "col-4 account-balance warning")
                                            : "col-4 account-balance"}>
                                        {account.balance}
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </React.Fragment>
    );
}
export default ProjectionRow;