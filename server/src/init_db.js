var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

connection.connect();

connection.query("DROP DATABASE IF EXISTS `door_access`;", function(err) {
    if(err) throw err;
    console.log("Cleared previous schema.");
});

connection.query("CREATE SCHEMA IF NOT EXISTS `door_access` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;", function (err) {
    if (err) throw err;
    console.log("Scheme door_access successfully created.");
});

connection.query("USE door_access;", function (err) {
    if (err) throw err;
    console.log("Scheme door_access successfully created.");
});

//-----------------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------------

connection.query("CREATE TABLE IF NOT EXISTS  `door_access`.`doors` (`lockID` VARCHAR(45) NOT NULL, `door_name` VARCHAR(30) NOT NULL, `uuid` VARCHAR(30) UNIQUE NOT NULL, `isOpen` BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (`lockID`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;", function (err) {
    if (err) throw err;
    console.log("Doors data table has been created.");
});


connection.query('insert ignore into doors (lockID, door_name, uuid) values ("192.1.200.15", "serwerownia", "11111111111");', function (err) {
    if (err) throw err;
    console.log("door data #1 added");
});

connection.query('insert ignore into doors (lockID, door_name, uuid) values ("200.200.150.1", "pracownia", "22222222222");', function (err) {
    if (err) throw err;
    console.log("door data #2 added.");
});


//-----------------------------------------------------------------------------------------------------

connection.query("CREATE TABLE IF NOT EXISTS  `door_access`.`permissions` (`lockID` VARCHAR(45) NOT NULL,`email` VARCHAR(45) NOT NULL, PRIMARY KEY(`lockID`, `email`), CONSTRAINT `FK_lockID` FOREIGN KEY (`lockID`) REFERENCES `door_access`.`doors` (`lockID`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `FK_email` FOREIGN KEY (`email`) REFERENCES `door_access`.`users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;"
, function (err) {
    if (err) throw err;
        console.log("Doors data table has been created.");
});


connection.query('insert ignore into permissions (lockID, email) values ("192.1.200.15", "email@email.com");', function (err) {
    if (err) throw err;
    console.log("permission data #1 added");
});

connection.query('insert ignore into permissions (lockID, email) values ("192.1.200.15", "test@gmail.com");', function (err) {
    if (err) throw err;
    console.log("permission data #2 added.");
});

//-----------------------------------------------------------------------------------------------------

connection.query("CREATE TABLE IF NOT EXISTS `door_access`.`admins` (`login` VARCHAR(30) NOT NULL, `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`login`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci; ", function (err) {
    if (err) throw err;
    console.log("Admins data table has been created.");
});

connection.query('insert ignore into admins(login, password) values("admin", "admin");', function (err) {
    if (err) throw err;
    console.log("admin data #1 added.");
});

connection.query('insert ignore into admins(login, password) values("root", "root");', function (err) {
    if (err) throw err;
    console.log("admin data #1 added.");
});



connection.end();
