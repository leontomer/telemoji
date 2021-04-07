import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button } from '@material-ui/core';
import { useModal } from "../../Contexts/ModalContext";
import { useSelector } from "react-redux";
import { withRouter } from "react-router";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
// interface setYourModalNameProps {
//     open: boolean;
//     setOpen: Function;
//     caller: string;
//     acceptCall: Function;
// }
const RecieveCallModalComponent = ({ history }) => {
    const { closeModal, isOpenModal, openModal } = useModal();
    const classes = useStyles();
    const caller = useSelector((state) => state.callReducer.callerName)
    const receivingCall = useSelector((state) => state.callReducer.receivingCall);
    const handleAcceptCall = () => {
        history.push('/video-chat')
        closeModal();
    }
    useEffect(() => {
        if (receivingCall) {
            openModal();
        }
    }, [receivingCall])

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={isOpenModal}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpenModal}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">{caller} is calling you</h2>
                        <Button onClick={handleAcceptCall}>Accept call</Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
export const RecieveCallModal = withRouter(RecieveCallModalComponent)
