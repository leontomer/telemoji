import React from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import { Content } from "../../Common/content";
import { DataHook } from "../../Common/DataHooks";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDispatch } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
export default function EditDetails() {
  //check if the user new password entered is the same as the confirm new password like i did in reset password component

  const [originalPassword, setOriginalPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleSubmit = () => {
    console.log(
      "old password: ",
      oldPassword,
      "current password1: ",
      password,
      "current password2: ",
      password2,
      "first name: ",
      firstName,
      "last name: ",
      lastName
    );
  };
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />{" "}
        <Typography variant="h4" gutterBottom>
          Edit Your Details
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="First name"
            label="first name"
            type="text"
            id="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="last name"
            label="Last name"
            type="text"
            id="lastName"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="oldPassword"
            label="Current Password"
            type="password"
            id="oldPassword"
            data-hook={DataHook.LoginPagePasswordTextField}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New password"
            type="password"
            id="password"
            data-hook={DataHook.LoginPagePasswordTextField}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm password"
            label="Confirm new Password"
            type="password"
            id="password"
            data-hook={DataHook.LoginPagePasswordTextField}
            autoComplete="current-password"
            onChange={(e) => setPassword2(e.target.value)}
            value={password2}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Save
          </Button>
        </form>
      </Container>
    </div>
  );
}
