import React, { Component } from "react";
import ContentImg from "../assets/img/eat.png";
import AuthorImg from "../assets/img/logo.png";
import ContentCss from "../assets/css/content.css";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import EditIcon from "@material-ui/icons/Edit";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import LayersClearIcon from "@material-ui/icons/LayersClear";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import QueryString from "query-string";
import Axios from "axios";
import PersonIcon from "@material-ui/icons/Person";
import Error from "../components/Error";
import ReactDOM from "react-dom";

class Content extends Component {
    constructor(prop) {
        super(prop);
        this.submitComment = this.submitComment.bind(this);
    }

    state = {
        content: {
            id: null,
            title: null,
            featuredImage: null,
            body: null,
            author: {}
        },
        comments: [],
        topics: []
    };
    componentDidMount() {
        //load
        this.props.switchIsLoading();

        if (this.props.showSidebar) {
            this.props.switchSidebar();
        }
        //get content
        var content = QueryString.parse(this.props.history.location.search);
        content = content.content;

        var self = this;
        Axios.get("/api/content?content=" + content).then(
            data => {
                self.setState(state => {
                    return {
                        ...state,
                        content: data.data.content,
                        comments: state.comments.concat(data.data.comments),
                        topics: state.topics.concat(data.data.topics)
                    };
                });
                var node = ReactDOM.findDOMNode(self);
                node = node.querySelector('#content-body');
                node.innerHTML = self.state.content.body.replace(/\n/g,"<br>");

                self.props.switchIsLoading();
            },
            () => {
                window.scrollTo(0, 0);
            }
        );
    }

    submitComment = function(e) {
        e.preventDefault();
        var form = new FormData(e.target);
        var self = this;

        //submit comment
        Axios.post('/api/create_comment?content='+self.state.content.id,form)
             .then((data)=>{
                self.setState(state => {
                    return {
                        ...state,
                        comments:[data.data.comment,...state.comments]
                    };
                });
                var node = ReactDOM.findDOMNode(self);
                node = node.querySelector('#comment-form form textarea');
                node.value = "";
             },() => {})
    }

    publishContent = function(e) {
        e.preventDefault();
        var self = this;
        Axios.get('/api/publish_content?content='+self.state.content.id)
             .then((data) => {
                 self.setState((state)=>{
                     return {
                         ...state,
                         content:data.data.content
                     }
                 });
             },() => {});
    }

    unpublishContent = function(e) {
        e.preventDefault();
        var self = this;
        Axios.get('/api/unpublish_content?content='+self.state.content.id)
             .then((data) => {
                 self.setState((state)=>{
                     return {
                         ...state,
                         content:data.data.content
                     }
                 });
             },() => {});
    }

    render() {
        return (
            <div
                id="content"
                style={
                    this.props.isLoading == true ||
                    this.props.showSidebar == true
                        ? { display: "none" }
                        : {}
                }
            >
                {this.props.errors.map(error => {
                    return (
                        <Error
                            key={error.id}
                            {...this.props}
                            owner={error.id}
                            message={error.msg}
                        />
                    );
                })}
                <h4 id="content-title">{this.state.content.title}</h4>
                <div id="topics">
                    {
                        this.state.topics.map((topic)=>{
                            return (<Link to={'/topic?topic_id='+topic.id+'&topic_name='+topic.title}>{topic.title}</Link>);
                        })
                    }
                </div>
                <img
                    id="content-image"
                    src={
                        this.state.content.featuredImage != null
                            ? this.state.content.featuredImage
                            : ""
                    }
                />
                <div id="content-body"></div>
                <div id="content-footer">
                    <PersonIcon
                        id="author-img"
                        style={
                            this.state.content.author.avatar != null
                                ? { display: "none" }
                                : {}
                        }
                    />
                    <img
                        id="author-img"
                        style={
                            this.state.content.author.avatar == null
                                ? { display: "none" }
                                : {}
                        }
                        src={
                            this.state.content.author.avatar != null
                                ? this.state.content.author.avatar
                                : ""
                        }
                    />
                    <div id="author-details">
                        {this.state.content.author.name}
                        <br />
                        {this.state.content.author.email}
                    </div>
                </div>
                <div id="actions">
                    <button onClick={this.changeContentImage} style={this.state.content.author.id == this.props.user_id || this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <CameraAltIcon /> Change image
                    </button>
                    <button onClick={this.editContentTitle} style={this.state.content.author.id == this.props.user_id || this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <SpellcheckIcon /> Edit Title
                    </button>
                    <button onClick={this.editContent} style={this.state.content.author.id == this.props.user_id || this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <EditIcon />
                        Edit post
                    </button>
                    <button onClick={deleteContent} style={this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <DeleteIcon /> Delete
                    </button>
                    <button onClick={this.publishContent} style={this.state.content.isPublished == false && this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <CheckIcon />
                        Publish
                    </button>
                    <button onClick={this.unpublishContent} style={this.state.content.isPublished == true && this.props.user_role =='ADMIN' ? {} : {"display":"none"}}>
                        <LayersClearIcon />
                        Unpublish
                    </button>
                    <button onClick={this.editTopics} style={this.state.content.author.id == this.props.user_id || this.props.user_role =='ADMIN'  ? {} : {"display":"none"}}>
                        <EditAttributesIcon />
                        Edit topics
                    </button>
                </div>
                <div id="comments">
                    <h4 style={this.state.comments.length == 0 ? {"display":"none"} : {}} id="comment-title">Comments</h4>
                    {this.state.comments.map(comment => {
                        return (
                            <div key={comment.id} class="comment">
                                {comment.comment}
                                <br />
                                @{comment.name}
                            </div>
                        );
                    })}
                </div>
                <div id="comment-form">
                    <form onSubmit={this.submitComment}>
                        <textarea placeholder="Comment here" name="comment"></textarea>
                        <button type="submit">Comment</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Content;
