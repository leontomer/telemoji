import React, { useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { snackbarType } from "../../Common/dataTypes";
import { clearErrors } from "../../actions/errorsActions";

function MyApp() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const handleEnqueueSnack = (message: string, variant: snackbarType) => {
    enqueueSnackbar(message, { variant });
  };
  // @ts-ignore
  const errors = useSelector((state) => state.errorsReducer);

  useEffect(() => {
    if (errors.length > 0) {
      errors.map((error) => {
        handleEnqueueSnack(error.msg, error.alertType);
      });
      dispatch(clearErrors());
    }
  }, [errors, dispatch, handleEnqueueSnack]);

  return <React.Fragment />;
}

export function SnackItem() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp />
    </SnackbarProvider>
  );
}
