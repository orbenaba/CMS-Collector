// react modules
import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import Timer from "./ForgetPasswordTimer";

import axios from "axios";

// custom modules
import { ServerAddress } from "../../Magic/Config.magic";
import ERRORS from "../../Magic/Errors.magic.react";
import REGEX from "../../Magic/Regex.magic";
import { Consumer } from "../../Context";

// Helper Functions
import { IsLoggedIn } from "../../Helpers/Generals.Helpers";
//import Clock from "../../Helpers/ClockStyle";

// Styling
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  errorDisplay: {
    color: "#ED4956",
    fontFamily: "sans-serif",
    fontSize: "1rem",
    fontWeight: "lighter",
    textAlign: "center",
  },
}));

export default function ForgotPassword() {
  // react hooks
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  // Is the email sent ?
  const [isSent, setIsSent] = useState(false);
  const [displayedError, setDisplayedError] = useState("");

  // event handlers
  const onSubmit = async (event, handleChangeUser) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        ServerAddress + "api/user/forgot-password",
        { email },
        { withCredentials: true }
      );
      setIsSent(true);
      setDisplayedError("Email was sent! Check your mail box");
    } catch (err) {
      setIsSent(false);
      setDisplayedError("Error! User not found, Make sure the email address is correct");
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Displaying an error in case the validation failed
  let displayedErrorTag = <div></div>;
  if (displayedError !== "") {
    displayedErrorTag = <h1 className={classes.errorDisplay}>{displayedError}</h1>;
  }

  return (
    <Consumer>
      {(value) => {
        const { user } = value.state;
        if (IsLoggedIn(user)) {
          return (
            <React.Fragment>
              <h1>You are Already in</h1>
              <h1>Please log out before logging in to another account</h1>
            </React.Fragment>
          );
        } else {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Forgot Password
                </Typography>
                <form className={classes.form} onSubmit={(event) => onSubmit(event, value.handleChangeUser)}>
                  {/* Email */}
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={onEmailChange}
                    inputProps={{
                      pattern: REGEX.R_EMAIL,
                      title: ERRORS.INVALID_EMAIL,
                    }}
                  />
                  {/* Error */}
                  {displayedErrorTag}
                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSent}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Send Mail
                    {"  "}
                    {isSent && (
                      <Timer
                        onStop={() => {
                          setIsSent(false);
                        }}
                        shouldStart={!!isSent}
                      />
                    )}
                  </Button>
                  <Grid container>
                    {/* Forgot Password Link */}
                    <Grid item xs>
                      <Link to="/login" variant="body2">
                        Remember the password?
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
  );
}
