import {
    LOGIN,
    LOGOUT,
    SET_AUTH,
    SENDING_REQUEST,
    REQUEST_ERROR
} from '../actions/types';
import auth from '../api/auth';


let token = auth.getAuthToken() || null;

let initialState = {

    loggedIn: token ? true : false,
    currentlySending: false,
    error: null,
    token: token,
    user: auth.getUserInfo()

}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH:
            return {...state, loggedIn: action.newAuthState, token: action.token};
        case LOGIN.REQUEST:
        case SENDING_REQUEST:
            return {...state, currentlySending: action.sending};
      case LOGIN.SUCCESS:
            return {...state, user: action.user, error: null};
        case LOGIN.FAILURE:
        case REQUEST_ERROR:
            return {...state, error: action.error};
        default:
            return state;
    }
}
