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
  res.json({fileName: req.file.filename, description: req.body.description});
});

app.delete("/admin/image/:fileName", (req, res) => {
  const fs = require('fs');
  const path = require('path');

  function deleteFile(fileName) {
    const filePath = path.join(__dirname, '/public/uploads', fileName);
    try {
      // Usunięcie pliku
      fs.unlinkSync(filePath);
      console.log(`Plik ${fileName} został pomyślnie usunięty.`);
      return true; // Zwróć true, jeśli plik został pomyślnie usunięty
    } catch (error) {
      console.error(`Błąd podczas usuwania pliku ${fileName}:`, error);
      return false; // Zwróć false, jeśli wystąpił błąd podczas usuwania pliku
    }
  }

  const fileName = req.params.fileName;
  const deleted = deleteFile(fileName);
  res.json({ message: `Plik ${deleted} został pomyślnie usunięty.` });
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

/* app.get("/admin/imagesList", (req, res) => {
  imageFolder
}); */

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});