// Import the necessary modules
import Storages from './Storages';
import { File } from "./File";
import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { ReadStream, Stats } from 'fs';
import util from 'util';

//functon  to get information about file in specific storage
export function getFileInfo(storageName: string, fileName: string,storages: Storages[]): Promise<File> {
    return new Promise((resolve, reject) => {
        const storage = storages.find((storage) => storage.name === storageName);
        if (!storage) {
            reject(new Error(`Storage "${storageName}" is not found`));
            return;
        }

        const file = storage.files.find((file) => file.originalname === fileName);
        if (!file) {
            reject(new Error(`File "${fileName}" is not found in  storage "${storageName}"`));
            return;
        }

        resolve(file);
    });
}

//functon  to upload file  in specific storage
export function uploadFileToStorage(storageName: string, storages: Storages[], file: File): Promise<void> {
    return new Promise((resolve, reject) => {
        const storage = storages.find((storage) => storage.name === storageName);
        if (!storage) {
            reject(new Error(`Storage "${storageName}" is not found`));
            return;
        }
        if (!file) {
            return reject(new Error('File is not upload'));
        }
        if (!storage.allowedTypes.includes(file.mimetype)) {
            return reject(new Error(`File ${file.originalname} type ${file.mimetype}is not allowed for this storage `));
        }
        if (file.size > (storage.maxSize - storage.getSize())) {
            return reject(new Error(`File  ${file.originalname} size is too big`));
        }
        if (storage.files.length >= storage.maxFiles) {
            return reject(new Error(`File count for this storage is reached`));
        }
        storage.files.push(file);
        resolve();
    });
}

//functon  to download file  from specific storage
export function downloadFileFromStorage(storageName: string, fileName: string, storages: Storages[]): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const storage = storages.find(storage => storage.name === storageName);
        if (!storage) {
            reject(new Error(`Storage ${storageName} is not found`));
            return;
        }

        const file = storage.files.find(file => file.filename === fileName);
        if (!file) {
            reject(new Error(`File ${fileName} is not found in ${storageName}`));
            return;
        }

        fs.readFile(file.path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

