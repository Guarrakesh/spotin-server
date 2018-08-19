import { takeEvery, take, all, fork, select, put} from 'redux-saga/effects';
import loginRoot from './login';
import sportsRoot from './sports'



import { REQUEST_ERROR } from 'actions/types';
import Notifications from 'react-notification-system-redux';
import history from '../history.js';
/**
* Questa funzione viene chiamata da un saga effect call, all'interno dei worker
* quando la richiesta http non è andata a buon fine. La funzione
* si occupa di capire se si è trattato di un errore del server (5xx) o client (4xx)
* @param {object} response L'oggetto da analizzare per capire di che errore si tratti, può anche essere un oggetto Error
* @param {object} [actionToDispatch] l'azione da dispatchare alla fine del parsing, può
*/
export function* handleRequestError(response, actionToDispatch = null) {
  let notification = {position: 'bc', autoDismiss: 10};
  if (response.code) {
    if (response.code <= 499 && response.code >= 400) {
      //Client error
      switch (response.code) {
        case 401:
          //Unhautorized (No AuthToken/Expired Token)
          //La token è scaduta o non è stata fornita
          //accedere a questa risorsa
          if (response.message && response.message === "jwt expired") {
            notification.message = "La tua sessione è scaduta. Effettua dinuovo l'accesso";

            history.push('/')
          } else if (response.message && response.message === "No auth token") {
            notification.message = "Devi effettuare l'accesso per eseguire questa azione.";
          }
        break;
        case 403:
          //Forbidden, l'utente non è autorizzato
          notification.message = "Non hai l'autorizzazione necessaria per eseguire questa azione";
        case 404:
          notification.message = "La risorsa non è stata trovata.";
        case 400:
          if (response.errors) {//Errore di convalida
            notification.message = "I dati inseriti non sono corretti:"
            const errorString = response.errors.map(err => `\n - ${err.field}: ${err.messages.join("\n")}`).join("\n");
            notification.message += "\n " + errorString;
            notification.autoDismiss = 30;
          } else {
            notification.message = "La richiesta non è andata a buon fine (Error 400)";
          }
        break;
      }
      yield put(Notifications.warning(notification));
    } else if (response.code >= 500 && response.code < 600) {
      notification.message = "Si è verificato un'errore sul server. Contatta l'assistenza per maggiori informazioni";
      notification.message += ` (Error ${response.code} / ${response.message})`;
      yield put(Notifications.error(notification));
    }
  } else {
    notification.message = "Si è verificato un'errore sconosciuto. <br/> "
      + JSON.stringify(response);
    yield put(Notifications.error(notification));
  }

  if (actionToDispatch) {
    yield put(actionToDispatch);

  }
}


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
