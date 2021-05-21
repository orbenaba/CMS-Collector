import React, { useState } from "react";
import { Consumer } from "../../Context";
import Title from "../Landing/Title";
import { makeStyles } from "@material-ui/core/styles";
import AddScan from "./AddScan";
import DomainOrIp from "./DomainOrIP";
import { useAlert } from 'react-alert'
import axios from "axios";
import { ServerAddress } from "../../Magic/Config.magic";
import ReactLoading from 'react-loading';
import ResultsTable from "../Shared/Results/ResultsTable.shared";

const useStyle = makeStyles((theme) => ({
    loading: {
        margin: '0 auto'
    },
    container: {
        backgroundColor: 'var(--mainBlue)',
        width: '60%',
        borderRadius: '1rem'
    }
}))


export default function Scanning() {
    const classes = useStyle()
    const alert = useAlert();
    const [scanResults, setScanResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [displayResults, setDisplayResults] = useState(false);


    const allScans = (domainOrIps, dispatch) => {
        if (domainOrIps.length !== 0) {
            return domainOrIps && Array.isArray(domainOrIps) && domainOrIps.map(dip => {
                return <DomainOrIp domainOrIP={dip} dispatch={dispatch}></DomainOrIp>
            })
        }
        else {
            return <div></div>
        }
    }

    const sanitizeArray = (domainOrIPs) => {
        let arr = [];
        for (let dip of domainOrIPs) {
            arr.push(dip.slice(',')[0])
        }
        return arr;
    }

    const onSubmit = async (event, domainOrIps, dispatch) => {
        event.preventDefault();
        if (domainOrIps.length === 0) {
            alert.show("No domains or ips provided")
        }
        else {
            try {
                setIsLoading(true)
                const res = await axios.post(ServerAddress + "api/asset/scan", { domainOrIps: sanitizeArray(domainOrIps) }, { withCredentials: true })
                setScanResults(res.data.results)
                setDisplayResults(true);
                // clear the context assets
                dispatch({ type: "REMOVE_ALL" })
                setIsLoading(false)
            } catch (err) {

            }
        }
    }

    const closeTable = () => {
        setScanResults({});
        setDisplayResults(false)
    }

    if (isLoading === true) {
        return (
            <div>
                <Title name="Scan your" title="ips/domains"></Title>
                <ReactLoading color={'var(--mainBlue)'} height={'10rem'} width={'10rem'} type={'spokes'} className={classes.loading}></ReactLoading>
            </div>
        )
    }

    if (displayResults === true) {
        return (
            <div>
                <Title name="scan" title="results"></Title>
                <button style={{ margin: '0 auto', display: 'flex', backgroundColor: 'var(--mainBlue)', fontFamily: 'cursive', color: 'white', height: '3.3rem', fontSize: '2rem', cursor: 'pointer' }} onClick={closeTable}>Close Results</button>
                <ResultsTable domainScans={JSON.stringify(scanResults.domainScans)} ipScans={JSON.stringify(scanResults.ipScans)}></ResultsTable>
            </div>
        )
    }

    return (
        <Consumer>
            {value => {
                const { user, domainOrIps, dispatch } = value.state;
                if (user._id != null) {
                    return (
                        <form onSubmit={(event) => onSubmit(event, domainOrIps, dispatch)}>
                            <Title name="Scan your" title="ips/domains"></Title>
                            <div style={{ display: 'flex' }}>
                                <div style={{ margin: '0 25%', justifyContent: 'center' }}>
                                    <AddScan></AddScan>
                                    <div className={classes.container}>
                                        {allScans(domainOrIps, dispatch)}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )
                }
                else {
                    return (
                        <h1>In scanning</h1>
                    )
                }
            }}
        </Consumer >
    )
}