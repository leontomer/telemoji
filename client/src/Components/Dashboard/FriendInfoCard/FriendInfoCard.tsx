import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FriendProps } from "../../../reducers/authReducer";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

interface FriendInfoCardProps {
  friendInFocus: FriendProps | null;
}

export default function FriendInfoCard(props: FriendInfoCardProps) {
  const { friendInFocus: friend } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} title="Contemplative Reptile" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {friend
              ? `${friend.firstName} ${friend.lastName}`
              : "Choose a friend to view :)"}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {friend ? "Hi there, im using Telemoji! 😎" : ""}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {friend && (
          <>
            <Button size="small" color="primary">
              Call
            </Button>
            <Button size="small" color="primary">
              Cool
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
