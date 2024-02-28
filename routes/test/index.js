const express = require('express')
const router = express.Router();

const {KEK} = require("@VanillaCX/Identity");
const {Query} = require("@VanillaCX/Query");
const {StoreCX} = require("@VanillaCX/Store");
const query = new Query({
    database: process.env.TEST_DATABASE,
    collection: process.env.TEST_COLLECTION
});



router.use((req, res, next) => {
    console.log(`Test Request at :${Date.now()}`)
   
    next()
})

router.get("/cosmos-connection", async (req, res) => {
    console.log("Test Cosmos Connection...");

    try {
        const time = Date.now();
        const document = {time: time, test: "Lee"};
        const result = await query.insertOne(document)
        console.log("insertOne result:", result);

        res.send(document)
    
    } catch(error){
        console.log("insertOne error", error);
        res.send(error)
    }
})

router.get("/key-vault", async (req, res) => {
    try {
        const plaintext = "Please encrypt this";
        const {keyEncryptionKey, keyEncryptionKeyName} = await KEK.generateKey();

        // Encrypt DEK with KEK
        const encryptedText = await KEK.encrypt({
            key: keyEncryptionKey,
            plaintext: plaintext
        });
        console.log("/encrypt");
        res.send(`Ecnrypted ${plaintext} result is: ${encryptedText}`)
    } catch(error) {
            console.log(error);
            res.send(error)
        }
})

router.get("/store", async (req, res) => {
    try {
        // Create a session store and save users data
        const testStoreVar = new StoreCX(req, "testStore");
        await testStoreVar.set("test", `Test at ${Date.now()}`);

        const test = testStoreVar.get("test");


        res.send(`Set and retrieved "test" from testStore : ${test}`)
    } catch(error) {
            console.log(error);
            res.send(error)
        }
})

module.exports = router
