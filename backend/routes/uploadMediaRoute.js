const express = require("express");
const router = express.Router();
const { uploadMedia, getMedia, updateMedia, deleteMedia, uploadFile } = require("../controller/uploadMediaController");

// Route for uploading media metadata
router.post("/upload", uploadMedia);

// Route for uploading actual files
router.post("/upload-file", uploadFile);

// Routes for getting media
router.get("/media", getMedia);
router.get("/published-media", (req, res) => {
  req.query.publishedOnly = 'true';
  getMedia(req, res);
});

// Routes for updating and deleting media
router.put("/update", updateMedia);
router.delete("/delete", deleteMedia);

module.exports = router;
