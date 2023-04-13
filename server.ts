// Import necessary modules
import express from 'express';
import multer from 'multer';
import Debug from 'debug';
import Storages from './Storages';
import { getFileInfo, uploadFileToStorage, downloadFileFromStorage } from './fileFunctions';
import { upload, deleteFilesInDirectory, createUploadsFolder } from './createUploadsFolder';
import mime  from 'mime-types';

const app = express();
const debug = Debug('app');
const port: number = 1337;


// Create the uploads folder and delete any existing files
createUploadsFolder();
deleteFilesInDirectory();

// Create an array of storages 
let storages: Storages[] = [
    new Storages('media', 50 * 1024 * 1024, ['image/jpeg', 'image/png', 'video/mp4'], 5, []),
    new Storages('books', 10 * 1024 * 1024, ['application/pdf', 'text/plain'], 5, []),
    new Storages('executables', 100 * 1024 * 1024, ['application/x-msdownload','application/x-sh','application/x-executable', ], 5, []),
    new Storages('video', 30 * 1024 * 1024, ['video/mp4', 'video/avi', 'video/mpeg'], 5, []),
    new Storages('audio', 5 * 1024 * 1024, ['audio/mpeg', 'audio/wav', 'audio/ogg'], 5, []),
    new Storages('docs', 50 * 1024 * 1024, ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel',], 5, [])
];

// Set up a POST route for uploading files to a specific storage object
app.post('/upload/:storeName', upload.single('file'), async (req, res) => {
    try { 
        await uploadFileToStorage(req.params.storeName,storages, req.file);
        res.status(200).send('File  uploaded successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Set up a GET route for downloading a file from a specific storage object
app.get('/download/:storageName/:fileName', async (req, res) => {
    try {
        const storageName = req.params.storageName;
        const fileName = req.params.fileName;
        const fileData = await downloadFileFromStorage(storageName, fileName,storages);
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        const contentType = mime.lookup(fileName);
        res.setHeader('Content-type', contentType); 
        res.send(fileData);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Set up a GET route for getting information about all storages
app.get('/info/storages', async (req, res) => {
    try {
        const storageInfoPromises = storages.map(async storage => {
            const files = await Promise.all(storage.files.map(async file => ({
                name: file.originalname,
                size: file.size / 1000000
            })));

            return {
                name: storage.name,
                maxFiles: storage.maxFiles,
                allowedTypes: storage.allowedTypes,
                numOfFiles: storage.files.length,
                files: files,
                usedSpace: `${(storage.getSize() / 1000000).toFixed(2)} MB`
            };
        });

        const storageInfo = await Promise.all(storageInfoPromises);

        res.status(200).json(storageInfo);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Set up a GET route for getting information about specific file
app.get('/info/:storageName/:fileName', (req, res) => {
    const storageName = req.params.storageName;
    const fileName = req.params.fileName;

    getFileInfo(storageName, fileName,storages)
        .then((file) => {
            const fileInfo = {
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path:file.path };

            res.status(200).send(fileInfo);
        })
        .catch((err) => {
            console.error(err);
            res.status(404).send(err.message);
        });
});

app.listen(port, () => {
    debug(`App listening on port ${port}`);
    console.log(`Server is running on port ${port}`);
});