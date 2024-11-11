const fs = require("fs");

const deleteFiles = (files) => {
  if (files) {
    files.forEach((file) => {
      fs.unlinkSync(file);
    });
  }
};
const deleteFile = (file) => {
  if (file && fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

module.exports = { deleteFile, deleteFiles };
