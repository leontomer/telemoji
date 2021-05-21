import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { contactUs } from "../../actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import lan from "../../Languages/Languages.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);
export default function ContactUs() {
  const dispatch = useDispatch();
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const classes = useStyles();
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(contactUs({ message: value }));
    dispatch(
      setMessage(
        "Thank you. we will be in touch with you soon.",
        snackbarType.success
      )
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Container fixed>
        <CssBaseline />{" "}
        <Typography variant="h4" gutterBottom>
          {lan[language].contact_us}
        </Typography>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <TextField
              style={{ width: "35%", maxHeight: "30px" }}
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
              }}
              id="standard-multiline-flexible"
              label={lan[language].contact_us}
              multiline
              rows={13}
              value={value}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {lan[language].send}
            </Button>{" "}
          </div>{" "}
        </form>
      </Container>
    </div>
  );
}
