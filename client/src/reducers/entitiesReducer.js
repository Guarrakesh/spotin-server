import {
  FETCH_ALL_SPORTS,
  FETCH_FAVORITE_SPORTS,
  REQUEST_ERROR,
  SENDING_REQUEST,
  FETCH_COMPETITIONS,
  SAVE_SPORT
} from '../actions/types';



let initialState = {

  sports: [],
  currentlySending: false,
  error: ''


};

export default function entitiesReducer(state = initialState, action) {
  let sports;
  switch (action.type) {
    case FETCH_ALL_SPORTS.SUCCESS:
    case FETCH_FAVORITE_SPORTS.SUCCESS:
      return {...state, error:'', sports: action.sports};

    case SAVE_SPORT.SUCCESS:
      if (!action.isNew) {
        sports = state.sports.map((sport) => {
          if (sport._id == action.sport._id) return action.sport;
          return sport;
        });
      } else {
        sports = state.sports.concat(action.sport);
      }
      return {...state, error:'', sports: sports};
    case SAVE_SPORT.FAILURE:
        let error = action;
        delete error.type;
        return {...state, error: error};

    case FETCH_COMPETITIONS.SUCCESS:
      sports = state.sports.map((sport) => {

        if (sport._id == action.sportId)
          sport['competitions'] = action.competitions;
        return sport;
      });

      return { ...state, error:'', sports: sports};



    case SENDING_REQUEST:
      return {...state, currentlySending: action.sending};


    case REQUEST_ERROR:
      return {...state, error: action.error};


    default:
      return state;
  }
}
