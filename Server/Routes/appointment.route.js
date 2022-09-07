module.exports = (app) => {
    const appointment = require("../Controllers/appointment.controller")

    var router = require("express").Router()

    router.post("/",appointment.create)

    router.delete("/:aId", appointment.DeleteFromAppointmentId)

    router.put("/:aId", appointment.update)

    router.get("/", appointment.findAllActive)

    router.get("/all", appointment.findAll)

    router.get("/namebyid/:aId", appointment.AppointmentFromId)

    router.get("/name/:patName", appointment.findByName)

    router.get("/appbydate/:dateTimeBefore/:dateTimeAfter",appointment.SearchAppWithDate)

    router.put("/updateattend/:aId/:amount",appointment.updateTheAttendedStatus)

    router.get("/allattended",appointment.findAllAttended)

   // router.put("/:iId/:amount", appointment.updateAmountById)
   router.get("/revenue/:startDate/:endDate", appointment.appointmentRevenue)

    app.use("/api/appointment", router)
};