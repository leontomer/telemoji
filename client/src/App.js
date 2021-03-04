import React from "react";
import { Webrtc } from "./Components/Webrtc/Webrtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import LandingPage from "./Components/LandingPage/LandingPage";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/video-chat" component={Webrtc} />
      </Switch>
    </Router>
  );
}

export default App;
