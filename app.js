const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');
const userRouter = require('./api/routes/user');


mongoose.connect('mongodb://admin:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop-shard-00-00.lwpsd.mongodb.net:27017,node-rest-shop-shard-00-01.lwpsd.mongodb.net:27017,node-rest-shop-shard-00-02.lwpsd.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-55l87d-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useMongonClient: true
})

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
// app.use(bodyparser.urlencoded({extended: false}));
// app.use(bodyparser.json());
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Allow-Headers", "origin, X-Requested-With, Content-Typr, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

// app.use is used for middleware
app.use('/products', productRouters);
app.use('/orders', orderRouters);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;