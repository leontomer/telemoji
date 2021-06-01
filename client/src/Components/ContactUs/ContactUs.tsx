import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import questionsSvg from "../../svgs/questions.svg";
import { contactUs } from "../../actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import lan from "../../Languages/Languages.json";
import { Grid } from "@material-ui/core";
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
    card: {
      margin: "0 auto",
      marginTop: "80px",
      minWidth: "50%",
      maxWidth: "600px",
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
    dispatch(setMessage(lan[language].contact_message, snackbarType.success));
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Container fixed>
        <CssBaseline />{" "}
        <Card className={classes.card}>
          <Grid>
            <Grid item xs>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h4" gutterBottom>
                  {lan[language].contact_us}
                </Typography>
              </div>
            </Grid>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div>
                <TextField
                  style={{ width: "80%", height: "150px", marginLeft: "10%" }}
                  inputProps={{
                    min: 0,
                  }}
                  id="outlined-multiline-static"
                  multiline
                  rows={8}
                  variant="outlined"
                  label={lan[language].contact_text}
                  value={value}
                  onChange={handleChange}
                />
                <div
                  style={{
                    marginLeft: "75%",
                    marginTop: "100px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    {lan[language].send}
                  </Button>{" "}
                </div>
              </div>{" "}
              <img
                src={questionsSvg}
                height="120px"
                style={{ margin: "20px", marginTop: "-200px" }}
              />
            </form>
          </Grid>
        </Card>
      </Container>
    </div>
  );
}
