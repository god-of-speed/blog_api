import React,{Component} from "react";
import LoginCss from "../assets/css/login.css";
import {Link} from "react-router-dom";
import Axios from "axios";
import Error from "../components/Error";
import QueryString from "query-string";

class Login extends Component {
    constructor(prop) {
        super(prop);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        if (this.props.showSidebar) {
          this.props.switchSidebar();
        }
      }

    submit = function(e) {
        e.preventDefault();
        var form = new FormData(e.target);
        var self = this;
        if(this.props.history.location.search != "") {
            var redirect = QueryString.parse(this.props.history.location.search);
            redirect = redirect.redirect;
        }
        //send data
        Axios.post('/api/login',form)
             .then((data) => {
                self.props.setUser(data.data);
                 if(redirect != null) {
                     self.props.history.push(redirect);
                 }else{
                     self.props.history.push('/');
                 }
             },() => {
                 window.scrollTo(0,0);
             });
    }
      
    render() {
        return (
            <div id="login" style={this.props.isLoading == true || this.props.showSidebar == true ? {"display":"none"} : {}}>
                {this.props.errors.map((error) => {
                    return <Error key={error.id} {...this.props} owner={error.id} message={error.msg}/>
                })}
                <h4>Login</h4>
                <form id="form" onSubmit={this.submit}>
                    <input type="text" name="email" placeholder="E-mail" id="email"/>
                    <input type="password" name="password" placeholder="Password" id="password"/>
                    <div id="submit-div">
                        <button id="submit" type="submit">
                            Login
                        </button>
                    </div>
                </form>
                <div id="others">
                    <a>Forgot Password</a>
                    OR
                    <Link to="/register">Not yet member? sign up here</Link>
                </div>
            </div>
        );
    }
}

export default Login;