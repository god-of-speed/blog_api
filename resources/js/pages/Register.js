import React,{Component} from "react";
import {Link} from "react-router-dom";
import RegisterCss from "../assets/css/register.css";
import Error from "../components/Error";

class Register extends Component {
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
        //send data
        Axios.post('/api/register',form)
             .then((data) => {
                self.props.setUser(data.data);
                     self.props.history.push('/');
             },() => {
                 window.scrollTo(0,0);
             });
    }
      
    render() {
        return (
            <div id="register" style={this.props.isLoading == true || this.props.showSidebar == true ? {"display":"none"} : {}}>
                {this.props.errors.map((error) => {
                    return <Error key={error.id} {...this.props} owner={error.id} message={error.msg}/>
                })}
                <h4>Sign up</h4>
                <form id="form" onSubmit={this.submit}>
                    <input name="firstname" type="text" placeholder="First name" id="firstname"/>
                    <input name="lastname" type="text" placeholder="Last name" id="lastname"/>
                    <input name="email" type="text" placeholder="E-mail" id="email"/>
                    <input name="password" type="password" placeholder="Password" id="password"/>
                    <div id="submit-div">
                        <button id="submit" type="submit">
                            Sign up
                        </button>
                    </div>
                </form>
                <div id="others">
                    <a>Forgot Password</a>
                    OR
                    <Link to="/login">Already a member? sign in here</Link>
                </div>
            </div>
        );
    }
}

export default Register;