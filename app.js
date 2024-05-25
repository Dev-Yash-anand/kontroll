const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');

const db = require('./config/mongooseConnection');
const ownerRouter = require('./routes/ownerRouter')
const userRouter = require('./routes/userRouter')
const productsRouter = require('./routes/productsRouter')

app.set('view engine', "ejs");
app.use((express.json()));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use('/owners', ownerRouter);
app.use('/users', userRouter);
app.use('/products', productsRouter);

app.listen(3000);