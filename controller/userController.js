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
    const {email, password} = req.body;
    const foundUser = await db.query(`SELECT * FROM unhan_modul_17 WHERE email=$1 LIMIT 1`, [email]);
    if (foundUser.rows.length === 0) {
        return res.send('Invalid Username');
    }
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    try {
        const hashedPassword = await bcrypt.compare(password, foundUser.rows[0].password);
        if (hashedPassword) {
            // 10. Generate token menggunakan jwt sign
            let data = {
                id: foundUser.rows[0].id,
                username: foundUser.rows[0].username,
                email: email,
                password: password,
            }
            const token = jwt.sign(data, process.env.SECRET);
            foundUser.rows[0].token=token;
            //11. kembalikan nilai id, email, dan username
            return res.cookie("jwt",token, {httpOnly: true, sameSite: "strict",}).send(foundUser.rows[0]);
        } else {
            return res.send('Access Denied!');
        }
    } catch (error) {
        return res.send(error);
    }    
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