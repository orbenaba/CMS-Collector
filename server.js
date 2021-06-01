// Entry point server.js
// Node Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const colors = require("colors");
const { json, urlencoded } = require('body-parser');
// Custom routes
const assetRoutes = require('./app/Routes/asset.routes');
const userRoutes = require('./app/Routes/user.routes');
const path = require('path');

// Helpers
const { connectDB } = require("./config/db");

(async () => {
    // mongo
    await connectDB();
    //express config
    var corsOptions = {
        origin: "http://localhost:3000",
        credentials: true // Allow localhost:3000 to access the cookies
    };
    const app = express();
    app.use(cors(corsOptions));
    //parse requests of content type - application/json
    app.use(json());
    //parse
    app.use(urlencoded({ extended: true }));
    // Cookies for json web tokens
    app.use(cookieParser());

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, 'client/build')));


    //Setting routes to the express server
    assetRoutes(app);
    userRoutes(app);

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    });


    // heroku is filling the PORT by itself
    const serverPort = process.env.PORT || 4000;
    //connecting the server
    app.listen(serverPort, console.log(`[+] Server listens on port ${serverPort}`.green));
})();