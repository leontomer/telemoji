import React from "react";
import { VideoChat } from './Components/VideoChat/VideoChat';
import "./App.css";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Telemoji 😎
          </Typography>
          <Button color="inherit" href='/video-chat'>Demo</Button>
        </Toolbar>
      </AppBar>
      <Router>
        <Switch>
          <Route path="/video-chat" component={VideoChat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
