import React, { useEffect, useState } from "react";
import { Consumer } from "../../Context";
import getUserScans from "../../usersScans/userScans"



export default function Activity() {


    const [userScans,setUserScans] = useState(undefined)

    useEffect(()=>{
        (async()=>{
            const userScans = await  getUserScans()
            setUserScans(userScans)
        })()
        

    },userScans,setUserScans)


    return (
        <Consumer>
            {value => {
                if(!userScans){return <div>Loading...</div>}
                const { user } = value.state;
                return (
                    <div>{JSON.stringify(userScans,undefined,'\t')}</div>
                )
            }}
        </Consumer>
    )
}
