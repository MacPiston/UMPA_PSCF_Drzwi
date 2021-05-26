const express = require("express");
const socket = require("socket.io");

const app = express();

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

class Permission {
  constructor(lockID, email) {
    this.lockID = lockID;
    this.email = email;
  }
}

function getUsersDoors(userEmail) {
  var doorList = [];
  var permissionsArray = permissions.filter(function (el) {
    return el.email == userEmail;
  });
  for (const door of doors) {
    for (const perm of permissionsArray) {
      if (door.lockID == perm.lockID) {
        doorList.push(door);
        break;
      }
    }
  }
  return doorList;
}

var server = app.listen(4000, function () {
  console.log("listening for requests on port 4000,");
});

var io = socket(server);

function sendUsers() {
  io.on("connection", (socket) => {
    socket.emit("users", users);
  });
}

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "door_access",
});

connection.connect(function (err) {
  if (err) throw err;
  connection.query("SELECT * from users", function (error, results, fields) {
    if (err) throw err;
    for (const row of results) {
      users.push(new User(row.email, row.password));
      console.log(row.email + "-" + row.password);
    }
    sendUsers();
  });
  connection.query("SELECT * from users", function (error, results, fields) {
    if (err) throw err;
    for (const row of results) {
      users.push(new User(row.email, row.password));
      console.log(row.email + "-" + row.password);
    }
    sendUsers();
  });

  connection.query("SELECT * from doors", function (error, results, fields) {
    if (err) throw err;
    for (const row of results) {
      doors.push(new Door(row.lockID, row.door_name));
    }
    console.log(doors);
  });

  connection.query(
    "SELECT * from permissions",
    function (error, results, fields) {
      if (err) throw err;
      for (const row of results) {
        permissions.push(new Permission(row.lockID, row.email));
      }
      console.log(permissions);
      console.log(getUsersDoors("email@email.com"));
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("loginRequest", (data) => {
    var loginQuery =
      'SELECT * from door_access.users WHERE email = "' +
      data.email +
      '" AND password = "' +
      data.password +
      '"';
    connection.query(loginQuery, function (error, result, field) {
      if (error) {
        console.log(
          "Login user email=" +
            data.email +
            " with password=" +
            data.password +
            ": failed"
        );
        socket.emit("loginRequestRes", false);
        throw error;
      }
      if (result.length > 0) {
        console.log(
          "Login user email=" +
            data.email +
            " with password=" +
            data.password +
            ": success"
        );
        socket.emit("loginRequestRes", true);
      } else {
        console.log(
          "Login user email=" +
            data.email +
            " with password=" +
            data.password +
            ": failed"
        );
        socket.emit("loginRequestRes", false);
      }
    });
  });

  socket.on("addUser", (data) => {
    var addQuery =
      'insert ignore into users (email, password) values ("' +
      data.email +
      '", "' +
      data.password +
      '");';
    connection.query(addQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Added user:" +
            data.email +
            " with password: " +
            data.password +
            " : failed"
        );
        socket.emit("addUserRes", {
          email: data.email,
          error: "false",
          password: data.password,
        });
        throw err;
      } else {
        console.log(
          "Added user:" +
            data.email +
            " with password: " +
            data.password +
            " : success"
        );
        socket.emit("addUserRes", {
          email: data.email,
          error: "true",
          password: data.password,
        });
      }
    });
  });

  socket.on("deleteUser", (data) => {
    var deleteQuery = 'DELETE from users where email = "' + data.email + '";';

    connection.query(deleteQuery, function (err, result, fields) {
      if (err) {
        console.log("Deleted user:" + data.email + " : failed");
        socket.emit("deleteUserRes", { email: data.email, error: "false" });
        throw err;
      } else {
        console.log("Deleted user:" + data.email + " : success");
        socket.emit("deleteUserRes", { email: data.email, error: "true" });
      }
    });
  });

  socket.on("addDoors", (data) => {
    var addDoorQuery =
      'insert ignore into doors (lockID, door_name) values ("' +
      data.lockID +
      '", "' +
      data.doorName +
      '");';

    connection.query(addDoorQuery, function (err, result, fields) {
      if (err) {
        console.log("Adding doors: " + data.lockID + "failed");
        socket.emit("addDoorsRes", {
          lockID: data.lockID,
          doorName: data.doorName,
          error: false,
        });
        throw err;
      } else {
        console.log("Adding doors: " + data.lockID + "succeed");
        socket.emit("addDoorsRes", {
          lockID: data.lockID,
          doorName: data.doorName,
          error: true,
        });
      }
    });
  });

  socket.on("deleteDoors", (data) => {
    var deleteDoorQuery =
      'DELETE from doors where lockID = "' + data.lockID + '";';

    connection.query(deleteDoorQuery, function (err, result, fields) {
      if (err) {
        console.log("Deleting doors: " + data.lockID + "failed");
        socket.emit("deleteDoorsRes", { lockID: data.lockID, error: false });
        throw err;
      } else {
        console.log("Deleting doors: " + data.lockID + "succeed");
        socket.emit("deleteDoorsRes", { lockID: data.lockID, error: true });
      }
    });
  });

  socket.on("addPermission", (data) => {
    var addPermissionQuery =
      'insert ignore into permissions (lockID, email) values ("' +
      data.lockID +
      '", "' +
      data.email +
      '");';
    connection.query(addPermissionQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Adding permission: " + data.lockID + " : " + data.email + " failed"
        );
        socket.emit("addPermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: false,
        });
        throw err;
      } else {
        console.log(
          "Adding permission: " + data.lockID + " : " + data.email + " succeed"
        );
        socket.emit("addPermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: true,
        });
      }
    });
  });

  socket.on("deletePermission", (data) => {
    var deletePermissionQuery =
      'DELETE from permissions where lockID = "' +
      data.lockID +
      '" AND email="' +
      data.email +
      '";';
    connection.query(deletePermissionQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Deleting permission: " + data.lockID + " : " + data.email + " failed"
        );
        socket.emit("deletePermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: false,
        });
        throw err;
      } else {
        console.log(
          "Deleting permission: " +
            data.lockID +
            " : " +
            data.email +
            " succeed"
        );
        socket.emit("deletePermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: true,
        });
      }
    });
  });

  socket.on("doorsList", (data) => {
    console.log("doorsList emited");
    var doorsList = getUsersDoors(data.email);
    socket.emit("doors", { doorsList: doorsList });
    console.log(doorsList);
  });
});
