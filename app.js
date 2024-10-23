const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSession = require('express-session');

const db = require('./config/mongooseConnection');
const ownerRouter = require('./routes/ownerRouter')
const userRouter = require('./routes/userRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require('./routes/index');

require("dotenv").config();

app.set('view engine', "ejs");
app.use((express.json()));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    })
);
app.use(flash())

app.use('/', indexRouter);
app.use('/owners', ownerRouter);
app.use('/users', userRouter);
app.use('/products', productsRouter);

app.listen(3000);