import React, { useState, useEffect } from "react";
import { Consumer } from "../../Context";


export default function Home() {
    return (
        <Consumer>
            {value => {
                const { user } = value.state;
                if (user._id != null) {
                    return (
                        <React.Fragment>
                            <div>User._Id: {user._id}</div>
                            <div>User Name: {user.username} </div>
                            <div>Mail: {user.email} </div>

                        </React.Fragment>
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