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
import Loader from './Components/Loader/Loader';
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
import { friendListListener, pendingFriendRequestsListener } from './actions/friendActions';
import SelfFaceDetection from './Components/SelfFaceDetection/SelfFaceDetection';
import store from "./store";
import './App.css'

function App() {
  // @ts-ignore
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
      store.dispatch(friendListListener());
      store.dispatch(pendingFriendRequestsListener());
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
          <PrivateRoute exact path="/self-detection" component={SelfFaceDetection} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch>
        <RecieveCallModal />
        <SnackItem />
        <DrawerComponent />
        <Loader />
      </Router>
    </TelemojiProvider>
  );
}

export default App;
