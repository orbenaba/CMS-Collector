import React, { useState, useEffect } from "react";
import { Consumer } from "../../Context";


export default function Home() {
    return (
        <Consumer>
            {value => {
                const { user } = value.state;
                if (user._id != null) {
                    return (
                        <h1>user._id: {user._id}</h1>
                        //todo show user name
                    )
                }
                else {
                    return (
                        <h1>In home</h1>
                    )
                }
            }}
        </Consumer>
    )
}