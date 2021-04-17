import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useLoader } from '../../Contexts/LoaderContext';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

export default function Loader() {
    const { isLoading } = useLoader();

    const classes = useStyles();
    return (
        <Backdrop className={classes.backdrop} open={isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}