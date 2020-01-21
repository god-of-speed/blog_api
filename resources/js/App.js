import React,{Component} from "react";
import Navbar from "./components/Navbar";
import AppCss from "./assets/css/app.css";
import {connect} from "react-redux";
import {BrowserRouter as Router,Switch,Route,Link,withRouter, Redirect} from "react-router-dom";
import {
    switchSidebarAction,
    switchIsLoadingAction, 
    addErrorAction, 
    removeErrorAction, 
    setUserAction, 
    unsetUserAction,
    logoutAction
} from "./Action";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import LoadingGif from "./assets/gifs/ZKZg.gif";
import ContentPage from "./pages/Content";
import CreatePostPage from "./pages/CreatePost";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TopicHome from "./pages/TopicHome";
import Profile from "./pages/Profile";
import Axios from "axios";
import Unpublished from "./pages/Unpublished";

class App extends Component {
    constructor(prop) {
        super(prop);
        this.logout = this.logout.bind(this);
    }
    
    componentWillMount() {
        //get token
        var self = this;
        var token = null;
        var user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            token = user.access_token;
            this.props.setUser(user);
        }
        console.log('hey');
        Axios.interceptors.request.use(function(config){
            config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            if(token) {
                config.headers.common['AUTHORIZATION'] = 'Bearer '+token;
                console.log(config);
            }
            return config;
        },function(err){
            return err;
        });

        Axios.interceptors.response.use(function(response){
            return response;
        },function(error){
            if(error.response.status == 405) {
                console.log('a');
            }else if(error.response.status == 401){
                self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:"Unauthenticated"});
                //get current url
                var currentURL = self.props.location.pathname+self.props.location.search;
                return self.props.history.push('/login?redirect='+currentURL); 
            }else if(error.response.status == 403){
                self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:"Unauthorized"});
                return Promise.reject();
            }else if(error.response.status == 404){
                self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:"Resource not found"});
                return Promise.reject();
            }else if(error.response.status == 500){
                self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:"Internal Server error"});
                return Promise.reject();
            }else if(error.response.status == 406) {
                if(error.response.data.error && error.response.data.errors) {
                    self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:error.response.data.error});
                    var obj = error.response.data.errors;
                    for(const property in obj) {
                        self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:obj[property][0]});
                    }
                }else if(error.response.data.error){
                    self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:error.response.data.error});
                }else if(error.response.data.errors) {
                    var obj = error.response.data.errors;
                    for(const property in obj) {
                        self.props.addError({id:self.props.errors[0] == null ? 1 : (self.props.errors[0].id + 1),msg:obj[property][0]});
                    }
                }
                return Promise.reject();
            }
        });
    }

    logout = function() {
        var self = this;
        Axios.get('api/logMeOut')
             .then(() => {
                 self.props.unsetUser();
             },() => {});
    }
    
    render() {
        return (
                <div id="container">
                <Navbar {...this.props} logout={this.logout} />
                <Sidebar {...this.props} logout={this.logout} />
                    <Switch>
                        <Route path="/content" render={(props) => <ContentPage {...props} {...this.props} />}/>
                        <Route path="/login" render={(props) => <LoginPage {...props} {...this.props} />}/>
                        <Route path="/register" render={(props) => <RegisterPage {...props} {...this.props} />}/>
                        <Route path="/topic" render={(props) => <TopicHome {...props} {...this.props} />}/>
                        <Route path="/profile" render={(props) => <Profile {...props} {...this.props} />}/>
                        <Route path="/unpublished_posts" render={(props) => <Unpublished {...props} {...this.props} />}/>
                        <Route path="/create_post" render={(props)=><CreatePostPage {...props} {...this.props} />}/>
                        <Route exact path="/" render={(props) => <Home {...props} {...this.props} />}/>
                    </Switch>
                <div id="app-loader" style={this.props.isLoading == false || this.props.showSidebar == true ? {"display":"none"} : {}}>
                    <img src={LoadingGif} id="app-loading-gif"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
}

const mapDispatchToProps = (dispatch) => {
    return {
        switchSidebar:() => {
            dispatch(switchSidebarAction());
        },
        switchIsLoading: () => {
            dispatch(switchIsLoadingAction());
        },
        addError: (msg) => {
            dispatch(addErrorAction(msg));
        },
        removeError: (e) => {
            dispatch(removeErrorAction(e.target.getAttribute("owner")));
        },
        setUser: (obj) => {
            dispatch(setUserAction(obj));
        },
        unsetUser: () => {
            dispatch(unsetUserAction());
        }
    };
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));