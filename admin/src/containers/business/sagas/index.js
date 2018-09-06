import { take, select, fork, all, call, put, takeEvery } from 'redux-saga/effects'; // eslint-disable-line

import { USER_LOGIN_SUCCESS, GET_LIST } from 'react-admin';
import { GET_USER_BUSINESSES_SUCCESS, GET_USER_BUSINESSES } from '../actions';


//State selector
const businessStateSelector = state => state.business;

function business(authProvider, dataProvider) {
  if (!authProvider || !dataProvider) return () => null;

  function* authWatcher() {

    let user = {};

    const businessState = yield select(businessStateSelector);
    try {

      user = yield call(authProvider, 'AUTH_GET_USER');
    } catch (e) {

      yield take(USER_LOGIN_SUCCESS);
      user = yield call(authProvider, 'AUTH_GET_USER');
    }
    if (user.role !== "business") return;

    try {
      if (businessState.current === null) {

        yield put({type: GET_USER_BUSINESSES});
        const response = yield call(dataProvider, GET_LIST, 'businesses', {
          pagination: {page: 1, perPage: 100},
          sort: {},
          filter: {user: user._id}
        });

          yield put({type: GET_USER_BUSINESSES_SUCCESS, response});


      }
    } catch (e) {
      console.log("ERRORE IN SAGA: ", e);
    }



  }

  return function* businessSaga() {

    yield all([
      fork(authWatcher)
    ])

  };

}





export default (authProvider, dataProvider) =>
  function* rootSaga() {
    yield all([
      business(authProvider, dataProvider)(),
    ])
  }

