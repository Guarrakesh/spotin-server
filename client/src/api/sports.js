import vars from '../vars';
import { request } from './index';

const sports = {
    async fetchAll() {
        try {
            let response = await request(`${vars.apiUrl}/sports`, {}, 'GET' );
            let data = await response.json();
            return data;
        } catch (err) {
            throw new Error(err);
        }

    },

    async fetchCompetitions(sport) {
        try {
            let response = await request(`${vars.apiUrl}/sports/${sport._id}/competitions`, {}, 'GET');
            let data = await response.json();
            return data;
        } catch (err) {
            throw new Error(err);
        }
    },

    async save(sport, accessToken) {
      try {
        const id = sport._id;
        delete sport._id;
        let response = await request(`${vars.apiUrl}/sports/${sport._id}`, sport, 'POST', accessToken);
        let data = await response.json();
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async create(sport, accessToken) {
      try {
        const response = await request(`${vars.apiUrl}/sports`, sport, 'POST', accessToken);
        const data = await response.json();
        return data;
      } catch (err) {
        throw new Error(err);
      }
    }
}


export default sports;