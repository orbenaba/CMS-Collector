// react modules
import React from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// Custom modules
import { Provider } from "./Context";
import Home from "./Componenets/Home/Home";
import Navbar from "./Componenets/Navbar/Navbar";
// import Login from "./Componenets/Login/Login";
// import Register from "./Componenets/Register/Register";
// import ForgotPassword from './Componenets/ForgetPassword/ForgetPassword';
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
import SignIn from "./Componenets/NewDesign/SignIn/SignIn";
import SignUp from "./Componenets/NewDesign/SignUp/SignUp";
import ForgotPassword from "./Componenets/NewDesign/ForgotPassword/ForgotPassword"
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
import Logout from './Componenets/Logout/logout';
import Sidebar from "./Componenets/Sidebar/Sidebar";
import Activity from "./Componenets/Activity/Activity";
import Scanning from "./Componenets/Scanning/Scanning";
import Account from "./Componenets/Account/Account";
import ChangeDetails from "./Componenets/Change-Details/ChangeDetails";
import "./App.css";
import ResetPassword from './Componenets/ResetPassword/ResetPassword';
//import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div>
      <Router>
        <Provider>
          <Sidebar width={150} height={"100vh"}>
          </Sidebar>
          <Navbar></Navbar>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/login" component={SignIn}></Route>
            <Route exact path="/register" component={SignUp}></Route>
            <Route exact path="/logout" component={Logout}></Route>
            <Route exact path="/my-activity" component={Activity}></Route>
            <Route exact path="/change-details" component={ChangeDetails}></Route>
            <Route exact path="/scanning" component={Scanning}></Route>
            <Route exact path="/account" component={Account}></Route>
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