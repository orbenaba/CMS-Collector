
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import REGEX from "../../Magic/Regex.magic";
import ERRORS from "../../Magic/Errors.magic";
import useStyles from "../Login/useStyles.login";
import { ServerAddress } from "../../Magic/Config.magic";
import axios from "axios";

export default function ResetPassword() {

    const query = new URLSearchParams(useLocation().search);;
    const email = query.get('email')
    const token = query.get('token')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayedError, setDisplayedError] = useState('');
    const [canSubmit, setCanSubmit] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [paramApproved, setParamApproved] = useState(false)

    const classes = useStyles();
    useEffect(()=>{console.log(isSent)},[isSent])

    useEffect(() => {
        const passequals = confirmPassword === password
        passequals !== canSubmit && setCanSubmit(passequals)
    }, [password, confirmPassword, canSubmit])

    useEffect(() => {
        console.log(`effect`)
        axios.post(ServerAddress + "api/user/validate-change-password",
            { email, token })
            .then(()=>{
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
                { email, token, password }) 
            setIsSent(true)
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
                        <input type="submit" disabled={!canSubmit} style={isSent === 'error' ? {backgroundColor:'red'} : isSent ? { backgroundColor: 'green' } : {}} className={classes.btnSubmit} />
                    </>) :
                    <label className={classes.formLabel}>Timeout</label>
            }
        </form>)
}
