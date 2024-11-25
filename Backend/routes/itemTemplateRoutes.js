const express = require("express");
const router = express.Router();
const itemTemplatesController = require("../controllers/itemTemplatesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/:user")
  .get(itemTemplatesController.getAllItemTemplates);

router.route("/")
  .post(itemTemplatesController.createItemTemplate)
  .patch(itemTemplatesController.updateItemTemplate)
  .delete(itemTemplatesController.deleteItemTemplate);

module.exports = router;
