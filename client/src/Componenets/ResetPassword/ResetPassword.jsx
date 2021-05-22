
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import REGEX from "../../Magic/Regex.magic";
import ERRORS from "../../Magic/Errors.magic";
import { ServerAddress } from "../../Magic/Config.magic";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';


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


export default function ResetPassword() {

    const query = new URLSearchParams(useLocation().search);;
    const token = query.get('token')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayedError, setDisplayedError] = useState('');
    const [canSubmit, setCanSubmit] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [paramApproved, setParamApproved] = useState(false)
    const history = useHistory()

    const classes = useStyles();
    useEffect(() => { console.log(isSent) }, [isSent])

    useEffect(() => {
        const passequals = confirmPassword === password
        passequals !== canSubmit && setCanSubmit(passequals)
    }, [password, confirmPassword, canSubmit])

    useEffect(() => {
        console.log(`effect`)
        axios.post(ServerAddress + "api/user/validate-change-password",
            { token })
            .then(() => {
                console.log(`approved`)
                !paramApproved && setParamApproved(true)
            })
            .catch(() => {
                paramApproved && setParamApproved(false)
                console.log(`not apprvoed`)
            });

    }, [paramApproved])


    const onPasswordChange = password => {
        setPassword(password);
    }

    const onConfirmPasswordChange = confirm_password => {
        setConfirmPassword(confirm_password);
    }

    const onSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post(ServerAddress + "api/user/reset-password",
                { token, password })
            setIsSent(true)
            history.push('/login')
        }
        catch (err) {
            setIsSent('error')
        }


    }


    return (
        <form name="formInput" onSubmit={(event) => onSubmit(event)} className={classes.form} style={{ fontFamily: 'cursive' }}>
            {
                paramApproved ? (
                    <>
                        <label className={classes.formLabel}>Password</label>
                        <input
                            name="password"
                            defaultValue=""
                            style={!canSubmit ? { borderColor: 'red' } : {}} //TODO improve style
                            className={classes.materialUIInput}
                            onChange={e => onPasswordChange(e.target.value)}
                            required
                            pattern={REGEX.R_PASSWORD}
                            title={ERRORS.INVALID_PASSWORD}
                            autoComplete="password"
                            type={'password'}
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
                            type={'password'}
                        />
                        <Link to="/login" className={classes.linkTo}>Cancel</Link>
                        <input type="submit" disabled={!canSubmit} style={isSent === 'error' ? { backgroundColor: 'red' } : isSent ? { backgroundColor: 'green' } : {}} className={classes.btnSubmit} />
                    </>) :
                    <label className={classes.formLabel}>Timeout</label>
            }
        </form>)
}
