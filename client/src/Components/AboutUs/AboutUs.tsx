import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import aboutUsSvg from "../../svgs/content-creator.svg";

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

  return (
    <div>
      <Container fixed>
        <CssBaseline />{" "}
        <Card className={classes.card}>
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              About Us
            </Typography>
          </div>
          <div>
            <Typography>
              Telemoji is a video chat web application with facial expression
              recognition, created by Tomer Leon, Alex Kreinis And Tom Damri in
              2021. the main purpose of Telemoji is to help people suffering
              from ASD communicate by Improving their expression detection
              skills while they chat with their friends. Telemoji is the best,
              and also the only solution for you if you want to talk with your
              friends in a live video chat and see their facial expression
              detection. also, in Telemoji you can see your call history with
              every call emotion statistics.
            </Typography>
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
