import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Analytics from "./Pages/Analytics/Analytics";
import "./App.css";
import Layout from "./Pages/Layout";
import Mainbody from "./Pages/MainBody/Mainbody";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/SIgnup/Signup";
import TestPage from "./Pages/TestPage/TestPage";
import RechartPieChart from "./Components/Charts/RechartPieChart";

function App() {
    const pageNotFound = () => {
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{textAlign: "center"}}>
                    <h1 style={{fontSize: "60px", fontWeight: "normal", marginTop: "40px"}}>404</h1>
                    <br/>
                    <br/><br/>
                    <p style={{fontSize: "40px"}}>Whoops, nothing to see here</p>
                    <br/>
                    <p>Sorry, we couldn't find what you are looking for or the page no longer exists</p>
                    <br/><br/>
                    <p>Perhaps you can return back to <Link to="/"
                                                            style={{textDecoration: "none"}}> Homepage </Link> and see
                        if you find what you are looking for.</p>
                </div>

            </div>
        );
    };

    return (
        <Router basename={"/app"}>
            <div className="App">
                <Switch>
                    <Route exact path="/">
                        <Layout>
                            <Mainbody/>
                        </Layout>
                    </Route>
                    <Route path="/event/:id">
                        <TestPage/>
                    </Route>
                    <Route path="/analytics">
                        <Layout>
                            <Analytics/>
                        </Layout>
                    </Route>
                    <Route path="/profile">
                        <Layout>
                            <Profile/>
                        </Layout>
                    </Route>
                    <Route path="/login" component={Login}/>
                    <Route path="/signup" component={Signup}/>
                    {/* <Route path="/testpage" component={TestPage}/> */}
                    <Route path="/testComponent" component={RechartPieChart}/>
                    <Route component={pageNotFound}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
