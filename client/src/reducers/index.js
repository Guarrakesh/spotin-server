import { combineReducers } from 'redux';

import { reducer as notifications } from 'react-notification-system-redux';

import authReducer from './authReducer';
import entitiesReducer  from './entitiesReducer';
const rootReducer = combineReducers({
    notifications: notifications,
    auth: authReducer,
    entities: entitiesReducer

});


export default rootReducer;
