module.exports = (mongoose) => {

    autoIncrement = require('mongoose-auto-increment')
    const dbLinks = require("../config/db.config.js")
    var connection = mongoose.createConnection(dbLinks.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    autoIncrement.initialize(connection)

    var schema = mongoose.Schema({

        patName: String,
        phoneNumber: String,
        appId : Number,
        date: Date,
        doctor :["Doc 1", "Doc 2", "Doc 3"],
        nic : String,
        address : String,
        treatment : String,
        amount : Number,
        attended: Boolean,
        _active: Boolean
    })

    schema.plugin(autoIncrement.plugin, {
        model: 'Appointment',
        field: 'appId',
        startAt: 10000,
        incrementBy: 1
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.aId = _id
        return object
    })

    const Appointment = mongoose.model("Appointment", schema, "Appointment")
    return Appointment
}