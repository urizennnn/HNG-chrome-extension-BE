require('dotenv').config();
require('express-async-errors');
const path = require('path')
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const fileupload = require('express-fileupload');
const morgan = require('morgan')
app.use(express.json());
app.use(morgan('dev'))
app.use(express.static('./server'))


// middleware
app.use(fileupload());
//  routes
app.use('/api/HNG', routes);

// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

(async () => {
    try {

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
})();
