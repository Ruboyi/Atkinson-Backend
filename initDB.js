'use strict'
require('dotenv').config()
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const getPool = require('./app/infrastructure/database-infrastructure')

const { HTTP_SERVER, PATH_USER_IMAGE } = process.env

const usersArray = [
    'Elsa_12367',
    'Ruben',
    'Aaron',
    'Nacho',
    'Messi',
    'Salva',
    'Stefano',
    'Rick',
    'Dani',
    'pepe',
    'admin1',
]

const phoneArray = [
    '603142556',
    '634564223',
    '673457344',
    '614274065',
    '611234546',
    '601231234',
    '602424112',
    '623144345',
    '613124345',
    '655757864',
    '623535644',
]

let connection
async function initDB() {
    try {
        connection = await getPool()
        // drop and create database atkinson
        await connection.query('DROP DATABASE IF EXISTS atkinson')
        await connection.query(
            'CREATE DATABASE IF NOT EXISTS atkinson DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci'
        )
        // use database atkinson
        await connection.query('USE atkinson')
        // delete pre-existing tables
        await connection.query('DROP TABLE IF EXISTS favorites')
        await connection.query('DROP TABLE IF EXISTS orders')
        await connection.query('DROP TABLE IF EXISTS productReports')
        await connection.query('DROP TABLE IF EXISTS productImages')
        await connection.query('DROP TABLE IF EXISTS products')
        await connection.query('DROP TABLE IF EXISTS reviews')
        await connection.query('DROP TABLE IF EXISTS users')

        // create table users
        await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        idUser INT NOT NULL AUTO_INCREMENT,
        nameUser VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL,
        password VARCHAR(120) NOT NULL,
        image VARCHAR(300) NULL DEFAULT NULL,
        phone VARCHAR(120) NULL DEFAULT NULL,
        createdAt DATE NOT NULL,
        verifiedAt DATE NULL DEFAULT NULL,
        updatedAt DATE NULL DEFAULT NULL,
        verificationCode VARCHAR(255) NULL DEFAULT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        isBanned TINYINT(1)  DEFAULT '0',
        isOnline TINYINT(1)  DEFAULT '0',
        lastLogin DATETIME NULL DEFAULT NULL,
        PRIMARY KEY (idUser))
    `)

        // generate 10 users - (usersArray)
        console.log('Creating 10 users...')

        const avatarsArray = [
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/1-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/2-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/3-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/4-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/5-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/6-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/7-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/8-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/9-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/10-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/11-asdasdasd.jpg`,
        ]

        for (let i = 0; i < usersArray.length; i++) {
            let name = usersArray[i]
            let email = `${usersArray[i]}@yopmail.com`
            let phone = phoneArray[i]
            const password = '123456'
            const passwordHash = await bcrypt.hash(password, 12)
            const image = avatarsArray[i]

            const now = new Date().toISOString()
            const mySQLDateString = now.slice(0, 19).replace('T', ' ')
            const verificationCode = randomstring.generate(64)

            // insert user
            await connection.query(`
        INSERT INTO users(nameUser, email, password, image, phone, createdAt, verifiedAt, verificationCode, role) 
        VALUES (
            "${name}",
            "${email}",
            "${passwordHash}",
            "${image}",
            '${phone}',
            "${mySQLDateString}",
            "${mySQLDateString}",
            "${verificationCode}",
            "user"

        )
        `)
        }
        await connection.query(
            `UPDATE atkinson.users SET role = 'admin' WHERE (idUser = '11')`
        )

        // ---------------------------------------------------------
        console.log('DB atkinson created')
        // ---------------------------------------------------------
    } catch (error) {
        console.log(error)
    } finally {
        process.exit(0)
    }
}

initDB()
