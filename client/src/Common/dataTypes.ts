export enum snackbarType {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

export interface errorType {
  msg: string;
  alertType: snackbarType;
  id: string;
}
