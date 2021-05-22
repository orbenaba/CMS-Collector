const express = require('express');


const validateUser = require('./Middlewares/validateUser');
const authenticate = require('./Middlewares/authenticate');
const noDup = require('./Middlewares/validateNoDup');
const { validateEmailToken } = require('./Middlewares/validateEmailToken');

const { signup, deleteUser, login, logout, changeDetails, forgotPassword, resetPassword } = require('../Controllers/user.controllers');
const { Success } = require('../Helpers/generals.helpers');


module.exports = function routes(app) {
    const router = express.Router();

    router.post('/register', validateUser(), signup);

    // If the token is sent and verified within the request to the route, then
    // we will escape over the validateUser middleWare (which verifies password & username)
    router.post('/login', authenticate(), login);// validateUser(true),

    router.delete('/delete', authenticate(true), deleteUser);

    // A route to check if the user cookies are authenticated
    router.post('/is-authenticated', authenticate(true), (req, res) => {
        if(!res.locals.unauthorizedWithResponse){
            // The response was not sent
            const {username, email, accessToken, refreshToken, _id, createdAt} = req.user;
            console.log(" req.user - ",  req.user)
            return Success(res, { user: {username, email, accessToken, refreshToken, _id, createdAt } });
        }
    });

    router.post('/logout', authenticate(true), logout);

    router.post('/change-details', authenticate(true), noDup(), changeDetails);

    router.post('/forgot-password', forgotPassword);

    router.post('/validate-change-password', validateEmailToken, (req, res) => res.sendStatus(200));

    router.post('/reset-password', validateEmailToken, resetPassword)
    app.use('/api/user', router);

    app.post('*', (req, res) => res.status(404).send({ notFound: 'Status code 404' }));
    app.get('*', (req, res) => res.status(404).send({ notFound: 'Status code 404' }));
    app.delete('*', (req, res) => res.status(404).send({ notFound: 'Status code 404' }));
    app.patch('*', (req, res) => res.status(404).send({ notFound: 'Status code 404' }));
    app.head('*', (req, res) => res.status(404).send({ notFound: 'Status code 404' }));
}