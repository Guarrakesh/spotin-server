import { combineReducers } from 'redux';

import authReducer from './authReducer';
import entitiesReducer  from './entitiesReducer';
const rootReducer = combineReducers({
    auth: authReducer,
    entities: entitiesReducer

});


export default rootReducer;
