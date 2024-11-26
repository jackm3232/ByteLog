const express = require("express");
const router = express.Router();
const dailyLogsController = require("../controllers/dailyLogsController");
const verifyJWT = require("../middleware/verifyJWT");

//router.use(verifyJWT);

router.route("/:user")
  .get(dailyLogsController.getAllDailyLogs)
  .post(dailyLogsController.createDailyLog)
  .patch(dailyLogsController.updateDailyLog)
  .delete(dailyLogsController.deleteDailyLog);

module.exports = router;
