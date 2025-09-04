// config/multerS3.js
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
require("dotenv").config();
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// AWS S3 config
// config/s3Client.js
const { S3Client } = require("@aws-sdk/client-s3");


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;

const fileFilter = (req, file, cb) => {
  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP allowed."));
  }

  // Multer itself doesn't give size here, so we validate after upload in limits
  cb(null, true);
};

// Multer S3 setup
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read", // file will be publicly accessible
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // unique file name: userId/timestamp-originalname
      cb(null, `movies/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE }, // 2MB size limit
  fileFilter,
});

module.exports = upload;
