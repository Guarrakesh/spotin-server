import {
  FETCH_ALL_SPORTS,
  FETCH_FAVORITE_SPORTS,
  REQUEST_ERROR,
  SENDING_REQUEST,
  FETCH_COMPETITIONS,
  SAVE_SPORT,
  DELETE_SPORT,
  DELETE_COMPETITION,

} from '../actions/types';



let initialState = {

  sports: [],
  currentlySending: false,
  error: ''


};

export default function entitiesReducer(state = initialState, action) {
  let sports, competitions;
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
    case SAVE_SPORT.SUCCESS:
        //aggiorno la competizione negli sport
        sports = state.sports.map((sport) => {
          if (sport._id === action.competition.sport_id) {
            if (action.isNew) {
              if (!sport.competitions)
              //lo sport non aveva competizioni, creo l'array e infilo l'elemento
                sport['competitions'] = [action.competition];
                //lo sport ha gia' array di competizioni, pusho l'array
              else sport.competition.push(action.competition)
            } else {
              //La competizione è stata aggiornata, devo modificarla
              competitions = sport.competitions.map(comp => (
                 (comp._id === action.competition._id) ? action.competition : comp));
              sport.competitions = competitions;
            }
        }
        return sport;
      });
      return {...state, sports: sports, error: ''};
    case DELETE_SPORT.SUCCESS:
      sports = state.sports.filter(sport => sport._id == action.sport._id);
      return {...state, error: '', sports: sports};
    case DELETE_COMPETITION.SUCCESS:
      sports = state.sports.map((sport) => {
        if (sport._id === action.competition._id) {
          if (!sport.competitions) return sport;
          competitions = sport.competitions.filter(comp => comp._id !== action.competition._id);
          sport.competitions = competitions;
        }
      });
      return {...state, error: '', sports: sports};
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
