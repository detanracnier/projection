import React, { useState, useEffect } from "react";
import ProjectionPage from "./components/ProjectionPage";
import TransactionsPage from "./components/TransactionsPage";
import TransfersPage from "./components/TransfersPage";
import AccountsPage from "./components/AccountsPage";
import { OktaAuth } from "@okta/okta-auth-js";
import './App.css';
const BASE_PATH =  "https://rosio-projection.herokuapp.com/";

const OktaAuthClient = new OktaAuth({
  scopes: [
    "openid",
    "profile",
    "email"
  ],
  issuer: "https://dev-99014916.okta.com/oauth2/default",
  clientId: "0oa1gzxlndwFvyyCa5d7",
  redirectUri: BASE_PATH,
  tokenManager: {
    storage: "localStorage",
    expireEarlySeconds: 600,
    autoRenew: true
  },
  responseType: [
    'id_token',
    'token'
  ],
  pkce: false
});

function App() {

  const [notAuthorized, setNotAuthorised] = useState(true);

  async function checkAuthorization(){
    let oToken = await OktaAuthClient.tokenManager.getTokens();
    // Add token to context and share with API calls
    console.log("Token", oToken);
    if(Object.keys(oToken).length  === 0){
      console.log("No token found");
      if(window.location.href.indexOf("access_token")>-1){
        let { tokens } = await OktaAuthClient.token.parseFromUrl()
        console.log("tokens",tokens);
        OktaAuthClient.tokenManager.setTokens(tokens);
        setNotAuthorised(false);
      } else {
        OktaAuthClient.token.getWithRedirect({});
      }
    } else {
      setNotAuthorised(false);
    }
  }

  useEffect(()=>{
    checkAuthorization();
  })

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

  if(notAuthorized){
    return (
      <div className="App">
        ...redirecting
      </div>
    )
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
