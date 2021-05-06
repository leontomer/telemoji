import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { DataHook } from "../../Common/DataHooks";
import { Content } from "../../Common/content";
import { useDispatch } from "react-redux";
import { useLoader } from "../../Contexts/LoaderContext";
import { forgotPassword } from "../../actions/authActions";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {Content.copyright}
      <Link color="inherit" to="/">
        {Content.app_name}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

export default function ForgotPassword({ history }) {
  const classes = useStyles();
  const { startLoading, finishLoading } = useLoader();

  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      startLoading();
      await dispatch(forgotPassword(email));
      alert(`reset password email has been sent to ${email}`);
      finishLoading();
      history.push("/dashboard");
    } catch (error) {
      finishLoading();
      return;
    }
  };

  const goToDashboard = () => {
    history.push("/dashboard");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="h2" data-hook={DataHook.LoginPageTitle}>
          {Content.app_name}
        </Typography>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={Content.login_page_username}
            name="email"
            data-hook={DataHook.LoginPageUsernameTextField}
            autoFocus
            onChange={onChange}
            value={email}
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

          <Grid container>
            <Grid item xs>
              <Link to="/login" variant="body2">
                {Content.forgot_password_page_login}
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {Content.forgot_password_page_sign_up}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <div style={{ width: "400px", height: "100px", marginTop: "20px" }}></div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
