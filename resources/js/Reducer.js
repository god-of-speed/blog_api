import Axios from "axios";

const initialState = {
    showSidebar:false,
    isLoading:false,
    errors:[],
    user_name:"",
    user_email:"",
    user_id:"",
    user_token:"",
    user_role:"",
    user_avatar:"",
    isAuthenticated:false
}

function reducer(state = initialState,action) {
    if(action.type == "SWITCH_SIDEBAR") {
        state = {...state,showSidebar:!state.showSidebar}
    }else if(action.type == "SWITCH_ISLOADING") {
        state = {...state,isLoading:!state.isLoading}
    }else if(action.type == "SET_USER") {
        var storage = window.localStorage;
        storage.setItem('token',action.payload.access_token);
        state = {
            ...state,
            user_name:action.payload.user.name,
            user_email:action.payload.user.email,
            user_id:action.payload.user.id,
            user_token:action.payload.access_token,
            user_role:action.payload.role.title,
            user_avatar:action.payload.user.avatar,
            isAuthenticated:true
        }
        var storage = window.localStorage;
        storage.clear();
        storage.setItem('user',JSON.stringify(action.payload));
        console.log(storage.getItem('user'));
    }else if(action.type == "UNSET_USER") {
        state = {
            ...state,
            user_name:"",
            user_email:"",
            user_id:"",
            user_token:"",
            user_role:"",
            user_avatar:"",
            isAuthenticated:false
        }
        var storage = window.localStorage;
        storage.clear();
    }else if(action.type == "ADD_ERROR") {
        state = {...state,errors:[action.payload,...state.errors]};
    }else if(action.type == "REMOVE_ERROR") {
        state = {...state,errors:state.errors.filter((err)=>{
            return err.id != action.payload;
        })};
    }
    return state;
}

export default reducer;