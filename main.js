// main.js
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 450,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    win.loadFile('index.html');

    // Remove the default menu
    Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handler for 'extract-numbers' event
ipcMain.handle('extract-numbers', async (event, filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const pattern = /\d+/g; // Matches one or more digits
        const matches = content.match(pattern);

        if (!matches) {
            return [];
        }

        const numbers = [...new Set(matches.map(Number))];
        return numbers;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
});

// Handler for 'copy-jpegs' event
ipcMain.handle('copy-jpegs', async (event, numbers, sourceFolder, destinationFolder) => {
    try {
        if (!fs.existsSync(sourceFolder)) {
            console.error('Source folder does not exist:', sourceFolder);
            return false;
        }

        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
        }

        const files = fs.readdirSync(sourceFolder);
        const jpegFiles = files.filter(file => {
            const match = file.match(/(\d+)/);
            return match && numbers.includes(parseInt(match[1], 10));
        });

        jpegFiles.forEach(file => {
            const sourcePath = path.join(sourceFolder, file);
            const destinationPath = path.join(destinationFolder, file);
            fs.copyFileSync(sourcePath, destinationPath);
        });

        return true;
    } catch (error) {
        console.error('Error copying files:', error);
        return false;
    }
});

// Handler for 'open-file-dialog' event
ipcMain.handle('open-file-dialog', async () => {
    return dialog.showOpenDialog({
        properties: ['openFile']
    });
});

// Handler for 'open-folder-dialog' event
ipcMain.handle('open-folder-dialog', async () => {
    return dialog.showOpenDialog({
        properties: ['openDirectory']
    });
});
