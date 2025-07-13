const express = require("express");
const router = express.Router();
const { uploadMedia, getMedia, updateMedia, deleteMedia, uploadFile } = require("../controller/uploadMediaController");

router.post("/upload", uploadMedia);
router.get("/media", getMedia);
router.get("/published-media", (req, res) => {
  req.query.publishedOnly = 'true';
  getMedia(req, res);
});
router.put("/update", updateMedia);
router.delete("/delete", deleteMedia);
router.post("/upload-file", uploadFile);

module.exports = router;
