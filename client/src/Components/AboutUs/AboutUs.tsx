import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import aboutUsSvg from "../../svgs/content-creator.svg";
import { useDispatch, useSelector } from "react-redux";

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
    card: {
      margin: "0 auto",
      marginTop: "80px",
      width: "60%",
      padding: "20px",
      height: "370px",
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
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              {lan[language].about}
            </Typography>
          </div>
          <div>
            <Typography>{lan[language].about_content}</Typography>
          </div>
          <div>
            <img
              src={aboutUsSvg}
              height="120px"
              style={{
                margin: "20px",
                paddingLeft: "80%",
              }}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
}
