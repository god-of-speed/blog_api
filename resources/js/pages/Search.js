import React,{Component} from "react";
import Image from "../assets/img/logo.png";
import HomeCss from "../assets/css/home.css";
import LoadGif from "../assets/gifs/ZKZg.gif";
import {Link} from "react-router-dom";
import QueryString from "query-string";
import Axios from "axios";
import Error from "../components/Error";

class Search extends Component {
    constructor(prop) {
        super(prop);
        this.loadMore = this.loadMore.bind(this);
    }

    state = {
        currentPage:1,
        pages:1,
        isLoading:false,
        contents:[]
    }

    componentDidMount() {
        if(this.props.showSidebar) {
            this.props.switchSidebar();
        }
        //load
        this.props.switchIsLoading();
        //get search
        var search = QueryString.parse(this.props.history.location.search);
        search = search.search;

        var self = this;
        Axios.get('/api/search?search='+search)
             .then((data)=>{
                 //set contents
                 self.setState((state)=>{
                     return {
                         ...state,
                         contents:state.contents.concat(data.data.contents),
                         pages:Math.ceil(parseInt(data.data.totalResult)/20) < 1 ? 1 : Math.ceil(parseInt(data.data.totalResult)/20)
                     }
                 });
                 this.props.switchIsLoading();
             },()=>{});
    }

    loadMore = function(e) {
        e.preventDefault();
        this.setState((state)=>{
            return {
                ...state,
                isLoading:true
            }
        });

        var self = this;
        //get search
        var search = QueryString.parse(this.props.history.location.search);
        search = search.search;

        Axios.get('/api/search?search='+search+'&page='+(self.state.currentPage + 1))
             .then((data)=>{
                 //set contents
                 self.setState((state)=>{
                     return {
                         ...state,
                         contents:state.contents.concat(data.data.contents),
                         pages:Math.ceil(parseInt(data.data.totalResult)/20),
                         currentPage: (state.currentPage + 1),
                         isLoading:false
                     }
                 });
             },()=>{});
    }

    render() {
        return (
            <div id="home" style={this.props.isLoading == true || this.props.showSidebar == true ? {"display":"none"} : {}}>
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
                {this.state.contents.map((content) => {
                    return (
                        <div key={content.id} className="post">
                    <div className="post-header">
                        <img className="post-img" src={content.featuredImage}/>
                        <Link to="/content" className="post-title">{content.title}</Link>
                    </div>
                    <div className="post-body">
                        <p>
                        {content.body}
                        </p>
                        <Link to={"/content?content="+content.id} className="continue-reading">Continue Reading</Link>
                    </div>
                </div>
                    );
                })}
                <button onClick={this.loadMore} id="load" style={this.state.currentPage == this.state.pages ? {"display":"none"} : {}} disabled={this.state.isLoading}>{this.state.isLoading == false ? 'Load more' : <img src={LoadGif} id="load-gif"/>}</button>
            </div>
        );
    }
}

export default Search;