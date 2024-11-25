const express = require("express");
const router = express.Router();
const dailyLogsController = require("../controllers/dailyLogsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/")
  .get(dailyLogsController.getAllDailyLogs)
  .patch(dailyLogsController.createOrUpdateDailyLog)
  .delete(dailyLogsController.deleteDailyLog);

module.exports = router;
