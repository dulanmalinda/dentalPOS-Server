const dbConfig = require("../config/db.config")

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url

db.role = require("./role.model")(mongoose)
//db.patient = require("./patient.model")(mongoose)
db.user = require("./user.model")(mongoose)
db.appointment = require("./appointment.model")(mongoose)

db.ROLES = ["frontdest", "admin", "doctor"];

module.exports = db