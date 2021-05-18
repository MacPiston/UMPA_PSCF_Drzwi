import Head from 'next/head'
import React from 'react'
import styles from '../styles/User.module.css'
import { useState } from 'react'
import Popup from './editPopup'
const io = require("socket.io-client");

var users = [];

const socket = io.connect("http://localhost:4000", {
    transports: ['websocket'],
    upgrade: false
});

socket.on('deleteUserRes', function (data) {
    if (data.error=="true") {
        alert('Podano następujący email: ' + data.email + ' \n Usuwanie zakończyło się sukcesem');
        Main.deleting(data.email);
    } else {
        alert('Podano następujący email: ' + data.email + ' \n Usuwanie zakończyło się niepowodzeniem');
    }
});

socket.on('addUserRes', function (data) {
    if (data.error === "true") {
        alert('Podano następujący email: ' + data.email +' haslo: '+ data.password + '\n Dodanie zakończyło się sukcesem');
        Main.adding(data.email,data.password);
    } else {
        alert('Podano następujący email: ' + data.email +' haslo: '+ data.password + '\n Dodanie zakonczyło się niepowodzeniem');
    }
});

class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;
    }
}

function userForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function UserTable(props) {
    var index = 1;
    return (
        <div className={styles.table}>
            <div className={styles.tableheader}>
                <div>Lp.</div>
                <div>Email</div>
                <div>Password</div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {props.items.map(item => (
                <div className={styles.tableRow} key={index}>
                    <div>{index++}</div>
                    <div>{item.email}</div>
                    <div>{item.password}</div>
                    <div>
                        <button className={styles.editButtonTable} onClick={() => Main.editing(item.email)}>EDIT</button>
                    </div>
                    <div>
                        <button className={styles.deleteButtonTable} onClick={() => Main.deleting(item.email)}>DELETE</button>
                    </div>
                    <div>
                        <button className={styles.permButtonTable} onClick={() => Main.permissions(item.email)}>PERSMISSIONS</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Main() {
    
    const [userName, setUserName] = useState("initialValue");
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const currentEditUser = (email) => {
        setUserName(email);
    }
    
    const refresh = userForceUpdate();
    let emailInputAdd = React.createRef();
    let passwordInputAdd = React.createRef();

    socket.on('users', function(data) {
        console.log(data);
        for(const user of data) {
            users.push(new User(user.email, user.password));
        }
        console.log(users);
        refresh();
    });

    function checkIfNewUserExists(email) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email) {
                return true;
            }
        }
        return false;
    }

    function addUser(email, password) {
        var newUser = new User(email, password);
        users.push(newUser);
        refresh();
    }


    function deleteUser(email) {
        var index;
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            socket.emit("deleteUser", {email: email});
            users.splice(index, 1);
            refresh();
        }
    }

    function editUser(email){
        currentEditUser(email);
        togglePopup();
    }

    function editPermissions(email){
        alert("permissions " + email);
    }

    function executeEdit(email, password) {
        for(var user of users) {
            if(user.email == userName) {
                if(password != "") {
                    user.password = password;
                    socket.emit("editPassword", {email: userName, newPassword: password});
                } if(email != "") {
                    user.email = email;
                    socket.emit("editEmail", {oldEmail: userName, newEmail: email});
                } 
            }
        }
        togglePopup();
        refresh();
    }

    Main.adding = addUser;
    Main.deleting = deleteUser;
    Main.editing = editUser;
    Main.permissions = editPermissions;

    function handleSubmitAdd(event) {
        event.preventDefault();
        event.stopPropagation();
        if(checkIfNewUserExists(emailInputAdd.current.value)) {
            alert("Użytkownik o podanym emailu już istnieje!");
            return;
        }
        socket.emit("addUser", {email: emailInputAdd.current.value, password: passwordInputAdd.current.value});
        emailInputAdd.current.value = '';
        passwordInputAdd.current.value = '';
    }

    return (
        <>
        <div className={styles.container}>
            <Head>
                <title>Users</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Users
                </h1>
                <UserTable items={users}/>
                <div className={styles.box}>
                    <form className={styles.form} onSubmit={handleSubmitAdd}>
                        <h2>Add user</h2>
                        <input className={styles.inputtext} placeholder="Email" type="text" ref={emailInputAdd} />
                        <input className={styles.inputtext} placeholder="Password" type="password" ref={passwordInputAdd} />
                        <input className={styles.inputsubmit} type="submit" value="Add new user" />
                    </form>
                </div>
            </main>
            
        </div>
        {isOpen && <Popup
                user={userName}
                handleClose={togglePopup}
                handleEdit={executeEdit}/>}
        </>
    );

}
