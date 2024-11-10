const express = require("express");
const router = express.Router();
const dailyLogsController = require("../controllers/dailyLogsController");

router.route("/")
  .get(dailyLogsController.getAllDailyLogs)
  .patch(dailyLogsController.createOrUpdateDailyLog)
  .delete(dailyLogsController.deleteDailyLog);

module.exports = router;
