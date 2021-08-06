import React, { useState } from "react";
import axios from "axios";
const moment = require('moment');

function SetDateForm(props){
    const {
        startFromDate,
        dateToEdit,
        setShowSetDateForm,
        accounts,
        handleUpdate
    } = props

    const [balances, setBalances] = useState(accounts.map((a)=>a.balance));
    const [selDate, setSelDate] = useState(dateToEdit);

    function handleClickOut(event){
        if (event.target.id === "modal-background") {
            setShowSetDateForm(false);
        }
    }

    function handleDateChange(event){
        let newDate = moment(selDate);
        newDate = newDate.add(parseInt(event.target.value),'days');
        newDate = newDate.toObject();
        console.log(newDate);
        setSelDate(newDate)
    }

    function handleInputChange(event){
        let newBalances = [...balances];
        newBalances[event.target.name] = parseInt(event.target.value);
        console.log(newBalances);
        setBalances(newBalances)
    }

    function handleSave(){
        let newDate = {...startFromDate}
        newDate.date = selDate;
        let id = startFromDate._id;
        axios.put('/api/projectionDate/'+id, newDate)
        .then(response => {
          console.log("Setting Date", response.data);
            accounts.forEach((account,index)=>{
                handleUpdate("update",{...account,balance:balances[index]},"account");
            })
            window.location.reload();
        })
        .catch(err => {
          console.log(err);
        });
    }

    function renderAccounts(){
        return accounts.map((account,index) => {
            return(
                <div className="row">
                    <div className="col-7">
                        {account.label}
                    </div>
                    <div className="col-5">
                        <span>Balance:</span>
                        <input
                            type="number"
                            name={index}
                            value={balances[index]}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            )
        })
    }

    return (
        <React.Fragment>
            <div id="modal-background" className="modal-bg" onClick={handleClickOut}>
                <div class="account-modal" >
                    <div className="row transaction-container" >
                        <div className="col-12 p-0">
                            <div className="row danger-gradient round-tl m-0 p-3" style={{fontSize:"1.5rem"}}>
                                <div className="col-9">
                                    Set Projection date to {selDate.months+1}-{selDate.date}-{selDate.years}
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-success btn-sm"
                                        style={{minWidth:"32px"}}
                                        onClick={handleDateChange} value="1">+</button>
                                    <button
                                        className="btn btn-success btn-sm ml-1"
                                        style={{minWidth:"32px"}}
                                        onClick={handleDateChange} value="-1">-</button>
                                </div>
                            </div>
                                <div className="col-12">
                                    {renderAccounts()}
                                </div>
                                <div className="col-12">
                                    <button
                                        className="btn btn-success btn-lg btn-block"
                                        onClick={handleSave}
                                        >Save</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default SetDateForm;