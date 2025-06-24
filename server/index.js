import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import categoryRoutes from './routes/category.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import connectDB from './db/connectDB.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
 
//STORAGE ENGIN
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  limits:  { fileSize: 2 * 1024 * 1024 }, // 2mb
  filename: (req, file, cb) => { cb(null, `${file.originalname}`); },
});

const upload = multer({ storage });

app.post(`/api/upload`, upload.single('file'), (req, res) => {
  if(!req.file){
    return res.status(400).json({error: 'No file uploaded'});
  }
  return res.json({message: 'File was uploaded', path: req.file.path});
});

// HANDLE ERROR
app.use((err, req, res, next) => {
  if(err.code === 'LIMIT_FILE_SIZE'){
    return res.status(413).json({ 
      success: false, message: "File too large, Max size set at 2mb"
     });
  }

  next(err);
});

//SERVE UPLOAD FOLDER
app.use(`/uploads`, express.static(path.join(__dirname, 'uploads')));

__dirname = path.resolve();


const port = process.env.PORT || 6000;
app.listen(port, () => {
    connectDB();
    console.log(`Server running on port http://localhost:${port}`);
  })