import { takeEvery, all, fork, select } from 'redux-saga/effects';
import loginRoot from './login';
import sportsRoot from './sports'



export default function* root() {
  yield all([
      fork(loginRoot),
      fork(sportsRoot)
      ]);
}


