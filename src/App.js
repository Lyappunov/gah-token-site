import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import './index.scss'
import './assets/css/common.css';

// We use Route in order to define the different routes of our application

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./private-route/PrivateRoute";
import { Provider } from "react-redux";
import store from "./store/store";
import jwt_decode from "jwt-decode";
// We import all the components we need in our app

import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import TokenBuy from "./pages/tokenBuy";
import TokenSell from "./pages/tokenSell";
import setAuthToken from "./utils/setAuthToken";

import Home from "./pages/home";

import { setCurrentUser, logoutUser } from "./actions/authActions";


if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = "/signin";
  }
}

function App  ()  {
  
  return (
    <Provider store={store}>
      <Router>
        <Switch>
            <Route exact path="/">
              <Signin />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/signin">
              <Signin />
            </Route>
            <Switch>
                <PrivateRoute exact path="/home">
                  <Home />
                </PrivateRoute>
                <PrivateRoute exact path="/tokenbuy">
                  <TokenBuy />
                </PrivateRoute>
                <PrivateRoute exact path="/tokensell">
                  <TokenSell />
                </PrivateRoute>
            </Switch>
            
        </Switch> 
      </Router>
    </Provider>
  );
};

export default App;
