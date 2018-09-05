import { GET_LIST } from 'react-admin';


export const GET_USER_BUSINESSES = 'GET_USER_BUSINESSES';
export const GET_USER_BUSINESSES_SUCCESS = 'GET_USER_BUSINESSES';
export const CHANGE_BUSINESS = 'CHANGE_BUSINESS';



export const getUserBusinesses = (userId) => {

  return {
    type: GET_USER_BUSINESSES,

    payload: {filter: {user: userId}, pagination: {page: 1, perPage: 100}, sort: {}},
    meta: {
      fetch: GET_LIST,
      resource: 'businesses',

    }
  }

};


export const changeBusiness = (businessId) => {
  return {
    type: CHANGE_BUSINESS,
    selected: businessId
  };
}
