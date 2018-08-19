import React from 'react';
import { take, put, call, fork, race, all, takeLatest, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import history from '../history.js';
import  sports  from '../api/sports';
import  events from '../api/events';
import { selectSports } from '../selectors/sports';
import { selectAccessToken } from '../selectors/auth';
import { handleRequestError } from './index';
import {
    FETCH_FAVORITE_SPORTS,
    FETCH_ALL_SPORTS,
    SET_AUTH,
    FETCH_COMPETITIONS, FETCH_EVENTS,
    SAVE_SPORT, DELETE_SPORT,

} from '../actions/types';
import {
    getAllSportsSuccess,
    getFavoriteSportsSuccess,
    getSportCompetitionsSuccess,
    saveSportSuccess,
    saveSportFailure
} from '../actions/sports';
import {
    sendingRequest,
    requestError
} from '../actions';
import {getEventsSuccess} from "../actions/events";

import Notifications from 'react-notification-system-redux';
let successNotification = {
  position: 'br',
  autoDismiss: 7
};

// ==================
// WORKERS
// ==================

/**
* @param forceFetch boolean | Se e' true, forza il fetch degli sport anche se ce ne sono gia' nello state
*/
function* fetchSports(forceFetch = false) {

    const stateSports = yield select(selectSports);
    if (stateSports.length === 0 || forceFetch) {
      yield put(sendingRequest(true));
      try {
          const response = yield call(sports.fetchAll);
          yield put(getAllSportsSuccess(response));

      } catch (err) {
          yield put(requestError(err));
      } finally {
          yield put(sendingRequest(false));
      }
    }
}

function* saveSport(action) {
  yield put(sendingRequest(true));
  const token = yield select(selectAccessToken);

  try {
    const response = (action.isNew)
      ? yield call(sports.create, action.sport,token)
      : yield call(sports.save, action.sport, token);
      //TODO: Verificare che non ci siano stati errori di validazione
    if (response.code == 400) {
      yield call(handleRequestError, response, saveSportFailure(response));
    } else if (response.name !== undefined) {
      yield put(saveSportSuccess(response, action.isNew));
      //display success notification
      successNotification.message = action.isNew ? "Sport creato con successo." : "Le informazioni sono state aggiornate.";
      yield put(Notifications.show(successNotification));
      if (action.isNew)
        history.push('/sports');
    } else {
      yield call(handleRequestError, response, saveSportFailure(response));
    }
  } catch (err) {
    yield put(requestError(err));
  } finally {
    yield put(sendingRequest(false));;
  }
}
function* deleteSport(action) {
  const { sport } = action;
  yield put(sendingRequest(true));
  const token = yield select(selectAccessToken);

  try {
    const response = yield call(sports.delete, sport, token);
    if (response.status === 204) {
      successNotification.message = 'Lo sport è stato eliminato';
      yield put({ type: DELETE_SPORT.SUCCESS, sport});
      yield put(Notifications.info(successNotification));
      history.push('/sports');
    } else {
      yield call(handleRequestError, response, {type: DELETE_SPORT.FAILURE});
    }

  } catch (err) {
    yield put(requestError(err));
  } finally {
    yield put(sendingRequest(false));

  }
}
function* fetchCompetitions(sport) {

    yield put(sendingRequest(true));
    try {
        const response = yield call(sports.fetchCompetitions, sport);
        yield put(getSportCompetitionsSuccess(sport._id, response));
    } catch (err) {
        yield put(requestError(err));

    } finally  {
        yield put(sendingRequest(false));
    }
}

function* fetchEvents(competitionId) {

    yield put(sendingRequest(true));

    try {

        let response;

        if (competitionId)
            response = yield call(events.fetchByCompetition, competitionId);
        else
            response = yield call(events.fetchAll);


        yield put(getEventsSuccess(response));

    } catch (err) {
        yield put(requestError(err));
    } finally {
        yield put(sendingRequest(false));
    }
}

// ==================
// WATCHERS
// ==================


function* watchGetSports() {

    while(true) {
        const action = yield take(FETCH_ALL_SPORTS.REQUEST);

        // let token = yield select(getToken);
        yield call(fetchSports, action.forceFetch);


    }
}

function* watchGetCompetitions() {
    while (true) {
        const req = yield take(FETCH_COMPETITIONS.REQUEST);
        //let token = yield select(getToken);
        yield call(fetchCompetitions, req.sport);
    }
}

function* watchGetEvents() {
    while (true) {
        const req = yield take(FETCH_EVENTS.REQUEST);

        const response = yield call(fetchEvents, req.competitionId);
    }
}
function* watchSaveSport() {
  yield takeLatest(SAVE_SPORT.REQUEST, saveSport);
}
function* watchDeleteSport() {
  yield takeLatest(DELETE_SPORT.REQUEST, deleteSport);
}


export default function* root() {
    /*//Non proseguo finché non ho un token. Posso farlo perché la login saga (./login.js), se non trova una token
    //Rimanda al login. In questo modo blocco il generatore finché non ho una otken
    let token = null;
    while (token == null) {
        //Aspetto l'azione SET_AUTH, che verrà impostata su true se avrò una token. Se viene impostata su false
        //la login saga rimanda direttamente al Login
        let logged = yield take(SET_AUTH);
        token = (logged) ? yield select(getToken) : null;
    }
*/

    yield all([
        fork(watchGetSports),
        fork(watchDeleteSport),
        fork(watchGetCompetitions),
        fork(watchGetEvents),
        fork(watchSaveSport),

    ])
}
