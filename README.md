# TS_File_Storage 
## Server API
---
 The server allows you to create file storages, with restrictions on the number of files, storage size and types available.
 The server is deployed on : http://localhost:1337
 The server correctly handles names and types in English.
 #### Post Requests:
 '/upload/:storeName'- command to upload a file, ': storeName'- storage name.

  #### Get Requests:
  '/download/:storageName/:fileName', ': storeName'-storage name,: fileName- file name. The command allows you to download a file from the chosen storage.\
  '/info/storages'-command allows you to view the information about all available storages.\
  '/info/:storageName/:fileName',: storageName'-store name, fileName- file name. The command allows you to view information about the file.
