import { combineReducers } from 'redux'; // eslint-disable-line

import businessReducer from './business';

const rootReducer = combineReducers({
  business: businessReducer
});

export default rootReducer;
