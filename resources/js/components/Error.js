import React,{Component} from "react";
import ErrorCss from "../assets/css/error.css";
import  ClearIcon from "@material-ui/icons/Clear";

class Error extends Component{
    render() {
        return (
            <div id="error">
                <div id="first">
                {this.props.message}
                </div>
                <div id="second">
                    <ClearIcon id="icon" message={this.props.message} owner={this.props.owner} onClick={this.props.removeError}/>
                </div>
            </div>
        );
    }
}

export default Error;