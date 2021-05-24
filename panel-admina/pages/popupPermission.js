import React from "react"
import styles from '../styles/popupPermission.module.css'
import Main from "./users";
import { useState } from 'react';

class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;
        this.perm=false;
    }
    setPermission(perm){
        this.perm=perm;
    }
}

var users = [];
var doorUsers = [];
var doorUsersNew = [];

function DoorItem(props) {

    const [isChecked, setIsChecked] = useState(props.items.perm);

    function handleClick(email) {
        for(const userperm of doorUsersNew) {
            if(userperm.email===email) {
                userperm.perm=!userperm.perm;
            }
        }
        setIsChecked(!isChecked);
    }

    var index = 1;
    return (
        <div className={styles.table}>
                <div className={styles.doorRow}>
                    <div>{index++}.</div>
                    <div>{props.items.email}</div>
                    <div><input id={props.items.email} type="checkbox" defaultValue={true} checked={isChecked} onChange={() => handleClick(props.items.email)}/></div>
                </div>
        </div>
    );
}




const Popup = props => {

    users=props.usersAll;
    doorUsers = props.usersPerm;

    function save() {
        props.handleSave(doorUsersNew,users);
    }

    function cancel() {
        props.handleClose();
    }

    if(doorUsers.length>0){
        for(const userperm of doorUsers) {
            for(const user of users){
                if(userperm.email === user.email){
                    user.setPermission(true);
                }
            }
        }
    }
    doorUsersNew = users;

    return(
        <div className={styles.popupbox}>
            <div className={styles.boxpop}>
                <div className={styles.buttonGroup}>
                    <button className={styles.saveButton} onClick={save}>Save</button>
                    <button className={styles.cancelButton} onClick={cancel}>Cancel</button>
                </div>
                <h1> Edit permissions for doors: {props.lockID} </h1>
                <div className={styles.tableheader}>
                    <div>Lp.</div>
                    <div>Email</div>
                    <div>Permission</div>
                </div>
                {doorUsersNew.map(item => (
                    <DoorItem items={item}/>
                ))}
            </div>
        </div>
    );
}

export default Popup;
