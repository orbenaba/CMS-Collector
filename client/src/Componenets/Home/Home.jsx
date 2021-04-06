import React, { useState, useEffect } from "react";
import { Consumer } from "../../Context";
import Blog from "./Blog";

export default function Home() {
    return (
        <Consumer>
            {value => {
                const { user } = value.state;
                if (user._id != null) {
                    return (
<<<<<<< HEAD
                        <h1>user._id: {user._id}</h1>
                        //todo show user name
=======
                        <div>
                            <Blog></Blog>
                        </div>
>>>>>>> cd36537619f274243c183b125a858bd3435fdded
                    )
                }
                else {
                    return (
                        <h1>In home</h1>
                    )
                }
            }}
        </Consumer >
    )
}