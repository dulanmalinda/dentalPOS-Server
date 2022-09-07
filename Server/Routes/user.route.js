const { authJwt } = require("../Middlewares")
const controller = require("../Controllers/user.controller")
var router = require("express").Router()

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.get("/api/user/all", controller.allAccess)


    app.get(
        "/api/user/admin", [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    )
    app.get(
        "/api/user/cashier", [authJwt.verifyToken, authJwt.isCashier],
        controller.cashierBoard
    )

    router.delete("/:username", controller.DeleteFromUser)

    router.put("/:username/:password", controller.updatePasswordByUserName)

    router.put("/:username", controller.updateByUsername)

    router.get("/", controller.findAllActive)

    router.get("/username/:username", controller.findByusername)

    app.use("/api/user", router)
}