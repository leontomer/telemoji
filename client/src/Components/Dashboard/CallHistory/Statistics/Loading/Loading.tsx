import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: 'auto',
        height: '500px',
        justifyContent: 'center',
        alignItems: 'center'
    },
}));

export function Loading() {
    const classes = useStyles();

    return (
        <div className={classes.root} style={{ color: 'orange' }}>
            <div>
                <CircularProgress size={50} />
            </div>
        </div>
    );
}