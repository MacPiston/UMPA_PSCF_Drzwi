import Head from 'next/head'
import React from 'react'
import styles from '../styles/User.module.css'
import { useState } from 'react'
import Popup from './editPopupDoor'
import Login from './login';
const io = require("socket.io-client");

class Door {
    constructor(lockID, doorName) {
        this.lockID = lockID;
        this.doorName = doorName;
    }
}

var doors = [];

const socket = io.connect("http://localhost:4000", {
    transports: ['websocket'],
    upgrade: false
});

socket.emit('doorList', {});

socket.on('deleteDoorsRes', function (data) {
    if (data.error) {
        alert('Usuwanie zakończyło się sukcesem');
        Main.deleting(data.lockID);
    } else {
        alert('Usuwanie zakończyło się niepowodzeniem');
    }
});

socket.on('addDoorsRes', function (data) {
    if (data.error) {
        alert('Podano następujący ID: ' + data.lockID +' oraz hasło: '+ data.doorName + '\nDodanie zakończyło się sukcesem');
        Main.adding(data.lockID,data.doorName);
    } else {
        alert('Podano następujący ID: ' + data.lockID +' oraz hasło: '+ data.doorName + '\nDodanie zakonczyło się niepowodzeniem');
    }
});

socket.on('doorListRes', function(data) {
    for(const door of data) {
        doors.push(new Door(door.lockID, door.doorName));
    }
    Main.refresh;
});

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function DoorTable(props) {
    var index = 1;
    return (
        <div className={styles.table}>
            <div className={styles.tableheader}>
                <div>Lp.</div>
                <div>lockID</div>
                <div>doorName</div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {props.items.map(item => (
                <div className={styles.tableRow} key={index}>
                    <div>{index++}</div>
                    <div>{item.lockID}</div>
                    <div>{item.doorName}</div>
                    <div>
                        <button className={styles.editButtonTable} onClick={() => Main.editing(item.lockID)}>EDIT</button>
                    </div>
                    <div>
                        <button className={styles.deleteButtonTable} onClick={() => Main.deleting(item.lockID)}>DELETE</button>
                    </div>
                    <div>
                        <button className={styles.permButtonTable} onClick={() => Main.permissions(item.lockID)}>PERSMISSIONS</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Main() {


    const [lockIDState, setlockID] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const refresh = useForceUpdate();
    let doorIDAdd = React.createRef();
    let doorNameAdd = React.createRef();

    const [login, setLogin] = useState(true);

    const loginUser = () => {
        socket.emit("isLoggedIn", {});
        socket.on("isLoggedInResponse", (data) => {
            console.log("login");
            console.log(data.isLoggedIn);
            setLogin(data.isLoggedIn);
            return data.isLoggedIn;
        });
    }

    loginUser();

    if(!login) {
        return <Login setLogin={setLogin} />
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const currentEditDoor = (lockID) => {
        setlockID(lockID);
    }

    function checkIfNewDoorExists(doorName) {
        for (let i = 0; i < doors.length; i++) {
            console.log(doors[i]);
            if (doors[i].doorName === doorName) {
                return true;
            }
        }
        return false;
    }

    function addDoor(lockID, doorName) {
        var newDoor = new Door(lockID, doorName);
        doors.push(newDoor);
        refresh();
    }

    function deleteDoor(lockID) {
        for (let i = 0; i < doors.length; i++) {
            if (doors[i].lockID === lockID) {
                socket.emit("deleteDoors", {lockID: lockID});
                doors.splice(i, 1);
                refresh();
                break;
            }
        }
        socket.emit('doorList', {});
    }

    function editDoor(lockID){
        currentEditDoor(lockID);
        togglePopup();
    }

    function editPermissions(email){
        alert("permissions " + email);
    }

    function executeEdit(lockID, doorName) {
        for(var door of doors) {
            if(door.lockID === lockIDState) {
                if(doorName != "") {
                    door.doorName = doorName;
                    socket.emit("editDoorName", {newDoorName: doorName, oldLockID: lockIDState});
                } if(lockID != "") {
                    door.lockID = lockID;
                    socket.emit("editLockId", {newLockID: lockID, oldLockID: lockIDState});
                }
            }
        }
        togglePopup();
        Main.refresh;
    }

    Main.refresh = useForceUpdate;
    Main.adding = addDoor;
    Main.deleting = deleteDoor;
    Main.editing = editDoor;
    Main.permissions = editPermissions;

    function handleSubmitAdd(event) {
        event.preventDefault();
        event.stopPropagation();
        if(checkIfNewDoorExists(doorIDAdd.current.value)) {
            alert("Drzwi o podanym ID już istnieją!");
            return;
        }
        socket.emit("addDoors", {lockID: doorIDAdd.current.value, doorName: doorNameAdd.current.value});
        doorIDAdd.current.value = '';
        doorNameAdd.current.value = '';
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Users</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Doors
                </h1>
                <DoorTable items={doors}/>
                <div className={styles.box}>
                    <form className={styles.form} onSubmit={handleSubmitAdd}>
                        <h2>Add user</h2>
                        <input className={styles.inputtext} placeholder="DoorID" type="text" ref={doorIDAdd} />
                        <input className={styles.inputtext} placeholder="DoorName" type="password" ref={doorNameAdd} />
                        <input className={styles.inputsubmit} type="submit" value="Add new user" />
                    </form>
                </div>
            </main>
            {isOpen && <Popup
                user={lockIDState}
                handleClose={togglePopup}
                handleEdit={executeEdit}/> }
        </div>
    );
}
