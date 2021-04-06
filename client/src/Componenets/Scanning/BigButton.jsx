import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme) => ({
    btnDesign: {
        marginTop: '20px',
        height: '3rem',
        textTransform: 'uppeercase',
        fontSize: '25px',
        width: '10rem',
        borderRadius: '20px',
        backgroundColor: 'var(--mainBlue)',
        color: 'white',
        borderColor: 'blue',
        fontFamily: 'cursive',
        outline: 'none',
        cursor: 'pointer',
        marginLeft: '3rem',
        '&:hover': {
            backgroundColor: 'var(--purpleBlue)'
        }
    }
}))


export default function BigButton(props) {
    const classes = useStyle()
    return (
        <button
            size="large"
            type="secondary"
            className={classes.btnDesign}
        >
            {props.text}
        </button>
    );
}