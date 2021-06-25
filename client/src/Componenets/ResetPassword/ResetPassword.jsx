// react modules
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Button, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// custom modules
import REGEX from "../../Magic/Regex.magic";
import ERRORS from "../../Magic/Errors.magic.react";
import { ServerAddress } from "../../Magic/Config.magic";


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

export default function ResetPassword() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayedError, setDisplayedError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [paramApproved, setParamApproved] = useState(false);
  const history = useHistory();

  const classes = useStyles();
  useEffect(() => {
    console.log(isSent);
  }, [isSent]);

  useEffect(() => {
    const passequals = confirmPassword === password;
    passequals !== canSubmit && setCanSubmit(passequals);
  }, [password, confirmPassword, canSubmit]);

  useEffect(() => {
    axios
      .post(ServerAddress + "api/user/validate-change-password", { token })
      .then(() => {
        !paramApproved && setParamApproved(true);
      })
      .catch(() => {
        paramApproved && setParamApproved(false);
      });
  }, [paramApproved]);

  const onPasswordChange = (password) => {
    setPassword(password);
  };

  const onConfirmPasswordChange = (confirm_password) => {
    setConfirmPassword(confirm_password);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(ServerAddress + "api/user/reset-password", { token, password });
      setIsSent(true);
      history.push("/login");
    } catch (err) {
      setIsSent("error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset your password
        </Typography>
        <form name="formInput" onSubmit={(event) => onSubmit(event)} className={classes.form}>
          {paramApproved ? (
            <>
              <TextField
                label="Password"
                name="password"
                variant="outlined"
                margin="normal"
                defaultValue=""
                style={!canSubmit ? { borderColor: "red" } : {}} //TODO improve style
                autoFocus
                fullWidth
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                inputProps={{
                  pattern: REGEX.R_PASSWORD,
                  title: ERRORS.INVALID_PASSWORD,
                }}
                autoComplete="password"
                type={"password"}
              />
              <TextField
                label="confirm-password"
                name="confirm-password"
                variant="outlined"
                margin="normal"
                defaultValue=""
                className={classes.materialUIInput}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                required
                autoFocus
                fullWidth
                inputProps={{
                  pattern: REGEX.R_PASSWORD,
                  title: ERRORS.INVALID_PASSWORD,
                }}
                autoComplete="password"
                type={"password"}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!canSubmit}
                style={
                  isSent === "error" ? { backgroundColor: "red" } : isSent ? { backgroundColor: "green" } : {}
                }
                className={classes.btnSubmit}>
                Send
              </Button>
            </>
          ) : (
            <label className={classes.formLabel}>Timeout</label>
          )}
        </form>
      </div>
    </Container>
  );
}
