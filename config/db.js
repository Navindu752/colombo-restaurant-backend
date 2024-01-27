require('dotenv').config();

const {DB_USER,DB_PASSWORD,DB_NAME,DB_CLUSTER} = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net`

module.exports = uri;