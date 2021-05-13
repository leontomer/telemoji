import React, { useState, useEffect } from "react";
import "./WelcomeBanner.scss";
import welcomeBannerSvg from "../../../svgs/welcomeBannerSvg.svg";
import { useSelector } from "react-redux";
import lan from "../../../Languages/Languages.json";

const WelcomeBanner = () => {
  // @ts-ignore
  const firstName = useSelector((state) => state.authReducer.user.firstName);

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  var today = new Date();
  var curHr = today.getHours();
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (curHr < 12) {
      setWelcomeMessage(lan[language].dashboard_morning_message);
    } else if (curHr < 18) {
      setWelcomeMessage(lan[language].dashboard_afternoon_message);
    } else {
      setWelcomeMessage(lan[language].dashboard_evening_message);
    }
  }, [language]);

  return (
    <div className="WelcomeBannerContainer">
      <div style={{ color: "white", fontSize: 30 }}>
        {firstName && (
          <h1>
            {welcomeMessage},{" "}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
          </h1>
        )}
        <div>
          {welcomeMessage && (
            <p
              style={{
                color: "white",
                fontSize: 18,
                marginLeft: 120,
                marginTop: 10,
              }}
            >
              {lan[language].dashboard_secondary_message}
            </p>
          )}
        </div>
      </div>

      <div>
        <img src={welcomeBannerSvg} height="120px" />
      </div>
    </div>
  );
};

export default WelcomeBanner;
