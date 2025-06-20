const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const uploadDir = path.join(__dirname, 'upload_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload_images/');
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'clickfit_website.html'));
});


app.post('/upload', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: file.path
        }));

        console.log(`Successfully uploaded ${uploadedFiles.length} files:`);
        uploadedFiles.forEach(file => {
            console.log(`- ${file.originalName} -> ${file.filename}`);
        });

        res.json({
            success: true,
            message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
            files: uploadedFiles
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});


app.get('/images', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        });

        const images = imageFiles.map(file => ({
            filename: file,
            url: `/uploaded-images/${file}`,
            uploadTime: fs.statSync(path.join(uploadDir, file)).mtime
        }));

        res.json({
            success: true,
            images: images
        });

    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve images',
            error: error.message
        });
    }
});


app.use('/uploaded-images', express.static(uploadDir));


app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


app.listen(PORT, () => {
    console.log(`Click Fit server running on port ${PORT}`);
    console.log(`Upload directory: ${uploadDir}`);
    console.log(`Access the website at: http://localhost:${PORT}`);
});

module.exports = app;