
import React from "react";
import { Consumer } from "../../Context";


export default function Activity() {
    return (
        <Consumer>
            {value => {
                return (
                    <h1>In activity</h1>
                )
            }}
        </Consumer>
    )
}
