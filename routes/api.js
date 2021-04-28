const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("instructions will be here");
});

router.get("/picture", (req, res) => {
  res.send(`your quere was:  ${JSON.stringify(req.query)}  `);
});

module.exports = router;
