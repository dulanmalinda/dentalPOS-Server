const express = require("express")
const cors = require("cors")
const mongooseMorgan = require("mongoose-morgan")
const db = require("./Models")
const app = express()
app.use(cors())
app.use(express.json())

app.use(mongooseMorgan({
    connectionString: db.url,
}))

const Role = require("./Models/role.model")

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database Sucessfully!")
        initial()
    })
    .catch((err) => {
        console.log("Cannot connect to the database!", err)
        process.exit()
    })


function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "frontdesk"
            }).save((err) => {
                if (err) {
                    console.log("error", err)
                }

                console.log("added 'cashier' to roles collection")
            })

            new Role({
                name: "doctor"
            }).save((err) => {
                if (err) {
                    console.log("error", err)
                }

                console.log("added 'doctor' to roles collection")
            })

            new Role({
                name: "admin"
            }).save((err) => {
                if (err) {
                    console.log("error", err)
                }

                console.log("added 'admin' to roles collection")
            })

        }
    })
}

require("./Routes/auth.route")(app)
require("./Routes/user.route")(app)
//require("./Routes/patient.route")(app)
require("./Routes/appointment.route")(app)


app.get("/", (req, res) => {
    res.json("Welcome to DentalPOS")
})
const PORT = process.env.PORT || 8096
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})