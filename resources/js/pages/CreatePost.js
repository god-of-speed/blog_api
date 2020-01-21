import React,{Component} from "react";
import ReactDOM from "react-dom";
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import CreatePostCss from '../assets/css/create_post.css';
import AddImg from '../assets/img/addImg.jpeg';
import DocImg from '../assets/img/docImg.png';
import SaveIcon from '@material-ui/icons/Save';
import Axios from "axios";
import Select from "react-select";
import Error from "../components/Error";

class CreatePost extends Component {
    constructor(prop) {
        super(prop);
        this.stimulateFeaturedImageClick = this.stimulateFeaturedImageClick.bind(this);
        this.stimulatePostBodyClick = this.stimulatePostBodyClick.bind(this);
        this.setFeaturedImageLabel = this.setFeaturedImageLabel.bind(this);
        this.setPostBodyLabel = this.setPostBodyLabel.bind(this);
        this.submit = this.submit.bind(this);
        this.setSelectedTopics = this.setSelectedTopics.bind(this);
    }

    state = {
        topics:[],
        selectedTopics:[]
    }

    componentDidMount() {
        if (this.props.showSidebar) {
          this.props.switchSidebar();
        }
        var self = this;
        //get available topics
        Axios.get('/api/topics')
             .then((data)=>{
                return self.setState((state) => {
                    return state = {...state,topics:data.data.topics};
                });
             },(err) =>{
                return window.scrollTo(0, 0);
             });
      }

    stimulateFeaturedImageClick = function() {
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('#featured-image').click();
    }

    stimulatePostBodyClick = function() {
        const node = ReactDOM.findDOMNode(this);
        node.querySelector('#post-body').click();
    }

    setFeaturedImageLabel = function(e) {
        var input = e.target;
        //set reader
        var reader = new FileReader();
        var self = this
        reader.onload = function() {
            var dataURL  = reader.result;
            var node = ReactDOM.findDOMNode(self);
            var output = node.querySelector('#add-img');
            output.src = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
    }

    setPostBodyLabel = function(e) {
        var input = e.target;
        var node = ReactDOM.findDOMNode(this);
        var output = node.querySelector('#doc-name');
        output.innerHTML = input.files[0].name;
    }

    setSelectedTopics = function(e) {
        return this.setState((state) => {
            return state = {...state,selectedTopics:e.map((topic)=>{
                return topic.value;
            })};
        });
    }

    submit = function(e) {
        e.preventDefault();
        //set data
        var form = new FormData(e.target);
        form.append('topics',this.state.selectedTopics);

        //send data
        var self = this;
        Axios.post('/api/create_content',form)
             .then((data)=>{
                return self.props.history.push('/content?content='+data.data.content.id);
             },(err) =>{
                return window.scrollTo(0, 0);
        });
    }

    render() {
        return (
            <div id="create-post" style={this.props.isLoading == true || this.props.showSidebar == true ? {"display":"none"} : {}}>
                {this.props.errors.map((error) => {
                    return <Error key={error.id} {...this.props} owner={error.id} message={error.msg}/>
                })}
                <h4>Create Post</h4>
                <form id="form" onSubmit={this.submit}>
                    <div id="title-div">
                        <input type="text" placeholder="Title" name="title"/>
                    </div>
                    <div id="featured-image-div">
                        <label onClick={this.stimulateFeaturedImageClick}>
                            <img src={AddImg} id="add-img"/>
                            Featured Image
                        </label>
                        <input onChange={this.setFeaturedImageLabel} type="file" name="featuredImage" id="featured-image"/>
                        <span>Click to change</span>
                    </div>
                    <div id="post-body-div">
                        <label onClick={this.stimulatePostBodyClick}>
                            <img src={DocImg} id="doc-img"/>
                            <span id="doc-name"></span>
                            Post
                        </label>
                        <input onChange={this.setPostBodyLabel} type="file" name="body" id="post-body"/>
                        <span>Click to change</span>
                    </div>
                    <div id="topics-div" style={this.state.topics.length == 0 ? {"display":"none"} : {}}>
                        <label>Select one or more topics</label>
                        <Select
                        className="topics"
                        onChange={this.setSelectedTopics}
                        isMulti
                        options={this.state.topics.map((topic) => {
                            return {value:topic.id,label:topic.title}
                        })}
                        />
                    </div>
                    <div id="submit-div">
                        <button id="submit" type="submit">
                            <SaveIcon /> Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default CreatePost;