const mysql = require('mysql')
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'karanp',
    password: '1234',
    database: "DB",
    port: '3306'
});

db.connect(err => {
    if (err) {
        console.log("This is the error: " + err);
    }
    console.log("Connected succesfully")
    createTable();
})
function createTable() {
    console.log("Karan is here")
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    )`;

    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log('Table created');
    });
}
function checkUsernameExists(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
        db.query(sql, [username], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].count > 0);
            }
        });
    });
}
async function registerUser(username, password) {
    // Check if the username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
        return "not";
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store username and hashed password in the database
    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log('User registered');
                resolve();
            }
        });
    });
}
async function signin(username, password) {
    const sql = 'SELECT * FROM users WHERE username = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error(err);
                reject('error');
                return;
            }

            if (results.length === 0) {
                resolve('invalid');
                return;
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                resolve('invalid');
                return;
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
            resolve(token);
        });
    });
}

async function getStation() {
    const sql = 'SELECT station_id, station_name FROM StationSlots';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
}
    

async function getSlot(newData, id){
    

    const sql='select * from StationSlots WHERE station_id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql,id, (err, results) => {
            if (err) {
               reject(err);
            } else {
               resolve(results);
               //console.log("results");
               console.log(results);
            }
        });
    });
}
async function bookStation(newData, id){
    console.log(newData.booked)

    const sql='UPDATE StationSlots SET booked = ? WHERE slot_id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql,[newData.booked,id], (err, results) => {
            if (err) {
               reject(err);
            } else {
               resolve(results);
               //console.log("results");
               console.log(results);
            }
        });
    });
}



module.exports = {
    registerUser, signin, getStation, bookStation, getSlot
};