const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/scatch")
.then(function(){
   console.log("connected to mongodb");
})
.catch(function(err){
    console.log(err,"doesn't connected to mongodb");             
})

module.exports = mongoose.connection; 