import React from "react";
import { Avatar, Typography, IconButton, Toolbar, AppBar, Button } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import CastConnectedIcon from "@material-ui/icons/CastConnected";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer } from "../../actions/addonActions";
import AsyncSearch from "./AsyncSearch/AsyncSearch";
import FriendRequests from "../Dashboard/FriendRequests"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "red",
  },
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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const firstName = useSelector((state) => state.authReducer.user.firstName);
  const userImage = useSelector((state) => state.authReducer.user.imageAddress)

  const authenticatedContent = (
    <>
    <div>
      <FriendRequests/>
    </div>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
        </div>
        <AsyncSearch />
      </div>
      <div style={{ marginLeft: 15 }}>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
          onClick={() => dispatch(openDrawer())}
          style={{ marginLeft: 30 }}
        >
          {firstName &&
            firstName.charAt(0).toUpperCase() + firstName.slice(1)
          }
          <Avatar
            alt="Remy Sharp"
            src={userImage}
            style={{ margin: 10 }}
          />
        </IconButton>
      </div>
    </>
  );

  const notAuthenticatedContent = (
    <div
      style={{
        width: "170px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {" "}
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
    <div className={classes.root}>
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
    </div>
  );
}
