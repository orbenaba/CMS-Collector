import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";
import { Consumer } from "../../Context";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1
    },
    btns: {
        color: 'white',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: 'rgba(197, 1, 77, 0.5)',
            borderRadius: '5rem'
        }
    }
}));

export default function Navbar() {
    const classes = useStyles();

    const common = (nameOrLink) => {
        return (
            <div className={classes.root}>
                <AppBar position="static" style={{ backgroundColor: '#ec5990', fontFamily: 'cursive' }}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            <Link to="/" className="btn" className={classes.btns}>CMS</Link>
                        </Typography>
                        {nameOrLink}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    return (
        <Consumer>
            {value => {
                const { user } = value.state
                if (user._id == null) {
                    return (
                        common(<Link to="/login" className={classes.btns}>Login</Link>)
                    );
                }
                else {
                    return (
                        common(
                            <div>
                                <Link to="/my-activity" className={classes.btns} style={{ display: 'inline', marginLeft: '2rem' }}></Link>
                                <Link to="/my-user" className={classes.btns} style={{ display: 'inline', marginLeft: '2rem'}}></Link>
                                <Link to="/scanning" className={classes.btns} style={{ display: 'inline', marginLeft: '2rem' }}>Scan</Link>
                                <h3 className={classes.btns} style={{ display: 'inline', marginLeft: '2rem' }}>Hello {user.username}</h3>
                            </div>
                        )
                    )
                }
            }}
        </Consumer>
    );
}