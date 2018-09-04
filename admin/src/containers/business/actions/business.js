import { GET_LIST } from 'react-admin';


export const GET_USER_BUSINESSES = 'GET_USER_BUSINESSES';

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
