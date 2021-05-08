// Entry point server.js
// Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
// Custom routes
const assetRoutes = require('./app/Routes/asset.routes');
const userRoutes = require('./app/Routes/user.routes');

// Helpers
const { connectDB } = require("./app/config/db");

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
    //Setting routes to the express server
    assetRoutes(app);
    userRoutes(app);
    const serverPort = process.env.PORT | 4000;
    //connecting the server
    app.listen(serverPort, console.log(`[+] Server listens on port ${serverPort}`.green));
})();