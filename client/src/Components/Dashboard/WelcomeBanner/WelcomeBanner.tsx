import React, { useState, useEffect } from "react";
import "./WelcomeBanner.scss";
import welcomeBannerSvg from "../../../svgs/welcomeBannerSvg.svg";
import { useSelector } from "react-redux";
import { useSpring, animated } from 'react-spring'

const WelcomeBanner = () => {
  // @ts-ignore
  const firstName = useSelector((state) => state.authReducer.user.firstName);
  var today = new Date()
  var curHr = today.getHours()
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const styles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    delay: 2000
  })

  useEffect(() => {
    if (curHr < 12) {
      setWelcomeMessage('Good morning')
    } else if (curHr < 18) {
      setWelcomeMessage('Good afternoon')
    } else {
      setWelcomeMessage('Good evening')
    }
  }, [])


  return (
    <div className="WelcomeBannerContainer">
      <div style={{ color: "white", fontSize: 30 }}>
        {firstName && (
          <h1>
            {welcomeMessage}, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
          </h1>
        )}
        <div>
          {welcomeMessage && <p
            style={{
              color: "white",
              fontSize: 18,
              marginLeft: 120,
              marginTop: 10
            }}
          >
            Have a chat with your friends!
        </p>}
        </div>
      </div>

      <animated.div style={{
        ...styles,
      }}>
        <img src={welcomeBannerSvg} height="120px" />
      </animated.div>
    </div>
  );
};

export default WelcomeBanner;
