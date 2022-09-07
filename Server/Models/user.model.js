const mongoose = require("mongoose")

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        name: String,
        phone: String,
        password: String,
        _active: Boolean,
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]

    })
)

module.exports = User