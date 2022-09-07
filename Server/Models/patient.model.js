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
        patId: Number,
        address: String,
        phoneNumber: String,
        dob: Date,
        treatment: String,
        plateNumber: Number,
        socialHistory: String,
        fee: Number,
        _active: Boolean
    })

    schema.plugin(autoIncrement.plugin, {
        model: 'Patient',
        field: 'patId',
        startAt: 10000,
        incrementBy: 1
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.iId = _id
        return object
    })

    const Patient = mongoose.model("Patient", schema, "Patient")
    return Patient
}