import React from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router";

function ResetPassword({ history, match }) {
  const hashedToken = match.params.hashedToken;
  return <div>{hashedToken}</div>;
}

export default withRouter(ResetPassword);
