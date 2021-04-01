import React from "react";
import "./WelcomeBanner.scss";
import welcomeBannerSvg from "../../../svgs/welcomeBannerSvg.svg";
import { useSelector } from "react-redux";

const WelcomeBanner = () => {
  const firstName = useSelector((state) => state.authReducer.user.firstName);
  return (
    <div className="WelcomeBannerContainer">
      <div style={{ color: "white", fontSize: 30 }}>
        {firstName && (
          <h1>
            Good evening,{" "}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
          </h1>
        )}
      </div>
      <div>
        <p
          style={{
            color: "white",
            fontSize: 18,
            marginTop: 15,
            marginLeft: 120,
          }}
        >
          Have a chat with your friends!
        </p>
      </div>
      <div style={{ marginLeft: 1200 }}>
        <img src={welcomeBannerSvg} height="120px" />
      </div>
    </div>
  );
};

export default WelcomeBanner;
