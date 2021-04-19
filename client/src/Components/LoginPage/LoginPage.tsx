import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { DataHook } from "../../Common/DataHooks";
import { Content } from "../../Common/content";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authActions";
import GoogleLoginHooks from "./GoogleLogin/GoogleLogin";
import { useLoader } from '../../Contexts/LoaderContext';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {Content.copyright}
      <Link color="inherit" href="#">
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

export default function LoginPage({ history }) {
  const classes = useStyles();
  const { startLoading, finishLoading } = useLoader();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = loginData;

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      startLoading();
      await dispatch(login(loginData));
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
        <Typography
          component="h1"
          variant="h5"
          data-hook={DataHook.LoginPageSignInText}
        >
          {Content.login_page_sign_in}
        </Typography>
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {Content.login_page_sign_in_button}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {Content.login_page_forgot_password}
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {Content.login_page_sign_up}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <div style={{ width: "400px", height: "100px", marginTop: '20px' }}>
        <GoogleLoginHooks goToDashboard={() => goToDashboard()} />
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
