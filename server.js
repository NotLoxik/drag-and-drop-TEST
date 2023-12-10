const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const uploadedFiles = {}; // Keep track of uploaded files and their URLs

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;

    if (uploadedFile.size > 10 * 1024 * 1024 * 1024) { // Set maximum file size to 10GB
        return res.status(400).send('File size exceeds the maximum allowed size.');
    }

    const fileId = Date.now().toString(); // Generate a unique ID
    const url = `download/${fileId}`; // Generate download URL

    uploadedFile.mv(path.join(__dirname, 'uploads', fileId), (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        uploadedFiles[fileId] = uploadedFile.name; // Store the file info

        // Send back the URL to the uploader
        res.status(200).send(`File uploaded successfully. Your download link: http://localhost:${PORT}/${url}`);
    });
});

app.get('/download/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filename = uploadedFiles[fileId];

    if (!filename) {
        return res.redirect('/not-found.html');
    }

    const filePath = path.join(__dirname, 'uploads', fileId);

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            return res.redirect('/not-found.html');
        }

        res.download(filePath, filename);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
