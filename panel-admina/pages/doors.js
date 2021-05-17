import Head from 'next/head'
import styles from '../styles/User.module.css'
import React from "react";
const io = require("socket.io-client");
import { useRouter } from 'next/router'

var users = [];

const socket = io.connect("http://localhost:4000", {
    transports: ['websocket'],
    upgrade: false
});
class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;

    }
}

socket.on('users', function(data) {
    console.log("Got users");
    for(const user of data) {
        users.push(new User(user.email, user.password));
    }
    console.log(users);
});


function UserTable(props) {

    var index = 1;

    return (
        <div className={styles.table}>
            <div className={styles.tableheader}>
                <div className={styles.headerItem}>Lp.</div>
                <div className={styles.headerItem}>Email</div>
                <div className={styles.headerItem}/>
            </div>
            {props.items.map(item => (
                    <div className={styles.tableRow} key={index}>
                        <div className={styles.tableData}>{index++}</div>
                        <div className={styles.tableData}>{item.email}</div>
                        <button className={styles.inputsubmit} onClick={() => Main.permissions(item.email)}>permission</button>
                    </div>
            ))}
        </div>
    );
}

export default function Main() {
    const router = useRouter();

    function goToPermissions(email) {
        localStorage.setItem(name,email)
        router.push("permission")
    }

    Main.permissions = goToPermissions;

    return (
        <div className={styles.container}>
            <Head>
                <title>Użytkownicy</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Użytkownicy
                </h1>
                <UserTable items={users}/>
            </main>
        </div>
    )
}
