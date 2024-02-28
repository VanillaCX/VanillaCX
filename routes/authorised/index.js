const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    console.log(`Public Access Request at :${Date.now()}`)
   
    next()
})

router.get("/", (req, res) => {
    res.render("authenticated_homepage");
})

module.exports = router
