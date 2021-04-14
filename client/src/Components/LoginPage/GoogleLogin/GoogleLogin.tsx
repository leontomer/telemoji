import React, { useLayoutEffect } from "react";
import { useGoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../../actions/authActions";
import { refreshTokenSetup } from "./RefreshToken";
import { clientId } from "../../../Common/constants";
import "./GoogleLogin.scss";

function GoogleLoginHooks({ goToDashboard }) {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  useLayoutEffect(() => {
    console.log('isAuthenticated: ', isAuthenticated)
    if (isAuthenticated) {
      goToDashboard();
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();
  const onSuccess = (res) => {
    console.log("on success has been called")
    dispatch(loginWithGoogle(res.tokenId));
    refreshTokenSetup(res);

  };
  const onFailure = (res) => {
    console.error("login failed: res:", res);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: false,
    accessType: "offline",
  });

  return (
    <button
      onClick={() => {
        console.log("sign in has been called")
        signIn()
      }}
      type="button"
      className="login-with-google-btn"
    >
      Sign in with Google
    </button>
  );
}

export default GoogleLoginHooks;
