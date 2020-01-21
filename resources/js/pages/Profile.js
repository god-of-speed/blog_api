import React,{Component} from "react";
import Image from "../assets/img/logo.png";
import ProfileCss from "../assets/css/profile.css";

class Profile extends Component{
    render() {
        return (
            <div id="profile" style={this.props.isLoading == true || this.props.showSidebar == true ? {"display":"none"} : {}}>
                <div id="profile-image">
                    <img src={Image}/>
                </div>
                <div id="profile-details">
                    <span>Name</span>
                    <span>email</span>
                </div>
            </div>
        );
    }
}

export default Profile;