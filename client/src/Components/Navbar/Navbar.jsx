import React from "react";
import {
  Avatar,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Button,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import CastConnectedIcon from "@material-ui/icons/CastConnected";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer } from "../../actions/addonActions";
import AsyncSearch from "./AsyncSearch/AsyncSearch";
import FriendRequests from "../Dashboard/FriendRequests";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  // @ts-ignore
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  // @ts-ignore
  const firstName = useSelector((state) => state.authReducer.user.firstName);
  // @ts-ignore
  const userImage = useSelector((state) => state.authReducer.user.imageAddress);

  const authenticatedContent = (
    <div className="navAuthContent">
      <div>
        <AsyncSearch />
      </div>
      <div className="avatarSection">
        <div className="friendRequests">
          <FriendRequests />
        </div>
        <div className="avatarButton">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(openDrawer())}
            style={{ marginLeft: 30 }}
          >
            {firstName &&
              firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            <Avatar alt="Remy Sharp" src={userImage} style={{ margin: 10 }} />
          </IconButton>
        </div>
      </div>
    </div>
  );

  const notAuthenticatedContent = (
    <div className="authContent">
      <Link to="/login">
        <Button
          style={{
            background: " #5499c7 ",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button
          style={{
            background: "  #ec7063  ",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Register
        </Button>
      </Link>
    </div>
  );
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#53317e", color: "#fbfcfc" }}
    >
      <Toolbar>
        <Typography className={classes.title} variant="h6" noWrap>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <CastConnectedIcon fontSize="large" />
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <h2 className="navbar-title" style={{ margin: "15px" }}>
                Telemoji
              </h2>
            </Link>
          </div>
        </Typography>
        {isAuthenticated === null
          ? null
          : isAuthenticated
            ? authenticatedContent
            : notAuthenticatedContent}
      </Toolbar>
    </AppBar>
  );
}
