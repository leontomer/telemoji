import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

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
interface setYourModalNameProps {
    open: boolean;
    setOpen: Function;
    caller: string;
    acceptCall: Function;
}
export const RecieveCallModal = ({ open, setOpen, caller, acceptCall }: setYourModalNameProps) => {
    const classes = useStyles();

    const handleClose = () => {
        acceptCall();
        setOpen(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                // onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">{caller} is calling you</h2>
                        <Button onClick={handleClose}>Accept call</Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
