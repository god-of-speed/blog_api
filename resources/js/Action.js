export function switchSidebarAction() {
    return {type:'SWITCH_SIDEBAR'};
}

export function switchIsLoadingAction() {
    return {type:'SWITCH_ISLOADING'};
}

export function addErrorAction(payload){
    return {type:'ADD_ERROR',payload:payload};
}

export function removeErrorAction(id) {
    return {type:'REMOVE_ERROR',payload:id};
}

export function setUserAction(payload) {
    return {type:'SET_USER',payload};
}

export function unsetUserAction() {
    return {type:'UNSET_USER'};
}