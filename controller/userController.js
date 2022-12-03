const express = require('express')
const db = require('../db.config/db.config')
const jwt = require('jsonwebtoken');
// const Auth = require('./auth')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bcrypt = require('bcrypt');
SECRET = process.env.KEY


const register = async(req, res, next) => {
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const {username,password,email} = req.body
    const hash = await bcrypt.hash(password,10)
    console.log(username, password, email, hash);
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try {
        await db.query(`INSERT INTO unhan_modul_17 VALUES (DEFAULT , $1, $2, $3)`,[username,email,hash])
        res.send('Berhasil!')
    } catch (err){
        console.log(err.message)
        res.send(err.message)
    }
}

const login = async(req, res, next) => {
    
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    const { email, password } = req.body;
    try {
    const data = await db.query(`SELECT * FROM unhan_modul_17 WHERE email= $1; `,[email]) //Verifying if the user exists in the database
    const user = data.rows;
    if (user.length === 0) {
    res.status(400).json({
    error: "User tidak ada, Silahkan Daftar dulu!",
    });
    }
    else {
        bcrypt.compare(password, user[0].password, (err, result) => { //Comparing the hashed password
        if (err) {
        res.status(500).json({
        error: "Server error",
        });
        } else if (result === true) { //Checking if credentials match
        // 10. Generate token menggunakan jwt sign
        const token = jwt.sign(
        {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        password:user[0].password,
        },
        process.env.SECRET
        );
        res.cookie("JWT",token, {httpOnly: true, sameSite:"strict",})
        res.status(200).json({
        message: "User berhasil masuk!",
        //11. kembalikan nilai id, email, dan username
        id: user[0].id,
        user: user[0].username,
        email: user[0].email
        });
        }
        else {
            //Declaring the errors
            if (result != true)
            res.status(400).json({
            error: "Masukkan password dengan benar!",
            });
            }
            })
            }
            } catch (err) {
            console.log(err);
            res.status(500).json({
            error: "Database error occurred while signing in!", //Database connection error
            });
            };
}

const logout = async(req, res, next) => {
                
    try {
        // 14. code untuk menghilangkan token dari cookies dan mengembalikan pesan "sudah keluar dari aplikasi"  
        return res.clearCookie("JWT").send("Logout telah berhasil!")
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}

const verify = async(req, res, next) => {
    try {
        // 13. membuat verify\
        const data = req.data
        return res.status(200).json(data)
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err);
    }
}

module.exports = {
    register,
    login,
    logout,
    verify
}