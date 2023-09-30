'use strict'

const express = require('express')
const validateUser = require('../controllers/users/activate-user-controller')
const banUserById = require('../controllers/users/ban-user-by-id-controller')
const deleteUserById = require('../controllers/users/delete-user-by-id-controller')
const getAllUser = require('../controllers/users/get-all-user-controller')
const getAllUserPublic = require('../controllers/users/get-all-user-public-controller')
const getUserById = require('../controllers/users/get-user-by-id-controller')
const getUserProfile = require('../controllers/users/get-user-profile-controller')
const loginUser = require('../controllers/users/login-user-controller')
const logoutUser = require('../controllers/users/logout-user-controller')
const registerUser = require('../controllers/users/register-user-controller')
const udpatePassword = require('../controllers/users/update-password-by-id-controller')
const updateUser = require('../controllers/users/update-user-controller')
const validateAuth = require('../middlewares/validate-auth')
const requestPasswordReset = require('../controllers/users/reset-password-controller')
const recoveryPasswordController = require('../controllers/users/recovery-password-controller')
const updateExpoPushToken = require('../controllers/users/update-expo-token-controller-by-user-id')
const updateUserUrlImage = require('../controllers/users/upload-user-image-url-controller')
const getUserInfoAdminById = require('../controllers/users/get-user-info-admin-controller')
const forgotPassword = require('../controllers/users/forgot-password-controller')
const udpatePasswordPublic = require('../controllers/users/update-password-public-controller')
const router = express.Router()

// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
// router.route('/').get(nombreFuncion);

router.route('/password/:code').put(udpatePassword)
router.route('/register').post(registerUser)
router.route('/activation').get(validateUser)
// router.route("/recovery-password").post(recoveryPassword);
router.route('/reset-password').post(requestPasswordReset)
router.route('/recovery-password').post(recoveryPasswordController)
router.route('/forgot-password').post(forgotPassword)
router.route('/update-password-public').post(udpatePasswordPublic)
router.route('/login').post(loginUser)
router.route('/user/:idUser').get(getUserById)
router.route('/public').get(getAllUserPublic)
router.route('/expo-push-token').put(updateExpoPushToken)
// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)
router.route('/').all(validateAuth).get(getAllUser).put(updateUser)
router.route('/userInfo/:idUser').all(validateAuth).get(getUserInfoAdminById)
router.route('/logout').all(validateAuth).get(logoutUser)
router.route('/upload').all(validateAuth).post(updateUserUrlImage)
router.route('/new-password/').all(validateAuth).put(udpatePassword)
router
    .route('/:userId')
    .all(validateAuth)
    .delete(deleteUserById)
    .put(banUserById)
router.route('/profile').all(validateAuth).get(getUserProfile)

module.exports = router
