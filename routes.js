const express = require('express')
const router = express.Router()

const userCtrl = require('./controllers/user');


// routes
router.post('/login', userCtrl.login );
router.post('/register', userCtrl.register );
router.post('/onboarding', userCtrl.onboarding );
router.post('/verify-register', userCtrl.verifyregisteration );
router.post('/verify-onboarding', userCtrl.verifyonboarding );
router.post('/forget-password', userCtrl.frgtPassword );
router.post('/recover-password', userCtrl.rcvrPassword );
router.post('/social', userCtrl.socialSign );


module.exports = router