const express = require("express");
const { getSauces, createSauces, getSauceId, deleteSauceId, modifySauceId, likeSauce } = require("../controllers/sauces");
const {anthenticateUser} = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./images/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

const productsRouter = express.Router();

productsRouter.get("/", anthenticateUser, getSauces);
productsRouter.post("/", anthenticateUser, upload.single("image"), createSauces);
productsRouter.get("/:id", anthenticateUser, getSauceId);
productsRouter.delete("/:id", anthenticateUser, deleteSauceId);
productsRouter.put("/:id", anthenticateUser, upload.single("image"), modifySauceId);
productsRouter.post("/:id/like", anthenticateUser, likeSauce);

module.exports = { productsRouter };