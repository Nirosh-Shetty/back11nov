const express = require("express");
const router = express.Router();
const MyPlanController = require("../../Controller/User/MyPlanController");

router.post("/add-to-plan", MyPlanController.addToPlan);

router.get("/get-plan/:userId", MyPlanController.getMyPlan);

module.exports = router;