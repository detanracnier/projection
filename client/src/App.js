import React, { useState } from "react";
import ProjectionPage from "./components/ProjectionPage";
import TransactionsPage from "./components/TransactionsPage";
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
          className="btn btn-dark m-1"
          onClick={handleNavClick} >
            Projection
        </button>
        <button
          value="transactions"
          className="btn btn-dark"
          onClick={handleNavClick} >
            Add/Edit Transactions
        </button>
        <button
          value="accounts"
          className="btn btn-dark"
          onClick={handleNavClick} >
            Add/Edit Accounts
        </button>
      </div>
      {renderPage()}
    </div>
  );
}

export default App;
