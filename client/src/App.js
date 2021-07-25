import React, { useState, useEffect } from "react";
import AccountColumn from "./components/AccountColumn";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import './App.css';
// import { accountsData, transactionsData } from "../src/data/data";
const moment = require('moment');


let numRows = [];
for (let x = 0; x < 80; x++) {
  numRows.push(x);
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // API calls to get initial state
  useEffect(() => {
    //get all accounts
    axios.post('/api/account/search', {})
      .then( response => {
        console.log("Setting Accounts", response.data);
        setAccounts(response.data);
      })
      .catch( err => {
        console.log(err);
      });
    //get all transactions
    axios.post('/api/transaction/search',{})
      .then( response => {
        console.log("Setting Transactions", response.data);
        setTransactions(response.data);
      })
      .catch( err => {
        console.log(err);
      });
  },[]);


  return (
    <div className="App">
      <div className="container p-1">
        <div className="row">
          <div className="col-1">
            <div className="row">date</div>
            {numRows.map((index)=>{
              const rowDate = moment().add(index, 'days').toObject();
              return <div className="row">{rowDate.months} - {rowDate.date}</div>
            })}
          </div>
          {accounts.map((account) => {
            console.log("Account Map");
            let t = transactions.filter((transaction) => transaction.accountId === account.id);
            return (<AccountColumn
              key={uuidv4()}
              numRows={numRows}
              account={account}
              transactions={t}
            />)
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
