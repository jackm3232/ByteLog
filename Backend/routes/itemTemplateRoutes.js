const express = require("express");
const router = express.Router();
const itemTemplatesController = require("../controllers/itemTemplatesController");

router.route("/")
  .get(itemTemplatesController.getAllItemTemplates)
  .post(itemTemplatesController.createItemTemplate)
  .patch(itemTemplatesController.updateItemTemplate)
  .delete(itemTemplatesController.deleteItemTemplate);

module.exports = router;
