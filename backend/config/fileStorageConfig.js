import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// FILE STORAGE CONFIGURATIONS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        uuidv4() +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
export const upload = multer({ storage });
