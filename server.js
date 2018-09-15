require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const sharp = require('sharp');

const PORT = process.env.PORT || 8080;
const app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/images/:size/:file', async (req, res) => {
  const { size, file } = req.params;
  console.log(`Resising ${file} to be (${size})`);
  const filePath = path.join(__dirname, 'public', 'images', size, file);

  // check if size already written to disk
  if (!fs.existsSync(filePath)) {  
    const origFilePath = path.join(__dirname, 'public', 'images', file);
    if (!fs.existsSync(origFilePath)) {
      return res.status(404);
    }
    try {
      fs.mkdirSync(path.join(__dirname, 'public', 'images', size));
    } catch(err) {}
    await sharp(fs.readFileSync(origFilePath))
      .resize(+size, +size)
      .min()
      .toFile(filePath);
  }

  return res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});