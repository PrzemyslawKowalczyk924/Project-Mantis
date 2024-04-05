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

const upload = multer({ storage: storage });


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.post("/admin/image", upload.single('file'), (req, res) => {
  res.json({success: true});
});

app.get('/image', (req, res) => {
  const imageFolder = './public/uploads';
  const fs = require('fs');
  
  const files = fs.readdirSync(imageFolder);
  res.json(files);
});

app.post("/admin/login", upload.none(), (req, res) => {
  console.log('req body!', req.body);
  
  const login = req.body.login;
  const password = req.body.password;

  if (login === "Mantis" && password === "mantismantis") {
    res.json({success: true});
  } else {
    res.status(401).json({success: false});
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});