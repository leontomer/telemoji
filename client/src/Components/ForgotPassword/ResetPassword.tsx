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
import { changePassword } from "../../actions/authActions";
import Typography from "@material-ui/core/Typography";

function ResetPassword({ history, match }) {
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const dispatch = useDispatch();

  const Token = match.params.token;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setMessage("Passwords do not match", snackbarType.error));
    } else {
      try {
        const res = await dispatch(changePassword(Token, password));
        dispatch(setMessage("Reset password succeeded!", snackbarType.success));
      } catch (error) {
        return;
      }
    }
  };

  const onChange = (e) => {
    setPassword(e.target.value);
  };

  const onChange2 = (e) => {
    setPassword2(e.target.value);
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />{" "}
        <Typography variant="h4" gutterBottom>
          Reset your password
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={Content.login_page_password}
            type="password"
            id="password"
            data-hook={DataHook.LoginPagePasswordTextField}
            autoComplete="current-password"
            onChange={onChange}
            value={password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm password"
            label="Confirm Password"
            type="password"
            id="password"
            data-hook={DataHook.LoginPagePasswordTextField}
            autoComplete="current-password"
            onChange={onChange2}
            value={password2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {Content.forgot_password_page_send_email_button}
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default withRouter(ResetPassword);
