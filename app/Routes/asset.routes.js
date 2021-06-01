const express = require('express');


// Importing middlewares
const validateID = require('./Middlewares/ValidateID');
const validateAssets = require('./Middlewares/validateAssets');
const authenticate = require('./Middlewares/authenticate');

// Importing controllers
const { scan, recapAboutUserScans, getAllUserScans } = require('../Controllers/Asset.controller');


module.exports = function routes(app) {
    const router = express.Router();

    router.post('/scan', validateAssets(), authenticate(), scan)

    router.get('/get-all-user-scans', authenticate(), getAllUserScans);

    router.get('/recap-user-scans', authenticate(), recapAboutUserScans);
    
    app.use('/api/asset', router);
}