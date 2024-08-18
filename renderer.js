// renderer.js
async function browseFile(inputId) {
    try {
        const result = await window.electron.openFileDialog();
        if (!result.canceled) {
            const filePath = result.filePaths[0];
            document.getElementById(inputId).value = filePath;
            document.getElementById(`${inputId}-display`).textContent = filePath.split('\\').pop();
        }
    } catch (error) {
        console.error('Error opening file dialog:', error);
    }
}

async function browseFolder(inputId) {
    try {
        const result = await window.electron.openFolderDialog();
        if (!result.canceled) {
            const folderPath = result.filePaths[0];
            document.getElementById(inputId).value = folderPath;
            document.getElementById(`${inputId}-display`).textContent = folderPath.split('\\').pop();
        }
    } catch (error) {
        console.error('Error opening folder dialog:', error);
    }
}

async function handle() {
    const filePath = document.getElementById('newfile').value;
    const sourceFolder = document.getElementById('folder1').value;
    const destinationFolder = document.getElementById('folder2').value;

    try {
        const numbers = await window.electron.extractNumbers(filePath);
        console.log('Numbers extracted from the file:', numbers);

        const result = await window.electron.copyJpegs(numbers, sourceFolder, destinationFolder);
        if (result) {
            console.log('Files copied successfully.');
        } else {
            console.error('Failed to copy files.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
