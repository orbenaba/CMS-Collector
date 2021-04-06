
import "./Sidebar.css";
import React from "react";
import { Consumer } from "../../Context";
import { Link } from "react-router-dom";


const Sidebar = ({ width, height }) => {
    const [xPosition, setX] = React.useState(-width);

    const toggleMenu = () => {
        if (xPosition < 0) {
            setX(0);
        } else {
            setX(-width);
        }
    };

    React.useEffect(() => {
        setX(0);
    }, []);
    return (
        <Consumer>
            {value => {
                const { user } = value.state;
                let displayedLinks = <div></div>
                if (user._id != null) {
                    displayedLinks = (
                        <div>
                            <Link to="/logout">Log out</Link>
                            <div>
                            <Link to="/my-activity">My Activity</Link>
                            <div>
                            <Link to="my-user">My User</Link>
                        
                            </div>
                            </div>
                        </div>
                    )
                }
                else {
                    displayedLinks = (
                        <div>
                            <Link to="/login">Log in</Link>
                            <div></div>
                            <Link to="/register">Register</Link>
                        </div>
                    )
                }
                return (
                    <div style={{ position: 'fixed' }}>
                        <div
                            className="side-bar"
                            style={{
                                transform: `translatex(${xPosition}px)`,
                                width: width,
                                minHeight: height
                            }}
                        >
                            <button
                                onClick={() => toggleMenu()}
                                className="toggle-menu"
                                style={{
                                    transform: `translate(${width}px, 20vh)`
                                }}
                            ></button>
                            <div className="content">{displayedLinks}</div>
                        </div>
                    </div>
                )
            }}
        </Consumer>
    );
};

export default Sidebar;