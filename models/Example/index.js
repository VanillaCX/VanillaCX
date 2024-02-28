const {Schema, ShortText, LongText} = require("@VanillaCX/Schema");

const Example = new Schema({
    name: {type:ShortText, required: true},
    description: {type:LongText, required: true}
})

module.exports = {Example}