const express = require('express')
const app = express()
const PORT  = process.env.PORT || 5000
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const morgan = require('morgan');

const xssCLean = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found.js");
const routes = require('./routes/routes')



app.use(
    cors({
        origin: "*",
    })
);
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 60,
}))
app.use(helmet())
app.use(xssCLean())
app.use(mongoSanitize())
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/HNG',routes)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT,(req,res)=>{
    console.log(`Server listening on port ${PORT}`)
})