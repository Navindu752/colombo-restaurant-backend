const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const itemRouter = require('./routes/itemRoute');
const orderRouter = require('./routes/orderRoute');
const uri = require('./config/db');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config(); // to load .env file content

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Colombo Restaurant API",
            version: "1.0.0",
            description: "Colombo Restaurant Service Endpoints"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT ? process.env.PORT : 5000}`

            }, {
                url: process.env.BACKEND_DEP_URL
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    console.log("Connected to database");
});

let app = express();

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cors());

app.use(helmet());

if (process.env.IS_DEV == "true") {
    app.get('/', (req, res) => {
        res.send("<h2 style='text-align:center'>Welcome to Colombo Restaurant API services!\n<br></h2><h4 style='text-align:center'><button><a href='/api-docs'>Click here for api reference</a></button></h4>")
    });

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
}

app.use('/user', userRouter);//user routes
app.use('/items', itemRouter);//item routes
app.use('/orders', orderRouter);//order routes

module.exports = app;
