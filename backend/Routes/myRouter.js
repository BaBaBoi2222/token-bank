const { signup, login, tokenAdd, tokenRemove, getTokens, tokenDelete } = require('../Controllers/authController');
const { signupValidation, loginValidation, addTValidation, removeTValidation } = require('../Middlewares/authValidation');
const { ensureAuthenticated } = require('../Middlewares/auth')
const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/addT', addTValidation, tokenAdd)
router.post('/remT', removeTValidation, tokenRemove)
router.get('/getT',ensureAuthenticated, getTokens)
router.delete('/deleteT/:email/:tName', ensureAuthenticated, tokenDelete);

module.exports = router;