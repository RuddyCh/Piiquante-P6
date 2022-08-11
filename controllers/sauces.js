const { Console } = require("console");
const Product = require("../models/sauces.js")
const unlink = require("fs").promises.unlink;

function getSauces(req, res) {
    Product.find({})
    .then(products => res.send(products))
    .catch(error => res.status(500).send(error))
}

function getSauceId(req, res) {
    const id = req.params.id
    Product.findById(id)
    .then(product => res.send(product))
    .catch(error => res.status(500).send(error))
}

function deleteSauceId(req, res) {
    const {id} = req.params

    Product.findByIdAndDelete(id)
    .then(deleteImage)
    .then(product => res.send({ message: "product deleted", product }))
    .catch(err => res.status(500).send({message: "error", error: err}))
}

function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/images/")[1]
    return unlink(`images/${fileToDelete}`)
    .then(() => product)
}

function modifySauceId(req, res) {
    const { 
        params: { id } 
    } = req

    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)

    Product.findByIdAndUpdate(id, payload)
    .then(deleteImage)
    .then(product => {
        if (product != null) {
            res.status(200).send({message: "product updated"}) 
        }
        else {
            res.status(404).send({message: "product not found"})
        }
    })
    .catch(err => console.error("product not updated, error:", err))
}

function makePayload(hasNewImage, req) {
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    return payload
}

function createSauces(req, res) {
    const {body, file} = req
    const sauce = JSON.parse(body.sauce)
    const { userId, name, manufacturer, description, mainPepper, heat} = sauce
    
    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: req.protocol + "://" + req.get("host") + "/images/" + file.filename,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
        .save()
        .then((message) => {
            res.status(201).send({message: message})
            return console.log("product saved", message);
        })
        .catch(console.error)
}

function likeSauce(req, res) {
    const { like, userId } = req.body
    const sauceId = req.params.id

    switch (like) {
        case 1:
            Product.updateOne({_id: sauceId}, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).send({message: "product liked"}))
            .catch(err => res.status(400).send({ error }))

            break;
        
        case 0:
            Product.findOne({_id: sauceId})
            .then((product) => {
                if (product.usersLiked.includes(userId)) {
                    Product.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                    .then(() => res.status(200).send({message: "return null"}))
                    .catch(err => res.status(400).send({ error }))
                }
                if (product.usersDisliked.includes(userId)) {
                    Product.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                    .then(() => res.status(200).send({message: "Return null"}))
                    .catch(err => res.status(400).send({ error }))
                }
            })
            .catch(err => res.status(404).send({ error }))

            break;

        case -1:
            Product.updateOne({_id: sauceId}, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => res.status(200).send({message: "product disliked"}))
            .catch(err => res.status(400).send({ error }))

            break;

        default: return res.status(400).send({message: "Bad request"})
    } 
}

module.exports = { createSauces, getSauces, getSauceId, deleteSauceId, modifySauceId, likeSauce }