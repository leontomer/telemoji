import React, { useEffect } from "react";
import { Webrtc } from "./Components/Webrtc/Webrtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import LandingPage from "./Components/LandingPage/LandingPage";
import Navbar from "./Components/Navbar/Navbar";
import { SnackItem } from "./Components/SnackbarItem/SnackItem";
import Dashboard from "./Components/Dashboard/Dashboard";
//redux
import { Provider } from "react-redux";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import { loadUser } from "./actions/authActions";
import { loadFaceapi, loadEmotionRecognitionModel } from './actions/modelActions';
import setAuthToken from "./utilities/setAuthToken";
import { DrawerComponent } from "./Components/Drawer/Drawer";
import store from "./store";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadFaceapi());
    store.dispatch(loadEmotionRecognitionModel());
  }, []);

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute exact path="/video-chat" component={Webrtc} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch>
      </Router>
      <SnackItem />
      <DrawerComponent />
    </Provider>
  );
}

export default App;
