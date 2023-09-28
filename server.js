require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const routes = require('./routes/routes');
const fileupload = require('express-fileupload');
const morgan = require('morgan')
// const cloudinary = require('cloudinary').v2.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// })

// database
app.use(express.json());
app.use(morgan('dev'))

// middleware
app.use(fileupload());
// Define routes
app.use('/api/HNG', routes);

// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

(async () => {
    try {

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
})();
