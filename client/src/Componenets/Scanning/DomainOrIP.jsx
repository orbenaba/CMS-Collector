import React, { useState } from "react";
import { Consumer } from "../../Context";
import { makeStyles } from "@material-ui/core/styles";


const useStyle = makeStyles((theme) => ({

}))

export default function DomainOrIp(props) {
    const classes = useStyle();
    const [domOIp, setDomOIp] = useState(props.domainOrIP);

    const remove = (dispatch) => {
        dispatch({ type: "REMOVE", payload: domOIp })
    }
    return (
        <Consumer>
            {value => {
                const { dispatch } = value.state;
                return (<h3 className="text-dark text-center p-1 bg-light border-bottom">
                    <i className="far fa-times-circle fa-sm float-left m-1 text-danger" style={{ cursor: "pointer", marginRight: '1rem', marginLeft: '1.5rem', color: 'red' }} onClick={() => remove(dispatch)}></i>
                    <i style={{ fontFamily: 'cursive' }}>{domOIp}</i>
                </h3>)
            }}
        </Consumer>
    )
}