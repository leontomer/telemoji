import React, { useEffect } from "react";
import { Webrtc } from "./Components/Webrtc/Webrtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import LandingPage from "./Components/LandingPage/LandingPage";
import Navbar from "./Components/Navbar/Navbar";
import { SnackItem } from "./Components/SnackbarItem/SnackItem";
import Dashboard from "./Components/Dashboard/Dashboard";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import { loadUser } from "./actions/authActions";
import {
  loadFaceapi,
  loadEmotionRecognitionModel,
} from "./actions/modelActions";
import {
  recieveCalls,
  getAnswerFromCall
} from "./actions/callActions";
import setAuthToken from "./utilities/setAuthToken";
import { DrawerComponent } from "./Components/Drawer/Drawer";
import { useSelector } from "react-redux";
import { TelemojiProvider } from "./Contexts/TelemojiContext";
import { RecieveCallModal } from "./Components/Modals/RecieveCallModal";
import { updateFriendRequests } from './actions/friendActions';
import store from "./store";

function App() {
  const socket = useSelector((state) => state.socketReducer.socket);
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadFaceapi());
    store.dispatch(loadEmotionRecognitionModel());
  }, []);

  useEffect(() => {
    if (socket) {
      store.dispatch(recieveCalls());
      store.dispatch(getAnswerFromCall());
      store.dispatch(updateFriendRequests());
    }
  }, [socket]);

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  return (
    <TelemojiProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute exact path="/video-chat" component={Webrtc} />
          <PrivateRoute exact path="/video-chat/:callerId" component={Webrtc} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch>
        <RecieveCallModal />
      </Router>
      <SnackItem />
      <DrawerComponent />
    </TelemojiProvider>
  );
}

export default App;
