// react modules
import React, {useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import axios from "axios";


import { ServerAddress } from '../../../Magic/Config.magic';
import Title from "../../Landing/Title";


const useStyle = makeStyles((theme) => ({
    root: {
        marginTop: "10%",
        alignItems: "center",
        alignContent: "center",
        padding: "1.5rem",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: "1rem",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
        }
    },
    title: {
        textAlign: "center"
    }
}))



export default function AccountBrief({ createdAt }) {
    const classes = useStyle();
    // const [bIsLoading, setBI]
    const [totalScans, setTotalScans] = useState();
    const [dateCreatedAccount, setDateCreatedAccount] = useState();

    useEffect(async () => {
        try{
            const responseData = (await axios.get(ServerAddress + "api/asset/recap-user-scans", {withCredentials: true})).data;
            setTotalScans(responseData.results.totalScans)
            let createdAtDate = new Date(createdAt);

            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            setDateCreatedAccount(createdAtDate.toLocaleDateString("en-US", options));
        }catch(err) {

        }
    }, []);

    // Total scans
    let scansLine = <h2>You currently have no scans</h2>

    // if(totalScans) {
        scansLine = <h2>Total scans: {totalScans}</h2>
    // }


    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Title name="Brief"></Title>
            </div>
            {scansLine}
            <h4>Account Created At {dateCreatedAccount}</h4>
        </div>
    )
}