import React from "react"
import styles from '../styles/PermissionModal.module.css'


const DoorItem = props => {
    var temp = props.isChecked;
    function handleClick() {
        if(props.isChecked) {
            console.log("delete perm");
            temp = false;
        } else {
            console.log("add perm");
        }
    }
    return(
        <div className={styles.doorRow}>
            <div>{props.index}.</div>
            <div>{props.lockID}</div>
            <div>{props.doorName}</div>
            <div><input id={props.lockID} type="checkbox" checked={temp } onClick={props.onClick}/></div>
        </div>
    );
}

function checkDoorsInPermissions(permissions, door) {
    for(const perm of permissions) {
        if(door.lockID == perm.lockID) {
            return true;
        }
    }
    return false;
}


const PermissionPopup = props => {
    let emailInputAdd = React.createRef();
    let passwordInputAdd = React.createRef();
    var index = 1;
    var doors = props.doorsList;
    var permissions = props.permissionList;

    function handleOnClick(data) {
        console.log("clicked");
        /*if(checkDoorsInPermissions(props.permissionList, door)) {
            console.log("delete perm");
        } else {
            console.log("add perm");
        }*/
    }

    return(
        <div className={styles.popupbox}>
            <div className={styles.boxpop}>
                <div className={styles.buttonGroup}>
                    <button className={styles.saveButton} onClick={props.handleSave}>Save</button>
                    <button className={styles.cancelButton} onClick={props.handleCancel}>Cancel</button>
                </div>
                <h1> Edit permissions for user: {props.user} </h1>
                <div className={styles.tableheader}>
                    <div>Lp.</div>
                    <div>Lock IP</div>
                    <div>Door Name</div>
                    <div>Permission</div>
                </div>
                {doors.map(door => (
                    <DoorItem index={index++} lockID={door.lockID} doorName={door.doorName} 
                    isChecked={checkDoorsInPermissions(permissions, door)}
                    onClick={handleOnClick}/>
                ))}
            </div>
        </div>
    );
}

export default PermissionPopup;