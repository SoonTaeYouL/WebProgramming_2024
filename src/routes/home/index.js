'use strict'

const express = require('express');
const ctrl = require("./home.ctrl");
const {
  isAuthenticated,
  isAlreadyAuthenticated,
} = require("../../utils/isAuthenticated");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

//이미지 디렉터리 설정
const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

//multer로 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Client routes
router.get("/", ctrl.output.home);
router.get("/login", isAlreadyAuthenticated, ctrl.output.login);
router.get("/calendar", isAuthenticated, ctrl.output.calendar);
router.get("/room", isAuthenticated, ctrl.output.room);

// Server api routes
router.post("/login", ctrl.process.login);
router.post("/calendar", isAuthenticated, ctrl.process.manage);
router.get("/lists", isAuthenticated, ctrl.process.read);
router.post("/lists", upload.single("image"), ctrl.process.write);
router.post("/delete", upload.single("image"), ctrl.process.delete);
router.post("/alldel", ctrl.process.alldelete);

// Image routes
router.get("/images/:imageName", function (req, res) {
  const { imgName } = req.params;
  res.sendFile("/public/image/" + imgName);
});

module.exports = router;