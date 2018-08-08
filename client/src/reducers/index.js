import { combineReducers } from 'redux';

import authReducer from './authReducer';
import sportsReducer  from './sportsReducer';
const rootReducer = combineReducers({
    auth: authReducer,
    sports: sportsReducer

});


export default rootReducer;
