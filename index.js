require('dotenv').config();

const {StoreCX} = require("@VanillaCX/Store");
const {ResourceError} = require("@VanillaCX/Errors");
const express = require("express");
const helmet = require("helmet");

// Entry point routes
const publicRoute = require("./routes/public");
const authorisedRoute = require("./routes/authorised");
const testRoute = require("./routes/test");

// Set port the app listens to
const port = process.env.PORT || 3030;

// Create app
const app = express();

// Set Helmet usage for security
app.use(helmet());

// Remove fingerprinting of the Server Software
app.disable('x-powered-by');

// Set EJS as templating engine  
app.set('view engine', 'ejs');  

// Enables static access to filesystem
app.use('/public', express.static('public'));

// Mongo DB Session Storage
app.use(StoreCX.session)

// Middleware for all requests
app.use((req, res, next) => {
    console.log(`Request at ${Date.now()}`);

    next();
})

// Setup entry point routing
app.use("/private", authorisedRoute)
app.use("/", publicRoute)
app.use("/test", testRoute)



// Fallback for un-matched requests
app.use((req, res) => {
    const resourceErr = new ResourceError(req.originalUrl, 404);
    console.error(resourceErr)

    res.status(resourceErr.status.code)
       .render("errors/resource", {resourceErr})
})

app.listen(port, () => console.log(`Server listening on port: ${port}`));