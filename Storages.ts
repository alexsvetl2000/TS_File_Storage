import { File } from "./File";

//Create class  for storages 
class Storages {
    name: string;
    maxSize: number;
    allowedTypes: string[];
    maxFiles: number;
    files: File[];

    constructor(name:string, maxSize: number, allowedTypes: string[], maxFiles: number, files: any[]) {
            this.name=name
            this.maxSize = maxSize,
            this.allowedTypes = allowedTypes,
            this.maxFiles = maxFiles,
            this.files = files;
        
    }
    
    //function to get storage space taken
    getSize(): number {
        let size = 0;
        for (const file of this.files) {
            size += file.size;
        }
        return size;
    }

    // function to upload file in storage with checking type,storage space  and storage maximum file count
    uploadFile(file:any): void {
        

        if (!this.allowedTypes.includes(file.mime)) {
            throw new Error(`This type is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`);
        }
        if (this.getSize() + file.size > this.maxSize) {
            throw new Error(`Files are to big. Storage max size: ${this.maxSize}`);
        }

        if (this.files.length >= this.maxFiles) {
            throw new Error(`File count for this storage is reached. Max count: ${this.maxFiles}`);
        }

        this.files.push(file);
    }
}

export default  Storages ;