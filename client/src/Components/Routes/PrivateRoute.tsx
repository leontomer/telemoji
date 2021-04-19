import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(
    isAuthenticated
  );
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setUserIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (localStorage.token) {
      setUserIsAuthenticated(true);
    }
  }, []);
  useEffect(() => {
    setLoadingPage(false);
  }, [userIsAuthenticated]);
  return (
    <Route
      {...rest}
      render={(props) =>
        !loadingPage && !userIsAuthenticated ? (
          <Redirect to="/login" />
        ) : (
            <Component {...props} />
          )
      }
    />
  );
};


export default PrivateRoute;
