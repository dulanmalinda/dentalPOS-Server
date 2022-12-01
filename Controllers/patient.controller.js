const db = require("../Models")
const Patient = db.patient
const axios = require('axios')


const dbLinks = require("../config/db.config")
const { patient } = require("../Models")

exports.create = (req, res) => {
    const patient = new Patient({
        patName: req.body.patName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        dob: req.body.dob,
        treatment: req.body.treatment,
        plateNumber: req.body.plateNumber,
        socialHistory: req.body.socialHistory,
        fee: req.body.fee,
        _active: true

    })
    patient
        .save(patient)
        .then(itemData => {

            Branch.find()
                .then(data => {
                    data.forEach(branch => {
                        console.log(itemData.itemId)
                        const stock = new Stock({
                            branchCode: branch.branchCode,
                            itemId: itemData.id,
                            cost: itemData.cost,
                            name: itemData.name,
                            brandName: itemData.brandName,
                            price: itemData.price,
                            disValue: itemData.disValue,
                            available: true,
                            currentStock: 0,
                            stockVal: 0
                        })
                        stock
                            .save(stock)
                            .then(data => {

                                console.log(data)
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while creating the stock."
                                })
                            })

                        console.log(branch.branchCode)
                    })
                    res.send(data)
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Branch."
                    })
                })
            res.send(itemData)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Item."
            })
        })
}

exports.findByCategory = (req, res) => {
    var condition = req.params.cat ? {
        catName: req.params.cat,
        _active: true
    } : {}

    Item.find(condition)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}


exports.findByBrand = (req, res) => {
    var condition = req.params.br ? {
        brandName: req.params.br,
        _active: true
    } : {}

    Item.find(condition)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}


exports.findByName = (req, res) => {

    const sfNameLast = req.params.name.replace(/[^\w\s+]/gi, '')
    const sfName = sfNameLast.replace(/\s/g, "")

    var condition = sfName ? {
        sfName: { $regex: new RegExp(sfName), $options: "ix" },
        _active: true
    } : {}


    Item.find(condition)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}


exports.findAll = (req, res) => {
    Item.find()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}

exports.PatientnameFromId = (req, res) => {
    const patId = req.params.patId

    Patient.find({ _id: patId })
        .then(data => {
            let patient = {
                patName: data[0].patName,
            };
            res.send(patient)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving patients."
            })
        })
}

exports.findAllActive = (req, res) => {
    Patient.find({ _active: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Items.",
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.iId;

    Item.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            Item.findOneAndUpdate({ _id: id }, { $set: req.body })
                .then(data => {

                    if (data) {
                        res.send(true);

                    } else res.status(404).send({
                        message: `Cannot update item with sfName`,
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error updating item with sfNamef"
                    })
                })

            if (data) {
                res.send(true);

            } else res.status(404).send({
                message: `Cannot update Item with id=${id}. Maybe Item was not found!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Item with id=" + id
            })
        })
    Stock.updateMany({
            itemId: id,
        }, { $set: req.body })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update stock from  =${branchCode}.`
                })
            }
        })

    .catch(() => {})
}

exports.updatePriceById = (req, res) => {
    const id = req.params.iId
    const price = req.params.price

    Item.findOneAndUpdate({ _id: id }, { $set: { price: price } })
        .then(data => {

            if (data) {
                res.send(true);

            } else res.status(404).send({
                message: `Cannot update item with price=${price}. Maybe item was not found!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating item with price=" + price
            })
        })
}

exports.DeleteFromItemId = (req, res) => {
    const Id = req.params.iId

    Item.findByIdAndUpdate({ _id: Id }, { $set: { _active: false } })
        .then(data => {

            if (data) {
                res.send(true)

            } else res.status(404).send({
                message: `Cannot delete item with id=${Id}. Maybe item was not found!`
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err
            })
        })

    Stock.updateMany({
            itemId: Id,
        }, { $set: { available: false } })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete stock from  =${branchCode}.`
                })
            }
        })

    .catch(() => {})
}

exports.findTopItems = (req, res) => {

    const skiplt = parseInt(req.params.skip)
    const skip = (skiplt - 1) * 100
    Item.find({ _active: true }).sort({ price: -1 }).skip(skip).limit(100)
        .then(data => {
            Item.countDocuments({ _active: true }).exec().then(count => {
                const initItems = {
                    items: data,
                    count: count
                }
                res.send(initItems)
            })

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Item."
            });
        });
};


exports.findBySubcategory = (req, res) => {
    let itemDt = []

    Category.find({
            subCategory: req.params.subCategory,
            _active: true
        })
        .then((data) => {

            data.forEach(itemEntry => {
                if (!itemEntry.catName || itemEntry.catName === null) return
                var condition = itemEntry.catName ? {
                    catName: itemEntry.catName,
                    _active: true
                } : {}

                Item.find(condition)
                    .then((data) => {
                        if (!data[0] || data === null) return
                        itemDt = data

                        // return itemDt
                        console.log(data)

                        res.send(data)
                    }).catch(() => {})

            })

        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving subCategory.",
            });
        });
}


checkCatNameExisted = (req, res, next) => {

    Item.findOne({
        name: req.body.name,
        catName: req.body.catName
    }).exec((err, item) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (item) {
            res.status(400).send({ message: "Duplicate Entry !. Item already exists" });
            return;
        }

        next()

    })
}

exports.findByCatAndName = (req, res) => {

    const catName = req.params.cName
    const sfNameLast = req.params.cName.replace(/[^\w\s+]/gi, '')
    const sfName = sfNameLast.replace(/\s/g, "")

    const sfbrandar = req.params.cName
    sfcat = sfbrandar.split(' ')

    Item.find({
            $or: [
                { catName: { $regex: new RegExp(catName), $options: "i" } },
                { sfName: { $regex: new RegExp(sfName), $options: "ix" } },

                {
                    catName: sfcat[0],
                    sfName: { $regex: new RegExp(sfcat[1]), $options: "ix" },
                }

            ],

            _active: true
        })
        .then((data) => {
            res.send(data)

        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}