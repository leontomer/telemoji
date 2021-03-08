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
  useEffect(() => {
    setUserIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Route
      {...rest}
      render={(props) =>
        !userIsAuthenticated ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
