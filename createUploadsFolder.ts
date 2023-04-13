// Import the necessary modules
import fs from 'fs';
import path from 'path';
const directory: string = path.join(__dirname, 'uploads');
import multer from 'multer';

// Create a storage object for Multer
const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

// Create an upload object using Multer and the storage object
export const upload = multer({ storage: store })

// Function to delete all files in the uploads directory
export function deleteFilesInDirectory(): void {
    fs.readdir(directory, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), (err: NodeJS.ErrnoException | null) => {
                if (err) throw err;
            });
        }
    });
}

// Function to create the uploads directory if it doesn't exist
export function createUploadsFolder(): void {
    
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
};



