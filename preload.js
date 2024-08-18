// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    extractNumbers: (filePath) => ipcRenderer.invoke('extract-numbers', filePath),
    copyJpegs: (numbers, sourceFolder, destinationFolder) => ipcRenderer.invoke('copy-jpegs', numbers, sourceFolder, destinationFolder),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog')
});
