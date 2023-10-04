'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function findUserById(userId) {
    const pool = await getPool()
    const sql = 'SELECT * FROM users WHERE idUser = ?'
    const [user] = await pool.query(sql, userId)
    return user[0]
}

async function findAllUser() {
    const pool = await getPool()
    const sql =
        'SELECT idUser as id,  nameUser, email, phone, createdAt FROM users'
    const [user] = await pool.query(sql)
    return user
}
async function findAllUserPublic() {
    const pool = await getPool()
    const sql = 'SELECT idUser,  nameUser, image, isOnline FROM users'
    const [user] = await pool.query(sql)
    return user
}

async function createUser(user) {
    const pool = await getPool()
    const sql = `
    INSERT INTO users(
      nameUser, email, password, image,
      createdAt, verificationCode, role, phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
    const { nameUser, email, passwordHash, image, verificationCode, phone } =
        user
    const now = new Date()
    const [created] = await pool.query(sql, [
        nameUser,
        email,
        passwordHash,
        image,
        now,
        verificationCode,
        'user',
        phone,
    ])

    return created.insertId
}

const createUserByAdmin = async user => {
    const pool = await getPool()
    const sql = `
    INSERT INTO users(
        nameUser, phone
    ) VALUES (?, ?)
    `
    const { nameUser, phone } = user
    const [created] = await pool.query(sql, [nameUser, phone])

    return created.insertId
}

async function findUserByEmail(email) {
    const pool = await getPool()
    const sql =
        'SELECT idUser, nameUser, email, role, password, verifiedAt, verificationCode, isBanned, pushToken FROM users WHERE email = ?'
    const [user] = await pool.query(sql, email)

    return user[0]
}

async function activateUser(verificationCode) {
    const now = new Date()
    const pool = await getPool()
    const sql = `
  UPDATE users
  SET verifiedAt = ?
  WHERE verificationCode = ?
  AND verifiedAt IS NULL
  `

    const [result] = await pool.query(sql, [now, verificationCode])

    return result.affectedRows === 1
}

async function getUserByVerificationCode(code) {
    const pool = await getPool()
    const sql = `
  SELECT nameUser, email, image, phone, createdAt, idUser FROM users
  WHERE verificationCode = ?    
  `
    const [user] = await pool.query(sql, code)
    return user[0]
}

async function udpateUserById(data) {
    const { idUser, nameUser, email, phone } = data
    const pool = await getPool()
    const sql = `
    UPDATE users
    SET nameUser = ?, email = ?, phone = ?
    WHERE idUser = ?
  `
    await pool.query(sql, [nameUser, email, phone, idUser])

    return true
}

async function addVerificationCode(idUser, code) {
    const now = new Date()
    const pool = await getPool()
    const sql = `
    UPDATE users SET verificationCode = ?,
    updatedAt = ?,
    verifiedAt = NULL
    WHERE idUser = ?
  `
    const [created] = await pool.query(sql, [code, now, idUser])

    return created.insertId
}

async function findUserProfileImage(idUser) {
    const pool = await getPool()
    const sql = 'SELECT image FROM users WHERE idUser = ?'
    const [user] = await pool.query(sql, idUser)

    return user[0]
}

async function uploadUserProfileImage(idUser, image) {
    const pool = await getPool()
    const sql = 'UPDATE users SET image = ? WHERE idUser = ?'
    await pool.query(sql, [image, idUser])

    return true
}

async function removeUserById(id) {
    const pool = await getPool()
    const sql = 'DELETE FROM users WHERE idUser = ?'
    await pool.query(sql, id)

    return true
}

async function findFavoritesByUserId(idUser) {
    const pool = await getPool()
    const sql =
        'SELECT * FROM products INNER JOIN favorites ON products.idProduct = favorites.idProduct WHERE favorites.idUser = ?;'
    const [favorites] = await pool.query(sql, idUser)

    return favorites
}

async function blockUserById(id) {
    const pool = await getPool()
    const sql = `UPDATE arcade.users SET isBanned = '1' WHERE (idUser = ?);`
    await pool.query(sql, id)

    return true
}

async function desBlockUserById(id) {
    const pool = await getPool()
    const sql = `UPDATE arcade.users SET isBanned = '0' WHERE (idUser = ?);`
    await pool.query(sql, id)

    return true
}

async function udpatePassworByNameUser(nameUser, password) {
    const pool = await getPool()
    const sql = `
    UPDATE users
    SET password = ?
    WHERE nameUser = ?
  `
    await pool.query(sql, [password, nameUser])

    return true
}

async function updatePasswordByIdUser(idUser, password) {
    const pool = await getPool()
    const sql = `
      UPDATE users
      SET password = ?
      WHERE idUser = ?
    `
    const response = await pool.query(sql, [password, idUser])

    console.log(response)

    return true
}

async function updateUserLoginById(id) {
    const pool = await getPool()
    const sql = `UPDATE users SET isOnline = '1' WHERE (idUser = ?);`
    await pool.query(sql, id)

    return true
}

async function updateUserLogoutById(id) {
    const pool = await getPool()
    const sql = `UPDATE users SET isOnline = '0' WHERE (idUser = ?);`
    await pool.query(sql, id)

    return true
}

async function updateLastLoginById(id) {
    const now = new Date()
    const pool = await getPool()
    const sql = `UPDATE users SET lastLogin = ?  WHERE (idUser = ?);`
    await pool.query(sql, [now, id])

    return true
}

async function updateUserVerificationCode(userId, verificationCode) {
    const pool = await getPool()
    const sql = `
    UPDATE users
    SET verificationCode = ?
    WHERE idUser = ?
    `
    await pool.query(sql, [verificationCode, userId])
    return true
}

//Actualizar expoPushToken de usuario por id de usuario
async function updateExpoPushTokenByIdUser(idUser, expoPushToken) {
    const pool = await getPool()
    const sql = `
    UPDATE users
    SET pushToken = ?
    WHERE idUser = ?
    `
    await pool.query(sql, [expoPushToken, idUser])
    return true
}

async function getAllExpoPushTokenAdmin() {
    const pool = await getPool()
    const sql = `
    SELECT pushToken FROM users
    WHERE role = 'admin'
    `
    const [expoPushToken] = await pool.query(sql)
    return expoPushToken
}

async function getExpoPushTokenByIdUser(idUser) {
    const pool = await getPool()
    const sql = `
    SELECT pushToken FROM users
    WHERE idUser = ?
    `
    const [expoPushToken] = await pool.query(sql, idUser)
    return expoPushToken
}

async function incrementAbsences(idUser) {
    const pool = await getPool()
    const sql = `
    UPDATE users
    SET absences = absences + 1
    WHERE idUser = ?
    `
    await pool.query(sql, idUser)
    return true
}

module.exports = {
    findUserById,
    createUser,
    findUserByEmail,
    activateUser,
    getUserByVerificationCode,
    udpateUserById,
    addVerificationCode,
    findUserProfileImage,
    uploadUserProfileImage,
    removeUserById,
    findFavoritesByUserId,
    findAllUser,
    blockUserById,
    desBlockUserById,
    udpatePassworByNameUser,
    updateUserLoginById,
    updateUserLogoutById,
    updateLastLoginById,
    findAllUserPublic,
    createUserByAdmin,
    updateUserVerificationCode,
    updatePasswordByIdUser,
    updateExpoPushTokenByIdUser,
    getAllExpoPushTokenAdmin,
    getExpoPushTokenByIdUser,
    incrementAbsences,
}
