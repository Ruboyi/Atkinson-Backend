'use strict'
require('dotenv').config()
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const getPool = require('./app/infrastructure/database-infrastructure')

const { HTTP_SERVER, PATH_USER_IMAGE } = process.env

const usersArray = [
    { name: 'Ruben', email: 'ruben@yopmail.com' },
    { name: 'Lolo', email: 'lolo@yopmail.com' },
    { name: 'admin1', email: 'admin1@yopmail.com' },
]

const barbersArray = [
    { name: 'Barber1' },
    { name: 'Barber2' },
    { name: 'Barber3' },
    { name: 'Barber4' },
]

const phoneArray = ['603142556', '634564223', '673457344']

const servicesArray = [
    { name: 'Haircut', price: 15 },
    { name: 'Haircut & Beard', price: 20 },
    { name: 'Beard Trim', price: 10 },
]

const scheduleArray = [
    { type: 'Morning', start: '09:00', end: '13:00' },
    { type: 'Afternoon', start: '13:00', end: '17:00' },
    { type: 'Evening', start: '17:00', end: '22:00' },
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

        // create table schedules
        await connection.query(`
      CREATE TABLE IF NOT EXISTS schedules (
          idSchedule INT NOT NULL AUTO_INCREMENT,
          type VARCHAR(120) NOT NULL,
          startTime TIME NOT NULL,
          endTime TIME NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (idSchedule)
      )
    `)

        console.log('Table "schedules" created')

        // generate schedules
        console.log('Creating schedules...')

        for (let i = 0; i < scheduleArray.length; i++) {
            const { type, start, end } = scheduleArray[i]

            await connection.query(`
        INSERT INTO schedules (type, startTime, endTime)
        VALUES ("${type}", "${start}", "${end}")
      `)
        }

        console.log('Schedules created')

        // create table users
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
          idUser INT NOT NULL AUTO_INCREMENT,
          nameUser VARCHAR(120) NOT NULL,
          email VARCHAR(120) NOT NULL,
          password VARCHAR(120) NOT NULL,
          image VARCHAR(300) NULL DEFAULT NULL,
          phone VARCHAR(120) NULL DEFAULT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          verifiedAt TIMESTAMP NULL DEFAULT NULL,
          updatedAt TIMESTAMP NULL DEFAULT NULL,
          verificationCode VARCHAR(255) NULL DEFAULT NULL,
          role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
          isBanned TINYINT(1) DEFAULT '0',
          isOnline TINYINT(1) DEFAULT '0',
          lastLogin DATETIME NULL DEFAULT NULL,
          PRIMARY KEY (idUser)
      )
    `)

        console.log('Table "users" created')

        // generate users
        console.log('Creating users...')

        const avatarsArray = [
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/1-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/2-asdasdasd.png`,
            `${HTTP_SERVER}/${PATH_USER_IMAGE}/3-asdasdasd.png`,
        ]

        for (let i = 0; i < usersArray.length; i++) {
            const { name, email } = usersArray[i]
            const phone = phoneArray[i]
            const password = '123456'
            const passwordHash = await bcrypt.hash(password, 12)
            const image = avatarsArray[i]
            const verificationCode = randomstring.generate(64)

            await connection.query(`
        INSERT INTO users(nameUser, email, password, image, phone, verifiedAt, verificationCode) 
        VALUES (
            "${name}",
            "${email}",
            "${passwordHash}",
            "${image}",
            "${phone}",
            NOW(),
            "${verificationCode}"
        )
      `)
        }

        // update user role to admin
        await connection.query(`
      UPDATE users
      SET role = 'admin'
      WHERE idUser = 11
    `)

        console.log('Users created and updated')

        // create table barbers
        await connection.query(`
      CREATE TABLE IF NOT EXISTS barbers (
          idBarber INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(120) NOT NULL,
          idSchedule INT NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (idBarber),
          FOREIGN KEY (idSchedule) REFERENCES schedules (idSchedule)
      )
    `)

        console.log('Table "barbers" created')

        // generate barbers
        console.log('Creating barbers...')

        for (let i = 0; i < barbersArray.length; i++) {
            const { name } = barbersArray[i]

            // Obtén el idSchedule correspondiente al índice actual
            const idSchedule = (i % scheduleArray.length) + 1

            await connection.query(`
            INSERT INTO barbers (name, idSchedule)
            VALUES ("${name}", ${idSchedule})
          `)
        }

        console.log('Barbers created')

        // create table services
        await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
          idService INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(120) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (idService)
      )
    `)

        console.log('Table "services" created')

        // generate services
        console.log('Creating services...')

        for (let i = 0; i < servicesArray.length; i++) {
            const { name, price } = servicesArray[i]

            await connection.query(`
        INSERT INTO services (name, price)
        VALUES ("${name}", ${price})
      `)
        }

        console.log('Services created')

        // create table appointments
        await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
          idAppointment INT NOT NULL AUTO_INCREMENT,
          idUser INT NOT NULL,
          idBarber INT NOT NULL,
          idService INT NOT NULL,
          appointmentDate DATETIME NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (idAppointment),
          FOREIGN KEY (idUser) REFERENCES users (idUser),
          FOREIGN KEY (idBarber) REFERENCES barbers (idBarber),
          FOREIGN KEY (idService) REFERENCES services (idService)
      )
    `)

        console.log('Table "appointments" created')
    } catch (error) {
        console.error(error)
    } finally {
        if (connection) {
            connection.end()
        }
    }
}

initDB()
