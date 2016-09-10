/**
 * Created by Nikhil S on 08-Sep-16.
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/hello', handleRootRequestfunction);

function handleRootRequestfunction(req, res){
    res.send('hello nikhil');
}

app.listen(3000);