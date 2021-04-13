// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Card } from "material-ui";
import { getAllUsers } from "../../../actions/usersActions";
import { setFriendInFocus } from '../../../actions/friendActions';
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AsyncSearch() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<FriendProps[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [users, setUsers] = React.useState<FriendProps[]>([]);
  const dispatch = useDispatch();
  const loading = open && options && options.length === 0;

  const fetchUsers = async () => {
    const users = await getAllUsers();
    setUsers(users)
    return users;
  };

  const handleInputChance = ({ target: { value } }) => {
    setInput(value);
  };

  const handleOptionSelected = (friend: FriendProps) => {
    dispatch(setFriendInFocus(friend))
  }

  React.useEffect(() => {
    (async () => {
      await fetchUsers();
      setOptions(users)
    })();
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setOptions(users)
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    users.forEach(user => {
      if (input === `${user.firstName} ${user.lastName}`) {
        console.log("we got match", { user })
      }
    })
  }, [input])
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
        if (option.email === value.email) {
          handleOptionSelected(option);
        }
        return option.email === value.email
      }}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      options={options}

      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search..."
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
