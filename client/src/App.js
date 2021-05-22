// react modules
import React from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// Custom modules
import { Provider } from "./Context";


import SignIn from "./Componenets/SignIn/SignIn";
import SignUp from "./Componenets/SignUp/SignUp";
import ForgotPassword from "./Componenets/ForgotPassword/ForgotPassword"
import ChangeDetails from "./Componenets/ChangeDetails/ChangeDetails"
import Landing from "./Componenets/Landing/Landing"
import Navbar from "./Componenets/Navbar"



import Activity from "./Componenets/Activity/Activity";
import Scanning from "./Componenets/Scanning/Scanning";
import "./App.css";
import "antd/dist/antd.css";
import ResetPassword from './Componenets/ResetPassword/ResetPassword';

//import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div>
      <Router>
        <Provider>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing}></Route>
            <Route exact path="/login" component={SignIn}></Route>
            <Route exact path="/register" component={SignUp}></Route>
            <Route exact path="/activity" component={Activity}></Route>
            <Route exact path="/change-details" component={ChangeDetails}></Route>
            <Route exact path="/scan" component={Scanning}></Route>
            <Route exact path="/forgot-password" component = {ForgotPassword}></Route>
            <Route exact path="/reset-password" component = {ResetPassword}></Route>
            <Route path='*' render={() =>
            (
              <Redirect to="/" />
            )
            } />
          </Switch>
        </Provider>
      </Router>
    </div>
  );
}
export default App;