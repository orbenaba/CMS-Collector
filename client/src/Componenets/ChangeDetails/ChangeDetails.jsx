// react modules
import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useHistory } from "react-router-dom";

import axios from "axios";

// custom modules
import { ServerAddress } from "../../Magic/Config.magic";
import ERRORS from "../../Magic/Errors.magic";
import REGEX from "../../Magic/Regex.magic";
import { Consumer } from "../../Context";
import Logout from "../Logout/logout";

// Helper Functions
import { IsLoggedIn} from "../../Helpers/Generals.Helpers";

// Styling
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  errorDisplay: {
    color: '#ED4956',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    fontWeight: 'lighter',
    textAlign: 'center'
  }
}));

export default function SignUp() {
  // React Hooks
  const history = useHistory();
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayedError, setDisplayedError] = useState("");

  // Event Handlers
  const onSubmit = async (event, handleChangeUser) => {
    try {
      event.preventDefault()
      if (confirmPassword !== password) {
        setDisplayedError("Passwords not match.");
      }
      else{
          // call change details here
      }
    } catch (err) {
      setDisplayedError(err.response.data.error);
    }
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
  }
  const onUsernameChange = e => {
      setUsername(e.target.value);
  }
  const onConfirmPasswordChange = e => {
      setConfirmPassword(e.target.value);
  }
  const onEmailChange = e => {
      setEmail(e.target.value);
  }

  // Displaying an error in case the validation failed
  let displayedErrorTag = <div></div>;
  if(displayedError !== "") {
    displayedErrorTag = <h1 className={classes.errorDisplay}>{displayedError}</h1>
  }

  return (
    <Consumer>
      {value => {
          const { user } = value.state;
          if(!IsLoggedIn(user)) {
            return (
              <React.Fragment>
                <h1>You are not logged in</h1>
                <h1>Please log in before</h1>
                <Logout />
            </React.Fragment>
            )
          }
          else {
            return (
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Change Details
                  </Typography>
                  <form className={classes.form} onSubmit={(event) => onSubmit(event, value.handleChangeUser)}>
                    <Grid container spacing={2}>
                      {/* Username */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="username"
                          name="username"
                          variant="outlined"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          autoFocus
                          onChange={onUsernameChange}
                          inputProps={{
                            pattern: REGEX.R_USERNAME,
                            title: ERRORS.INVALID_USERNAME
                          }}
                        />
                      </Grid>
                      {/* Email */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email"
                          name="email"
                          autoComplete="email"
                          onChange={onEmailChange}
                          inputProps={{
                            pattern: REGEX.R_EMAIL,
                            title: ERRORS.INVALID_EMAIL
                          }}
                        />
                      </Grid>
                      {/* Password */}
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="password"
                          onChange={onPasswordChange}
                          inputProps={{
                            pattern: REGEX.R_PASSWORd,
                            title: ERRORS.INVALID_PASSWORD
                          }}
                        />
                      </Grid>
                      {/* Confirm Password */}
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          id="confirmPassword"
                          autoComplete="password"
                          onChange={onConfirmPasswordChange}
                          inputProps={{
                            pattern: REGEX.R_PASSWORd,
                            title: ERRORS.INVALID_PASSWORD
                          }}
                        />
                      </Grid>
                    {/* Error */}
                    {displayedErrorTag}

                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Change
                    </Button>
                  </form>
                </div>
              </Container>
            );
          }
      }}
    </Consumer>
  )
}
