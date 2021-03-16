import React, { useState } from "react";
import FriendInfoCard from "./FriendInfoCard/FriendInfoCard";
import FriendsList from "./FriendsList/FriendsList";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { FriendProps } from "./Dashboard.api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

const Dashboard = () => {
  const [friendInFocus, setFriendInFocus] = useState<FriendProps | null>(null);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1} direction="row">
        <Grid container item spacing={3}>
          <Grid item xs={2}>
            <FriendsList setFriendInFocus={setFriendInFocus} />
          </Grid>
          <Grid item xs={4}>
            <FriendInfoCard friendInFocus={friendInFocus} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
