import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import aboutUsSvg from "../../svgs/content-creator.svg";
import { useDispatch, useSelector } from "react-redux";

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
      maxWidth: "600px",
      padding: "20px",
      minHeight: "370px",
    },
  })
);
export default function AboutUs() {
  const classes = useStyles();
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  return (
    <div>
      <Container fixed>
        <CssBaseline />{" "}
        <Card className={classes.card}>
          <Grid>
            <Grid item xs>
              <div style={{ textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                  {lan[language].about}
                </Typography>
              </div>
            </Grid>
            <Grid item xs>
              <Typography>{lan[language].about_content}</Typography>
            </Grid>
            <Grid item xs>
              <div>
                <img src={aboutUsSvg} height="120px" />
              </div>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </div>
  );
}
