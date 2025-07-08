const fileInput = document.getElementById('fileInput');
const zipInput = document.getElementById('zipInput');
const compressButton = document.getElementById('compressButton');
const decompressButton = document.getElementById('decompressButton');
const folderButton = document.getElementById('folderButton');
const clearButton = document.getElementById('clearButton');
const outputDiv = document.getElementById('output');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const fileInputLabel = document.getElementById('fileInputLabel');
const zipInputLabel = document.getElementById('zipInputLabel');
const compressMode = document.getElementById('compressMode');
const decompressMode = document.getElementById('decompressMode');
const modeButtons = document.querySelectorAll('.mode-btn');
const levelButtons = document.querySelectorAll('.level-btn');
const zipFileName = document.getElementById('zipFileName');
const filenameInput = document.getElementById('filenameInput');
const compressionLevel = document.getElementById('compressionLevel');
const decompressInfo = document.getElementById('decompressInfo');
const filesSelectedInfo = document.getElementById('filesSelectedInfo');

let selectedFiles = [];
let selectedZip = null;
let currentCompressionLevel = 6;
let extractedFiles = {};
let downloadBlobs = {}; // Store blobs for download

// Mode switching
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (mode === 'compress') {
            compressMode.style.display = 'block';
            decompressMode.style.display = 'none';
        } else {
            compressMode.style.display = 'none';
            decompressMode.style.display = 'block';
        }
        resetInterface();
    });
});

// Compression level selection
levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        levelButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCompressionLevel = parseInt(btn.dataset.level);
    });
});

// Clear all files
clearButton.addEventListener('click', () => {
    selectedFiles = [];
    updateFileList();
    compressButton.disabled = true;
    clearButton.style.display = 'none';
    filenameInput.style.display = 'none';
    compressionLevel.style.display = 'none';
    filesSelectedInfo.style.display = 'none';
    fileInputLabel.textContent = '📁 Choose files to compress or drag & drop here';
});

// Folder selection
folderButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            selectedFiles = Array.from(e.target.files);
            updateFileList();
            updateCompressUI();
        }
    });
    input.click();
});

// File selection for compression
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedFiles = [...selectedFiles, ...Array.from(e.target.files)];
        updateFileList();
        updateCompressUI();
    }
});

// ZIP file selection for decompression
zipInput.addEventListener('change', (e) => {
    selectedZip = e.target.files[0];
    if (selectedZip) {
        zipInputLabel.textContent = `📦 Selected: ${selectedZip.name}`;
        decompressButton.disabled = false;
        decompressInfo.style.display = 'block';
    }
});

// Update compress UI
function updateCompressUI() {
    if (selectedFiles.length > 0) {
        compressButton.disabled = false;
        clearButton.style.display = 'inline-block';
        filenameInput.style.display = 'block';
        compressionLevel.style.display = 'block';
    }
}

// Remove file from selection
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
    if (selectedFiles.length === 0) {
        compressButton.disabled = true;
        clearButton.style.display = 'none';
        filenameInput.style.display = 'none';
        compressionLevel.style.display = 'none';
        filesSelectedInfo.style.display = 'none';
        fileInputLabel.textContent = '📁 Choose files to compress or drag & drop here';
    }
}

// Drag and drop functionality
function setupDragDrop(element, callback) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('dragover');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('dragover');
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('dragover');
        callback(e.dataTransfer.files);
    });
}

setupDragDrop(fileInputLabel, (files) => {
    selectedFiles = [...selectedFiles, ...Array.from(files)];
    updateFileList();
    updateCompressUI();
});

setupDragDrop(zipInputLabel, (files) => {
    if (files.length > 0 && files[0].name.endsWith('.zip')) {
        selectedZip = files[0];
        zipInputLabel.textContent = `📦 Selected: ${selectedZip.name}`;
        decompressButton.disabled = false;
        decompressInfo.style.display = 'block';
    }
});

// Update file list display
function updateFileList() {
    if (selectedFiles.length === 0) {
        fileInputLabel.textContent = '📁 Choose files to compress or drag & drop here';
        filesSelectedInfo.style.display = 'none';
        return;
    }

    fileInputLabel.textContent = `📁 ${selectedFiles.length} file(s) selected - Click to add more`;
    
    let listHtml = '<div class="file-list">';
    selectedFiles.forEach((file, index) => {
        const sizeStr = formatFileSize(file.size);
        const fileName = file.webkitRelativePath || file.name;
        listHtml += `
            <div class="file-item">
                <span>📄 ${fileName}</span>
                <div>
                    <span class="file-size">${sizeStr}</span>
                    <button class="remove-btn" onclick="removeFile(${index})">×</button>
                </div>
            </div>
        `;
    });
    listHtml += '</div>';
    
    filesSelectedInfo.innerHTML = listHtml;
    filesSelectedInfo.style.display = 'block';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show progress
function showProgress(text) {
    progressContainer.style.display = 'block';
    progressText.textContent = text;
    progressBar.style.width = '0%';
}

// Update progress
function updateProgress(percent, text) {
    progressBar.style.width = percent + '%';
    progressText.textContent = text;
}

// Hide progress
function hideProgress() {
    progressContainer.style.display = 'none';
}

// Reset interface
function resetInterface() {
    selectedFiles = [];
    selectedZip = null;
    extractedFiles = {};
    downloadBlobs = {};
    fileInputLabel.textContent = '📁 Choose files to compress or drag & drop here';
    zipInputLabel.textContent = '📦 Choose ZIP file to decompress or drag & drop here';
    compressButton.disabled = true;
    decompressButton.disabled = true;
    clearButton.style.display = 'none';
    filenameInput.style.display = 'none';
    compressionLevel.style.display = 'none';
    decompressInfo.style.display = 'none';
    filesSelectedInfo.style.display = 'none';
    outputDiv.style.display = 'none';
    hideProgress();
}

// Download blob as file
function downloadBlob(blob, filename) {
    if (typeof saveAs !== 'undefined') {
        saveAs(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Download stored blob
function downloadStoredBlob(blobKey, filename) {
    if (downloadBlobs[blobKey]) {
        downloadBlob(downloadBlobs[blobKey], filename);
    }
}

// Download individual file
function downloadFile(filename) {
    const fileData = extractedFiles[filename];
    if (fileData) {
        const blob = new Blob([fileData]);
        downloadBlob(blob, filename);
    }
}

// Compression function
async function compressFiles() {
    if (selectedFiles.length === 0) return;

    showProgress('Initializing compression...');
    
    try {
        const zip = new JSZip();
        const totalFiles = selectedFiles.length;
        let processedFiles = 0;

        // Add files to ZIP
        for (const file of selectedFiles) {
            updateProgress((processedFiles / totalFiles) * 50, `Adding ${file.name}...`);
            
            let filePath = file.name;
            if (file.webkitRelativePath) {
                filePath = file.webkitRelativePath;
            }
            
            const fileContent = await file.arrayBuffer();
            zip.file(filePath, fileContent);
            processedFiles++;
        }

        updateProgress(60, 'Compressing files...');
        
        // Generate ZIP file
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: currentCompressionLevel }
        }, (metadata) => {
            const progress = 60 + (metadata.percent * 0.4);
            updateProgress(progress, `Compressing... ${Math.round(metadata.percent)}%`);
        });

        updateProgress(100, 'Compression complete!');
        
        // Calculate compression stats
        const originalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
        const compressedSize = zipBlob.size;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        // Store blob for download
        const filename = zipFileName.value.trim() || 'compressed_files';
        const blobKey = 'compressed_' + Date.now();
        downloadBlobs[blobKey] = zipBlob;

        // Download compressed file
        downloadBlob(zipBlob, `${filename}.zip`);

        // Show results
        outputDiv.innerHTML = `
            <h5>✅ Compression Successful!</h5>
            <div class="compression-stats">
                <div class="stat-item">
                    <span>Original Size:</span>
                    <span>${formatFileSize(originalSize)}</span>
                </div>
                <div class="stat-item">
                    <span>Compressed Size:</span>
                    <span>${formatFileSize(compressedSize)}</span>
                </div>
                <div class="stat-item">
                    <span>Compression Ratio:</span>
                    <span>${compressionRatio}%</span>
                </div>
                <div class="stat-item">
                    <span>Compression Level:</span>
                    <span>${currentCompressionLevel}/9</span>
                </div>
                <div class="stat-item">
                    <span>Files Processed:</span>
                    <span>${totalFiles}</span>
                </div>
            </div>
            <div class="download-buttons">
                <button class="btn btn-custom" onclick="downloadStoredBlob('${blobKey}', '${filename}.zip')">
                    📥 Download Again
                </button>
            </div>
        `;
        outputDiv.style.display = 'block';
        
        setTimeout(hideProgress, 2000);
        
    } catch (error) {
        console.error('Compression error:', error);
        outputDiv.innerHTML = `<h5>❌ Compression Failed</h5><p>Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';
        hideProgress();
    }
}

// Decompression function
async function decompressFile() {
    if (!selectedZip) return;

    showProgress('Reading ZIP file...');
    
    try {
        const zip = await JSZip.loadAsync(selectedZip);
        const fileNames = Object.keys(zip.files);
        const totalFiles = fileNames.filter(name => !zip.files[name].dir).length;
        let processedFiles = 0;

        updateProgress(10, `Found ${totalFiles} files in ZIP...`);

        // Extract files
        extractedFiles = {};
        let extractedFilesList = '';
        
        for (const fileName of fileNames) {
            const file = zip.files[fileName];
            
            if (!file.dir) {
                updateProgress((processedFiles / totalFiles) * 80 + 10, `Extracting ${fileName}...`);
                
                const content = await file.async('arraybuffer');
                extractedFiles[fileName] = content;
                
                const fileSize = formatFileSize(content.byteLength);
                extractedFilesList += `
                    <div class="file-item">
                        <span>📄 ${fileName}</span>
                        <div>
                            <span class="file-size">${fileSize}</span>
                            <button class="btn btn-custom btn-sm" onclick="downloadFile('${fileName}')">
                                📥 Download
                            </button>
                        </div>
                    </div>
                `;
                processedFiles++;
            }
        }

        updateProgress(90, 'Preparing downloads...');

        // Create ZIP with extracted files for bulk download
        const extractedZip = new JSZip();
        for (const [fileName, content] of Object.entries(extractedFiles)) {
            extractedZip.file(fileName, content);
        }

        const extractedBlob = await extractedZip.generateAsync({
            type: 'blob'
        });

        updateProgress(100, 'Extraction complete!');

        // Store blob for download
        const extractedFilename = selectedZip.name.replace('.zip', '_extracted.zip');
        const blobKey = 'extracted_' + Date.now();
        downloadBlobs[blobKey] = extractedBlob;

        // Download extracted files as ZIP
        downloadBlob(extractedBlob, extractedFilename);

        // Show results
        outputDiv.innerHTML = `
            <h5>✅ Extraction Successful!</h5>
            <div class="compression-stats">
                <div class="stat-item">
                    <span>Original ZIP Size:</span>
                    <span>${formatFileSize(selectedZip.size)}</span>
                </div>
                <div class="stat-item">
                    <span>Extracted Size:</span>
                    <span>${formatFileSize(extractedBlob.size)}</span>
                </div>
                <div class="stat-item">
                    <span>Files Extracted:</span>
                </div>
            </div>
            <div class="download-buttons">
                <button class="btn btn-custom" onclick="downloadStoredBlob('${blobKey}', '${extractedFilename}')">
                    📥 Download All as ZIP
                </button>
            </div>
            <div class="extracted-files">
                <h6>Individual Files:</h6>
                <div class="file-list">
                    ${extractedFilesList}
                </div>
            </div>
        `;
        outputDiv.style.display = 'block';
        
        setTimeout(hideProgress, 2000);
        
    } catch (error) {
        console.error('Decompression error:', error);
        outputDiv.innerHTML = `<h5>❌ Decompression Failed</h5><p>Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';
        hideProgress();
    }
}

// Event listeners
compressButton.addEventListener('click', compressFiles);
decompressButton.addEventListener('click', decompressFile);