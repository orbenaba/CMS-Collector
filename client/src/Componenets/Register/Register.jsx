import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ServerAddress } from "../../Magic/Config.magic";
import axios from "axios";
import useStyles from "../Login/useStyles.login";
import ERRORS from "../../Magic/Errors.magic";
import REGEX from "../../Magic/Regex.magic";

import { Consumer } from "../../Context";
import Logout from "../Logout/logout";


export default function Register() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [displayedError, setDisplayedError] = useState('');
    const classes = useStyles();


    const onSubmit = async (event, handleChangeUser) => {
        event.preventDefault()
        //api/user/login
        try {
            if (confirmPassword !== password) {
                throw "Passwords not match.";
            }
            const response = await axios.post(ServerAddress + "api/user/register",
                { username, password, email }, { withCredentials: true });
            history.push('/');
            handleChangeUser(response.data.user)
        } catch (err) {
            if (typeof err.response !== 'undefined') {
                if (err.response.data.error.includes('User validation failed:')) {
                    setDisplayedError(err.response.data.error.substring(('User validation failed:').length))
                }
                else {
                    setDisplayedError(err.response.data.error);
                }
            }
            else {
                setDisplayedError(err);
            }
        }
    };

    const onPasswordChange = password => {
        setPassword(password);
    }
    const onUsernameChange = username => {
        setUsername(username);
    }
    const onConfirmPasswordChange = confirm_password => {
        setConfirmPassword(confirm_password);
    }
    const onEmailChange = email => {
        setEmail(email);
    }

    let error = <div></div>

    if (displayedError !== '') {
        error = <h1 className={classes.errorDisplay}>{displayedError}</h1>
    }

    return (
        <Consumer>
            {value => {
                const { user } = value.state;
                if (user._id != null) {
                    return (
                        <React.Fragment>
                            <h1>You are Already in</h1>
                            <h1>Please log out before logging in to another account</h1>
                            <Logout />
                        </React.Fragment>
                    )
                }
                else {
                    return (
                        <form name="formInput" onSubmit={(event) => onSubmit(event, value.handleChangeUser)} className={classes.form} style={{ fontFamily: 'cursive' }}>
                            <label className={classes.formLabel}>Username</label>
                            <input
                                name="userName"
                                defaultValue=""
                                className={classes.materialUIInput}
                                onChange={e => onUsernameChange(e.target.value)}
                                required='You must provide username'
                                pattern={REGEX.R_USERNAME}
                                title={ERRORS.INVALID_USERNAME}
                                autoComplete="username"
                            />
                            <label className={classes.formLabel}>Password</label>
                            <input
                                name="password"
                                defaultValue=""
                                className={classes.materialUIInput}
                                onChange={e => onPasswordChange(e.target.value)}
                                required
                                pattern={REGEX.R_PASSWORD}
                                title={ERRORS.INVALID_PASSWORD}
                                autoComplete="password"
                            />
                            <label className={classes.formLabel}>Confirm Password</label>
                            <input
                                name="confirm-password"
                                defaultValue=""
                                className={classes.materialUIInput}
                                onChange={e => onConfirmPasswordChange(e.target.value)}
                                required
                                pattern={REGEX.R_PASSWORD}
                                title={ERRORS.INVALID_PASSWORD}
                                autoComplete="password"
                            />
                            <label className={classes.formLabel}>Email</label>
                            <input
                                name="email"
                                defaultValue=""
                                className={classes.materialUIInput}
                                onChange={e => onEmailChange(e.target.value)}
                                required
                                pattern={REGEX.R_EMAIL}
                                title={ERRORS.INVALID_EMAIL}
                                autoComplete="email"
                            />
                            {error}
                            <Link to="/login" className={classes.linkTo}>Already have an account? Log in</Link>
                            <input type="submit" className={classes.btnSubmit} />
                        </form>
                    )
                }
            }}
        </Consumer>
    );
};