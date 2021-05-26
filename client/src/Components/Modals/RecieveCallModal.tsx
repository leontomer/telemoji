import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, Typography } from "@material-ui/core";
import { useModal } from "../../Contexts/ModalContext";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { handleAcceptCall } from "../../actions/callActions";
import gifCall from "../../gifs/ringwhite.gif";
import { Avatar } from "@material-ui/core";
import PhoneDisabledIcon from "@material-ui/icons/PhoneDisabled";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";
import lan from "../../Languages/Languages.json";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: "column",
  },
  large: {
    margin: "auto",
    width: 100,
    height: 100,
    marginLeft: -100,
  },
}));

const RecieveCallModalComponent = ({ history }) => {
  const dispatch = useDispatch();
  const { closeModal, isOpenModal, openModal } = useModal();
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const classes = useStyles();
  // @ts-ignore
  const caller = useSelector((state) => state.callReducer.callerName);
  // @ts-ignore
  const receivingCall = useSelector((state) => state.callReducer.receivingCall);
  // @ts-ignore
  const callerImage = useSelector((state) => state.callReducer.callerImage);
  const handleAccept = () => {
    dispatch(handleAcceptCall());
    history.push("/video-chat");
    closeModal();
  };
  const handleDecline = () => {
    closeModal();
  };
  useEffect(() => {
    if (receivingCall) {
      openModal();
    }
  }, [receivingCall]);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isOpenModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{ border: "none" }}
      >
        <Fade in={isOpenModal} style={{ border: "none" }}>
          <div className={classes.paper}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 120,
              }}
            >
              <img
                src={gifCall}
                alt="loading..."
                style={{ height: 300, width: 400 }}
              />
              <Avatar
                alt="Remy Sharp"
                src={callerImage}
                className={classes.large}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
                marginTop: -20,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {caller} {lan[language].incoming_call}
              </Typography>
              <div style={{ display: "flex" }}>
                <Button onClick={handleAccept}>
                  <Avatar
                    style={{
                      background: "#42a160",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <PhoneCallbackIcon />
                  </Avatar>
                </Button>
                <Button onClick={handleDecline}>
                  <Avatar
                    style={{
                      background: "#ec7063",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <PhoneDisabledIcon />
                  </Avatar>
                </Button>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
export const RecieveCallModal = withRouter(RecieveCallModalComponent);
