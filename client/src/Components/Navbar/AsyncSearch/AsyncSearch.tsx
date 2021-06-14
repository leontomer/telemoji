import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade, makeStyles } from "@material-ui/core/styles";
import { getAllUsers } from "../../../actions/usersActions";
import { setFriendInFocus } from "../../../actions/friendActions";
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Popper from "@material-ui/core/Popper";
import "./AsyncSearch.scss";

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
  root: {
    "& .MuiAutocomplete-listbox": {
      fontSize: 18,
      "& li:hover": { backgroundColor: "#E5E7E9" },
    },
  },
}));
export default function AsyncSearch() {
  const [options, setOptions] = React.useState<FriendProps[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [users, setUsers] = React.useState<FriendProps[]>([]);
  const [changed, setChanged] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(
    options && options.length === 0
  );

  const CustomPopper = function (props) {
    const classes = useStyles();
    return <Popper {...props} className={classes.root} placement="bottom" />;
  };

  const fetchUsers = async () => {
    const users = await getAllUsers();
    setUsers(users);
    return users;
  };

  const handleInputChance = ({ target: { value } }) => {
    setInput(value);
    setChanged(true);
    (async () => {
      await fetchUsers();
      setOptions(users);
    })();
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

  const handleSelectUserToFocus = (event, value) => {
    if (value) {
      dispatch(setFriendInFocus(value as FriendProps));
    }
  };
  const classes = useStyles();
  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      autoComplete
      onChange={handleSelectUserToFocus}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      options={options}
      loading={loading}
      renderOption={(option) => {
        return (
          <div className="searchItem">
            <Avatar src={option.imageAddress} style={{ marginRight: 10 }} />
            {`${option.firstName} ${option.lastName}`}
          </div>
        );
      }}
      PopperComponent={CustomPopper}
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
