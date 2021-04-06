import React, { useState } from "react";
import { Consumer } from "../../Context";
import { makeStyles } from "@material-ui/core/styles";
import { R_IP, R_DOMAIN } from "../../Magic/Regex.magic";
import { INVALID_IPDOMAIN } from "../../Magic/Errors.magic";
import { useAlert } from 'react-alert'
import BigButton from "./BigButton";



const useStyle = makeStyles((theme) => ({
    inputDesign: {
        display: 'flex',
        boxSizing: 'border-box',
        borderRadius: '4px',
        backgroundColor: 'var(--azure)',
        padding: '4px 5px',
        marginBottom: '10px',
        marginTop: '20px',
        fontSize: '15px',
        fontWeight: 'bold',
        fontFamily: 'cursive',
        width: '15rem',
        height: '3rem',
        fontWeigaht: 'bold',
        outline: 'none',
        textAlign: 'center',
        borderWidth: '0.2rem',
        borderColor: 'var(--mainBlue)'
    },

    addInput: {
        color: 'var(--mainBlue)',
        border: 'none',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        alignText: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginTop: '10px',
        cursor: 'pointer',
        '&:hover': {
            color: 'var(--azure)'
        }
    }
}))


export default function AddScan() {
    const classes = useStyle();
    const alert = useAlert();
    const [domainOrIP, setDomainOrIP] = useState('');

    const onDomainOrIPChange = (domainOrIP) => {
        setDomainOrIP(domainOrIP);
    }

    const onClick = async (e, dispatch) => {
        e.preventDefault()

        if (domainOrIP.match(R_DOMAIN) || domainOrIP.match(new RegExp(R_IP))) {
            dispatch({ type: "ADD", payload: domainOrIP })
            setDomainOrIP('')
        }
        else {
            alert.show(INVALID_IPDOMAIN)
        }
    }

    return (
        <Consumer>
            {value => {
                const { dispatch } = value.state;
                return (
                    <div style={{ display: 'flex', marginRight: '1rem' }}>
                        <i class={`fa fa-plus fa-2x ${classes.addInput}`} aria-hidden="true" onClick={(e) => onClick(e, dispatch)}></i>
                        <input
                            value={domainOrIP}
                            name="dip"
                            onChange={e => onDomainOrIPChange(e.target.value)}
                            className={classes.inputDesign}
                            placeholder={domainOrIP ? domainOrIP : "Insert IP/Domain"}
                        />
                        <BigButton text="Scan" />
                    </div>
                )
            }}
        </Consumer>
    )
}