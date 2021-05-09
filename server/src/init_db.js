var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

connection.connect();

connection.query("CREATE SCHEMA IF NOT EXISTS `door_access` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;", function (err) {
    if (err) throw err;
    console.log("Scheme door_access successfully created.");
});

connection.query("USE door_access;", function (err) {
    if (err) throw err;
    console.log("Scheme door_access successfully created.");
});


connection.query("CREATE TABLE IF NOT EXISTS `users` ( `email` VARCHAR(30) NOT NULL, `password` VARCHAR(30) NOT NULL, PRIMARY KEY (`email`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;", function (err) {
    if (err) throw err;
    console.log("User data table has been created.");
});



connection.query('insert ignore into users (email, password) values ("email@email.com", "password")', function (err) {
    if (err) throw err;
    console.log("user data #1 added");
});

connection.query('insert ignore into users (email, password) values ("test@gmail.com", "1234");', function (err) {
    if (err) throw err;
    console.log("user data #2 added.");
});

connection.end();
