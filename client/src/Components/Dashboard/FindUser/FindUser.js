import React, { useState, useEffect } from "react";
import { addFriend, findUser } from "../../../actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import SearchBar from "material-ui-search-bar";

export default function FindUser(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [email, setEmail] = useState("");
  const [searchedFriend, setSearchedFriend] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddFriendDisabled, setIsAddFriendDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  const getProfileHandler = async (e) => {
    try {
      e.preventDefault();
      const friend = await dispatch(findUser(email));
      setSearchedFriend(friend);
      // }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddFriend = async () => {
    setIsAddFriendDisabled(true);
    try {
      dispatch(addFriend({ userEmail: user.email, userFriendEmail: email }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddFriendDisabled(false);
    }
  };

  return (
    <div>
      {" "}
      <form onSubmit={getProfileHandler}>
        <div style={{ marginTop: 20, maxWidth: 290, marginLeft: -55 }}>
          <SearchBar value={email} onChange={(text) => setEmail(text)} />
          <Button
            style={{ marginTop: 5 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </div>{" "}
      </form>
      {isLoading ? (
        <div
          style={{
            height: "58%",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      ) : (
        <div style={{ marginTop: 20, maxWidth: 290, marginLeft: -55 }}>
          {searchedFriend && (
            <Card title={searchedFriend.FirstName}>
              <div style={{ float: "left" }}>
                <Avatar size="xlarge" rounded />
              </div>
              <div>{searchedFriend.email}</div>
              <div>
                <Button
                  disabled={isAddFriendDisabled}
                  title="Add as friend"
                  onClick={handleAddFriend}
                >
                  Add as friend
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
