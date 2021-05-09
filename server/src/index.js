const express = require('express');
const socket = require("socket.io");

const app = express();

class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;
    }
}

var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

var io = socket(server);


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "door_access"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * from users", function (error, results, fields) {
        if (err) throw err;
        console.log(results);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', (socket) => {
    console.log("connection");
    socket.on('loginRequest', (data) => {
        var loginQuery = 'SELECT * from door_access.users WHERE email = "' + data.email + '" AND password = "' + data.password + '"';
        connection.query(loginQuery, function (error, result, field) {
            if (error) {
                console.log("Login user email=" + data.email + " with password=" + data.password+ ": failed");
                socket.emit('loginRequestRes', ("false"));
                throw error;
            }
            if (result.length > 0) {
                console.log("Login user email=" + data.email + " with password=" + data.password+ ": success");
                socket.emit('loginRequestRes', ("true"));
            }
            else {
                console.log("Login user email=" + data.email + " with password=" + data.password+ ": failed");
                socket.emit('loginRequestRes', ("false"));
            }
        });
    });

    socket.on("addUser", (data) => {
        var addQuery = 'insert ignore into users (email, password) values ("' + data.email + '", "' + data.password + '");';
        connection.query(addQuery, function (err, result, fields) {
            if (err){
                console.log("Added user:" + data.email + " with password: " + data.password+" : failed");
                socket.emit('addUserRes', ({email: data.email, error: "false",password : data.password}));
                throw err;
            }
            else{
                console.log("Added user:" + data.email + " with password: " + data.password+" : success");
                socket.emit('addUserRes', ({email: data.email, error: "true",password : data.password}));
            }
        });
    });

    socket.on('deleteUser', (data) => {
        var deleteQuery = 'DELETE from users where email = "' + data.email + '";';


        connection.query(deleteQuery, function (err, result, fields) {
            if (err){
                console.log("Deleted user:" + data.email+" : failed");
                socket.emit('deleteUserRes', {email: data.email, error: "false"});
                throw err;
            }
            else{
                console.log("Deleted user:" + data.email+" : success");
                socket.emit('deleteUserRes', {email: data.email, error: "true"});
            }
        });
    });
    socket.on('pullUsers', (data) => {
        var users = [new User("test@gmail.com", "12345678"), new User("test@gmail.com", "12345678"),
            new User("xd@lol.com", "123"), new User("asdlasdo@sfsl.com", "12asdad3")];
        socket.emit('pullUsersRes', (users));
    })
});
