const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");



//importing mongodb connection 
const db = require("./config/mongoose-connection");


//importing routes 
const ownerRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");


//staring server 
app.listen(3000);




app.use(express.json());
app.use(express.urlencoded({extened:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine" ,"ejs");



//describing routes
app.use("/owners", ownerRouter);
app.use("/users", usersRouter);
app.use("/products",productsRouter);




                          