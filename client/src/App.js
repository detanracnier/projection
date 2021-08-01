import React, { useState } from "react";
import ProjectionPage from "./components/ProjectionPage";
import TransactionsPage from "./components/TransactionsPage";
import TransfersPage from "./components/TransfersPage";
import AccountsPage from "./components/AccountsPage";
import './App.css';

function App() {
  const [activePage, setActivePage] = useState("projection");

  // -------------------------
  //    Handler Functions
  // -------------------------

  function handleNavClick(event){
    console.log(event.target.value);
    setActivePage(event.target.value);
  }

  // -------------------------
  //    Render Functions
  // -------------------------

  function renderPage(){
    if(activePage === "projection"){
      return <ProjectionPage />
    }
    if(activePage === "transactions"){
      return <TransactionsPage />
    }
    if(activePage === "transfers"){
      return <TransfersPage />
    }
    if(activePage === "accounts"){
      return <AccountsPage />
    }
  }

  return (
    <div className="App">
      <div>
        {/* Page controls */}
        <button
          value="projection"
          className={activePage === "projection" ? "btn btn-success m-1": "btn btn-dark m-1"}
          onClick={handleNavClick} >
            Projection
        </button>
        <button
          value="transactions"
          className={activePage === "transactions" ? "btn btn-success m-1": "btn btn-dark m-1"}
          onClick={handleNavClick} >
            Add/Edit Transactions
        </button>
        <button
          value="transfers"
          className={activePage === "transfers" ? "btn btn-success m-1": "btn btn-dark m-1"}
          onClick={handleNavClick} >
            Add/Edit Transfers
        </button>
        <button
          value="accounts"
          className={activePage === "accounts" ? "btn btn-success m-1": "btn btn-dark m-1"}
          onClick={handleNavClick} >
            Edit Accounts
        </button>
      </div>
      {renderPage()}
    </div>
  );
}

export default App;
