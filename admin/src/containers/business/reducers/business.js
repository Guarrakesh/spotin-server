import {GET_USER_BUSINESSES_SUCCESS, CHANGE_BUSINESS } from '../actions';

const initialState = {
  current: null,
  data: null,
}
export default (previousState = initialState, action) => {

  switch (action.type) {
    case GET_USER_BUSINESSES_SUCCESS: {

      return { ...previousState, current: action.response.data[0]._id, data: action.response.data}
    }
    case CHANGE_BUSINESS: {
      return { ...previousState, current: action.selected }
    }

  }
  return { ...previousState}
}
