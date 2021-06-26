import React, {Fragment} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Provider } from "react-redux";
import './App.css'
const App = () => (
        <Router>
            <Fragment>
                <Navbar></Navbar>
                <Route exact path='/' component = {Landing} />
                <section className="container">
                    <Switch>
                        <Route path="/register" component={Register}></Route>
                        <Route path="/login" component={Login}></Route>
                    </Switch>
                </section>
            </Fragment>
        </Router> 
);

export default App;