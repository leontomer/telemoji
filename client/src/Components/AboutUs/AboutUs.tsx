import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import lan from "../../Languages/Languages.json";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 200,
    maxWidth: 1800,
    textAlign: "center",
  },
});

export default function AboutUs() {
  const classes = useStyles();
  const dispatch = useDispatch();
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  return (
    <div className={classes.root}>
      <Typography variant="h2" component="h2" gutterBottom>
        {lan[language].about}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {lan[language].about_content}
      </Typography>
    </div>
  );
}
