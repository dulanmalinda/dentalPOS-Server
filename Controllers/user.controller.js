const { user } = require("../Models")
const User = require("../Models/user.model")
const roles = require("../Models/role.model")
var bcrypt = require("bcryptjs")

exports.allAccess = (req, res) => {


    User.find()
        .populate('roles')
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            })
        })
}

exports.adminBoard = (req, res) => {
    res.status(200).send("admin Content.")
}
exports.cashierBoard = (req, res) => {
    res.status(200).send("cashier Content.")
}

exports.DeleteFromUser = (req, res) => {
    const username = req.params.username

    User.findOneAndUpdate({ username: username }, { $set: { _active: false } })
        .then(data => {

            if (!data) {
                res.status(404).send({
                    message: `Cannot change user as inactive=${username}.`,
                })
            } else res.send(true)
        })
        .catch((err) => {
            res.status(500).send({
                message: err,
            })
        })
}


exports.updatePasswordByUserName = (req, res) => {
    const username = req.params.username
    const password = req.params.password

    User.findOneAndUpdate({ username: username }, { $set: { password: bcrypt.hashSync(password, 8) } })
        .then(data => {

            if (!data) {
                res.status(404).send({
                    message: `Cannot update password=${password}.`,
                })
            } else res.send(true)
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating password=" + password,
            })
        })
}
exports.updateByUsername = (req, res) => {
    const username = req.params.username


    User.findOneAndUpdate(username, req.body, { useFindAndModify: false })
        .then(data => {

            if (!data) {
                res.status(404).send({
                    message: `Cannot update user`,
                })
            } else res.send(true)
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating user ",
            })
        })
}




exports.findByusername = (req, res) => {
    const username = req.params.username
    console.log(req.query)
    var condition = username ? {
        username: username
    } : {}

    User.find(condition)
        .populate('roles')
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving User.",
            })
        })
}



exports.findAllActive = (req, res) => {
    User.find({ _active: true })
        .populate('roles')
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            })
        })
}