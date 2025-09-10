const express = require("express");
const router = express.Router();
const { read, list, create, detail, update, remove } = require("../controller/novel");

// หน้าเว็บหลัก
router.get("/", read);

// RESTful API
router.get("/list", list);
router.post("/create", create);
router.get("/:id", detail);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
