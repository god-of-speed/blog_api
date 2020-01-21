import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import SidebarCss from "../assets/css/sidebar.css";
import Axios from "axios";

class Sidebar extends Component {
    state = {
        topics:[]
    }

    componentDidMount() {
        //get topics
        var self = this;
        Axios.get('/api/topics')
             .then((data)=>{
                 self.setState((state)=>{
                     return {
                         ...state,
                         topics:state.topics.concat(data.data.topics)
                     }
                 });
             },()=>{});
    }

    render() {
        return (
            <div>
                <div id="desktop-sidebar">
                    <Link
                        to="/"
                        className={
                            this.props.location.pathname == "/" ? "active" : ""
                        }
                    >
                        General
                    </Link>
                    {
                        this.state.topics.map((topic) => {
                            return (
                                <Link
                                key={topic.id}
                        to={'/topic?topic_id='+topic.id+'&topic_name='+topic.title}
                        className={
                            this.props.location.pathname == "/topic" &&
                            this.props.location.search == '?topic_id='+topic.id+'&topic_name='+topic.title
                                ? "active"
                                : ""
                        }
                    >
                        {topic.title}
                    </Link>
                            );
                        })
                    }
                    <Link
                        style={
                            this.props.user_role == "USER" ||
                            this.props.isAuthenticated == false
                                ? { display: "none" }
                                : {}
                        }
                        className={
                            this.props.location.pathname == "/create_post"
                                ? "active"
                                : ""
                        }
                        to="/create_post"
                    >
                        Create Post
                    </Link>
                    <Link
                        style={
                            this.props.user_role != "ADMIN"
                                ? { display: "none" }
                                : {}
                        }
                        to="/unpublished_posts"
                        className={
                            this.props.location.pathname == "/unpublished_posts"
                                ? "active"
                                : ""
                        }
                    >
                        Unpublished Posts
                    </Link>
                    <div>
                        <a>Become a writer</a>
                    </div>
                </div>
                <div
                    style={
                        this.props.showSidebar == false ? { display: "none" } : {}
                    }
                    id="mobile-sidebar"
                >
                    <Link
                        to="/"
                        className={
                            this.props.location.pathname == "/" ? "active" : ""
                        }
                    >
                        General
                    </Link>
                    {
                        this.state.topics.map((topic) => {
                            return (
                                <Link
                                key={topic.id}
                        to={'/topic?topic_id='+topic.id+'&topic_name='+topic.title}
                        className={
                            this.props.location.pathname == "/topic" &&
                            this.props.location.search == '?topic_id='+topic.id+'&topic_name='+topic.title
                                ? "active"
                                : ""
                        }
                    >
                        {topic.title}
                    </Link>
                            );
                        })
                    }
                    <Link
                        style={
                            this.props.user_role == "USER" ||
                            this.props.isAuthenticated == false
                                ? { display: "none" }
                                : {}
                        }
                        to="/create_post"
                        className={
                            this.props.location.pathname == "/create_post"
                                ? "active"
                                : ""
                        }
                    >
                        Create Post
                    </Link>
                    <Link
                        style={
                            this.props.user_role != "ADMIN"
                                ? { display: "none" }
                                : {}
                        }
                        to="/unpublished_posts"
                        className={
                            this.props.location.pathname == "/unpublished_posts"
                                ? "active"
                                : ""
                        }
                    >
                        Unpublished Posts
                    </Link>
                    <Link
                        style={
                            this.props.isAuthenticated == true
                                ? { display: "none" }
                                : {}
                        }
                        to="/login"
                        className={
                            this.props.location.pathname == "/login" ? "active" : ""
                        }
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
                    >
                        Logout
                    </Link>
                    <div>
                        <a>Become a writer</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Sidebar);
