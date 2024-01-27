require('dotenv').config(); // to load .env file content

const PORT = process.env.PORT || 5001;
const app = require('./app');

app.listen(PORT, () => {
    console.log("Listening on port: ", PORT);
});