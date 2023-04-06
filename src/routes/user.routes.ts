import express from "express";

const router = express.Router();

router.post("/api/uesrs", (req, res) => {
  return res.sendStatus(200);
});

export default router;
