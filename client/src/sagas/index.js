import { takeEvery, take, all, fork, select, put} from 'redux-saga/effects';
import loginRoot from './login';
import sportsRoot from './sports'

import { REQUEST_ERROR } from 'actions/types';
import Notifications from 'react-notification-system-redux';

function* watchRequestErrors() {
  let notification = {
    position: 'bc',
    autoDismiss: 15
  };
  while (true) {

    const action = yield take(REQUEST_ERROR);
    notification.message = action.error.message || "Si è verificato un errore durante la richiesta.";
    yield put(Notifications.error(notification));
  }
}

export default function* root() {
  yield all([
      fork(loginRoot),
      fork(sportsRoot),
      fork(watchRequestErrors)
      ]);
}
