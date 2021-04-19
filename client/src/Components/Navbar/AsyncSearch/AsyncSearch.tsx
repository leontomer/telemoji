import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade, makeStyles } from "@material-ui/core/styles";
import { getAllUsers } from "../../../actions/usersActions";
import { setFriendInFocus } from "../../../actions/friendActions";
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
  },
}));
export default function AsyncSearch() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<FriendProps[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [users, setUsers] = React.useState<FriendProps[]>([]);
  const [changed, setChanged] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(
    open && options && options.length === 0
  );

  const fetchUsers = async () => {
    const users = await getAllUsers();
    setUsers(users);
    return users;
  };

  const handleInputChance = ({ target: { value } }) => {
    setInput(value);
    setChanged(true);
  };

  const handleOptionSelected = (friend: FriendProps) => {
    console.log(`friend chosen : ${friend.firstName} ${friend.lastName}`);
    dispatch(setFriendInFocus(friend));
  };

  React.useEffect(() => {
    (async () => {
      await fetchUsers();
      setOptions(users);
    })();
  }, []);

  React.useEffect(() => {
    let active = true;

    (async () => {
      if (active && changed && input) {
        setOptions(users);
      } else if (!input) {
        setOptions([]);
        setLoading(false);
      }
    })();
  }, [loading, changed, input]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    users.forEach((user) => {
      if (input === `${user.firstName} ${user.lastName}`) {
        console.log("we got match", { user });
      }
    });
  }, [input]);
  const classes = useStyles();
  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => {
        console.log("option.email", option.email, "value.email", value.email);
        if (option.email === value.email) {
          handleOptionSelected(option);
        }
        return option.email === value.email;
      }}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          className={classes.search}
          {...params}
          placeholder="Search..."
          variant="outlined"
          value={input}
          onChange={handleInputChance}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
