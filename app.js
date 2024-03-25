const express = require('express')
const path = require('path');

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.originalname.split('.')[1]
    cb(null, file.fieldname + '-' + uniqueSuffix + "." + ext)
  }
})

const upload = multer({ storage: storage })

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '/dist')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

app.post("/admin/image", upload.single('file'), (req, res) => {
  res.json({success: true});
})