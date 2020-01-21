import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Logo from "../assets/img/logo.png";
import NavbarCss from "../assets/css/navbar.css";
import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import { Link, withRouter } from "react-router-dom";
import ReactDOM from "react-dom";

class Navbar extends Component {
    constructor(prop) {
        super(prop);
        this.search = this.search.bind(this);
    }
    search = function() {
        var node = ReactDOM.findDOMNode(this);
        node = node.querySelector('search-bar');
        this.this.props.history.push('/search?search='+node.value);
    }

    render() {
        return (
            <div id="header">
                <div id="desktop-menu">
                    <div id="logo-div">
                        <img src={Logo} id="logo" />
                    </div>
                    <div id="search-div">
                        <input type="text" id="search-bar" />
                        <button onClick={this.search} id="search-btn">
                            <SearchIcon />
                        </button>
                    </div>
                    <div id="links-div">
                        <Link
                            style={
                                this.props.isAuthenticated == false
                                    ? { display: "none" }
                                    : {}
                            }
                            to="/profile"
                        >
                            <AccountCircleIcon
                                id="avatar"
                                style={
                                    this.props.user_avatar != null
                                        ? { display: "none" }
                                        : {}
                                }
                            />
                            <img
                                style={
                                    this.props.user_avatar == ""
                                        ? { display: "none" }
                                        : {}
                                }
                                src={
                                    this.props.user_avatar != null
                                        ? this.props.user_avatar
                                        : ""
                                }
                            />
                        </Link>
                        <Link
                            style={
                                this.props.isAuthenticated == false
                                    ? { display: "none" }
                                    : {}
                            }
                            to="/profile"
                            id="profile-link"
                        >
                            {this.props.user_name}
                        </Link>
                        <Link
                            style={
                                this.props.isAuthenticated == true
                                    ? { display: "none" }
                                    : {}
                            }
                            className={
                                this.props.location.pathname == "/login"
                                    ? "active"
                                    : ""
                            }
                            to="/login"
                            id="login-link"
                        >
                            Login
                        </Link>
                        <Link
                            onClick={this.props.logout}
                            style={
                                this.props.isAuthenticated == false
                                    ? { display: "none" }
                                    : {}
                            }
                            to=""
                            id="login-link"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
                <div id="mobile-menu">
                    <div id="menu-div">
                        <MenuIcon
                            id="menu-icon"
                            onClick={this.props.switchSidebar}
                            style={
                                this.props.showSidebar == true
                                    ? { display: "none" }
                                    : {}
                            }
                        />
                        <ClearIcon
                            id="menu-icon"
                            onClick={this.props.switchSidebar}
                            style={
                                this.props.showSidebar == false
                                    ? { display: "none" }
                                    : {}
                            }
                        />
                    </div>
                    <div id="logo-div">
                        <img src={Logo} id="logo" />
                    </div>
                    <div id="links-div">
                        <Link
                            style={
                                this.props.isAuthenticated == false
                                    ? { display: "none" }
                                    : {}
                            }
                            to="/profile"
                        >
                            <AccountCircleIcon
                                id="avatar"
                                style={
                                    this.props.user_avatar != null
                                        ? { display: "none" }
                                        : {}
                                }
                            />
                            <img
                                style={
                                    this.props.user_avatar == null
                                        ? { display: "none" }
                                        : {}
                                }
                                src={
                                    this.props.user_avatar != null
                                        ? this.props.user_avatar
                                        : ""
                                }
                            />
                        </Link>
                    </div>
                </div>
                <div id="mobile-search-div">
                    <input type="text" id="search-bar" />
                    <button id="search-btn">
                        <SearchIcon />
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(Navbar);
