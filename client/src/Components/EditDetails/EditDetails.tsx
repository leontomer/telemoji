import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import { Content } from "../../Common/content";
import { DataHook } from "../../Common/DataHooks";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import Typography from "@material-ui/core/Typography";
import { editDetails } from "../../actions/usersActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import lan from "../../Languages/Languages.json";
import { Card } from "@material-ui/core";
export default function EditDetails() {
  const dispatch = useDispatch();
  //check if the user new password entered is the same as the confirm new password like i did in reset password component
  // get from server the current user first name+last name or check if the fields are empty then dont change them in the database

  // @ts-ignore
  const user = useSelector((state) => state.authReducer.user);
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>(user.firstName);
  const [lastName, setLastName] = React.useState<string>(user.lastName);
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    setFirstName(user.firstName);
  }, [user]);

  useEffect(() => {
    setLastName(user.lastName);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setMessage("Passwords do not match", snackbarType.error));
    } else {
      dispatch(
        editDetails({
          firstName: firstName,
          lastName: lastName,
          currentPassword: oldPassword,
          password: password,
        })
      );
    }
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
    card: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  const classes = useStyles();
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

  return (
    <div style={{ marginTop: 20 }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />{" "}
        <Card className={classes.card}>
          <Typography variant="h4" gutterBottom>
            {lan[language].edit_details}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="First name"
              label={lan[language].register_first_name}
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
              label={lan[language].register_last_name}
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
              label={lan[language].current_pass}
              type="password"
              id="oldPassword"
              data-hook={DataHook.LoginPagePasswordTextField}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  name="checkedA"
                />
              }
              label={lan[language].change_password}
            />

            {checked && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={lan[language].new_password}
                type="password"
                id="password"
                data-hook={DataHook.LoginPagePasswordTextField}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {checked && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirm password"
                label={lan[language].confirm_new_password}
                type="password"
                id="password"
                data-hook={DataHook.LoginPagePasswordTextField}
                autoComplete="current-password"
                onChange={(e) => setPassword2(e.target.value)}
                value={password2}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {lan[language].profile_save}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}
