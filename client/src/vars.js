export default {

    apiUrl: process.env.NODE_ENV === "production" ? "/v1" : "http://localhost:3001/v1"
};
