// react modules
import React,  {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {Link, useHistory } from "react-router-dom";

import axios from "axios";

// custom modules
import { ServerAddress } from "../../Magic/Config.magic";
import ERRORS from "../../Magic/Errors.magic";
import REGEX from "../../Magic/Regex.magic";
import { Consumer } from "../../Context";

// Helper Functions
import { IsLoggedIn } from "../../Helpers/Generals.Helpers";

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
    marginTop: theme.spacing(1),
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

export default function SignIn() {
  // react hooks
  const history = useHistory();
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayedError, setDisplayedError] = useState("");

  // event handlers
  const onSubmit = async (e, handleChangeUser) => {
    try{
      e.preventDefault();
      const objResponse = await axios.post(ServerAddress + "api/user/login", {username, password}, {withCredentials: true});
      // If Not error was thrown than status 200 (SUCCESS) was in the response header => 
      // The user signs in successfully => Redirect him to the home page
      history.push("/");
      handleChangeUser(objResponse.data.user);
    }catch(err) {
      // Error codes -> 400/401/500
      setDisplayedError(err.response.data.error);
    }
  }

  const onPasswordChange = e => {
    setPassword(e.target.value);
  }

  const onUsernameChange = e => {
    setUsername(e.target.value);
  }

  // Displaying an error in case the validation failed
  let displayedErrorTag = <div></div>;
  if(displayedError !== "") {
    displayedErrorTag = <h1 className={classes.errorDisplay}>{displayedError}</h1>
  }

  return (
    <Consumer>
      {value=>{
        const { user } = value.state;
        if(IsLoggedIn(user)) {
          return (
            <React.Fragment>
                <h1>You are Already in</h1>
                <h1>Please log out before logging in to another account</h1>
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
                  Sign in
                </Typography>
                <form className={classes.form} onSubmit={(event) => onSubmit(event, value.handleChangeUser)}>
                  {/* Username */}
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={onUsernameChange}
                    inputProps={{
                      pattern: REGEX.R_USERNAME,
                      title: ERRORS.INVALID_USERNAME
                    }}
                  />
                  {/* Password */}
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={onPasswordChange}
                    inputProps={{
                      pattern: REGEX.R_PASSWORD,
                      title: ERRORS.INVALID_PASSWORD
                    }}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  {/* Error */}
                  {displayedErrorTag}
                  {/* Submit button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    {/* Forgot Password Link */}
                    <Grid item xs>
                      <Link to="/forgot-password" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    {/* Sign up Link */}
                    <Grid item>
                      <Link to="register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
          );
        }
      }}
    </Consumer>
  )
}
