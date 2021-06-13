import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/authActions";
import GoogleLoginHooks from "./GoogleLogin/GoogleLogin";
import { useLoader } from "../../Contexts/LoaderContext";
import lan from "../../Languages/Languages.json";
import { Card } from "@material-ui/core";

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
  card: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function LoginPage({ history }) {
  const classes = useStyles();
  const { startLoading, finishLoading } = useLoader();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

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
        <Card className={classes.card}>
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
            {lan[language].sign_in_text_login_page}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={lan[language].register_email}
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
              label={lan[language].register_password}
              type="password"
              id="password"
              data-hook={DataHook.LoginPagePasswordTextField}
              autoComplete="current-password"
              onChange={onChange}
              value={password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={lan[language].remember}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {lan[language].sign_in_login_page}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link to="/forgotPassword" variant="body2">
                  {lan[language].forgot_password}{" "}
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2">
                  {lan[language].register_login_page}
                </Link>
              </Grid>
              <Grid item xs>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    marginTop: "20px",
                    marginBottom: "-30px",
                  }}
                >
                  <GoogleLoginHooks goToDashboard={() => goToDashboard()} />
                </div>
              </Grid>
            </Grid>
          </form>
        </Card>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
