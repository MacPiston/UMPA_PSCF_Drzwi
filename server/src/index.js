const express = require('express');
const socket = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

var isLoggedIn = false;

var users = [];
var doors = [];
var permissions = [];

class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;
    }
}

class Door {
    constructor(lockID, doorName) {
        this.lockID = lockID;
        this.doorName = doorName;
    }
}

var server = app.listen(4000, function() {
    console.log('Server is open on port 4000');
});

var io = socket(server);

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "door_access"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


connection.connect(function (err) {
    if (err) throw err;

    connection.query("SELECT * from users", function (error, results, fields) {
        if (error) throw error;

        for(const row of results) {
            users.push(new User(row.email, row.password));
        }

        io.on('connection', (socket) => {
            socket.on('requestUsers', function() {
                console.log("users requested");
                socket.emit('users', users);
            });
        });
        
    });

    connection.query("SELECT * from doors", function(error, results, fields) {
        if(error) throw error;
        for(const row of results) {
            doors.push(new Door(row.lockID, row.door_name));
        }
    });

});

io.on('connection', (socket) => {
    console.log("connection");
    
    socket.on('isLoggedIn', (data) => {
        socket.emit('isLoggedInResponse', {isLoggedIn: isLoggedIn});
    });

    socket.on('adminLoginRequest', (data) => {
        console.log("Admin Login Request: ");
        console.log(data);
        let adminLoginQuery = 'SELECT * from admins WHERE login="' + data.userName + '" AND password = "' + data.password + '";';
        var response = false;
        connection.query(adminLoginQuery, function(error, results, field) {
            if(error) {
                throw error;
            } if(results.length > 0) {
                isLoggedIn = true;
                response = true;
            }
            socket.emit('adminLoginResponse', {response: response});
        });
        
    });

    socket.on('loginRequest', (data) => {
        var loginQuery = 'SELECT * from door_access.users WHERE email = "' + data.email + '" AND password = "' + data.password + '"';
        connection.query(loginQuery, function (error, result, field) {
            if (error) {
                console.log("Login user email =" + data.email + " with password =" + data.password + ": failed");
                socket.emit('loginRequestRes', ("false"));
                throw error;
            }
            if (result.length > 0) {
                console.log("Login user email=" + data.email + " with password=" + data.password+ ": success");
                socket.emit('loginRequestRes', ("true"));
            } else {
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
                users.push(new User(data.email, data.password));
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
                for(var i = 0; i< users.length; i++) {
                    if(users[i].email == data.email) {
                        users.splice(i,1);
                        break;
                    }
                }
            }
        });
    });

    socket.on('addDoors', (data) => {
        var addDoorQuery = 'insert ignore into doors (lockID, door_name) values ("' 
            + data.lockID + '", "' + data.doorName + '");'; 
        
        connection.query(addDoorQuery, function(err, result, fields) {
            if(err) {
                console.log("Adding doors: " + data.lockID + "failed");
                socket.emit('addDoorsRes', {lockID: data.lockID, doorName: data.doorName, error: false});
                throw err;
            } else {
                console.log("Adding doors: " + data.lockID + "succeed");
                socket.emit('addDoorsRes', {lockID: data.lockID, doorName: data.doorName, error: true});
            }
        });
    });

    socket.on('deleteDoors', (data) => {
        var deleteDoorQuery = 'DELETE from doors where lockID = "' + data.lockID + '";';

        connection.query(deleteDoorQuery, function(err, result, fields) {
            if(err) {
                console.log("Deleting doors: " + data.lockID + "failed");
                socket.emit('deleteDoorsRes', {lockID: data.lockID, error: false});
                throw err;
            } else {
                console.log("Deleting doors: " + data.lockID + "succeed");
                socket.emit('deleteDoorsRes', {lockID: data.lockID, error: true});

            }
        });
    });

    socket.on('addPermission', (data) => {
        var addPermissionQuery = 'insert ignore into permissions (lockID, email) values ("' 
        + data.lockID + '", "' + data.email + '");';
        connection.query(addPermissionQuery, function(err, result, fields) {
            if(err) {
                console.log("Adding permission: " + data.lockID + " : " + data.email + " failed");
                socket.emit('addPermissionRes', {lockID: data.lockID, email: data.email, error: false});
                throw err;
            } else {
                console.log("Adding permission: " + data.lockID + " : " + data.email + " succeed");
                socket.emit('addPermissionRes', {lockID: data.lockID, email: data.email, error: true});
            }
        });
    });

    socket.on('deletePermission', (data) => {
        var deletePermissionQuery = 'DELETE from permissions where lockID = "' + data.lockID + '" AND email="' + data.email + '";';
        connection.query(deletePermissionQuery, function(err, result, fields) {
            if(err) {
                console.log("Deleting permission: " + data.lockID + " : " + data.email + " failed");
                socket.emit('deletePermissionRes', {lockID: data.lockID, email: data.email, error: false});
                throw err;
            } else {
                console.log("Deleting permission: " + data.lockID + " : " + data.email + " succeed");
                socket.emit('deletePermissionRes', {lockID: data.lockID, email: data.email, error: true});
            }
        });
    });

    socket.on('doorsList', (data) => {
        console.log("Doors List emited");
        var usersDoorsQuery = 'select * from doors WHERE lockID IN (select lockID from permissions WHERE email="'+ data.email +'");';
        var doorsList = [];
        connection.query(usersDoorsQuery, function(err, results, fields) {
            if(err) {
                console.log("Couldn't get list of doors for user: " + data.email);
            } else {
                
                for(const row of results) {
                    doorsList.push(new Door(row.lockID, row.door_name));
                }
                socket.emit('doors', {doorsList: doorsList});
                console.log(doorsList);
            }
        });
    });

    socket.on("editEmail", (data) => {
        console.log("editing email");
        var editEmailQuery = 'UPDATE users SET email = "' + data.newEmail + '" WHERE email="' + data.oldEmail + '";';
        connection.query(editEmailQuery, function(err){
            if(err) {
                console.log("Couldnt update user: " + data.oldEmail + " with new email: " + data.newEmail);
                throw err;
            } else {
                console.log("Successfully updated user with email: " + data.newEmail);
            }
        });
    });

    socket.on("editPassword", (data) => {
        console.log("editing password");
        var editPasswordQuery = 'UPDATE users SET password = "' + data.newPassword + '" WHERE email="' + data.email + '";';
        connection.query(editPasswordQuery, function(err){
            if(err) {
                console.log("Couldnt update user: " + data.email + " with new password: " + data.newPassword);
                throw err;
            } else {
                console.log("Successfully updated user with email: " + data.email + " pass: " + data.newPassword);
            }
        });
    });

    socket.on("fullDoorsListRequest", (data) => {
        var doorsListQuery = "SELECT * from doors";
        connection.query(doorsListQuery, function(err, results, fields) {
            if(err) {
                console.log("Couldn't get doors list");
                throw err;
            } else {
                var newDoorsList = [];
                for(const row of results) {
                    newDoorsList.push(new Door(row.lockID, row.door_name));
                }
                socket.emit("fullDoorsListResponse", {doorsList: newDoorsList});
                console.log("popup");
                console.log(newDoorsList);
            }
        });
    });
});


