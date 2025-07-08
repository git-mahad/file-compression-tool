# ZIP File Compression Tool

A web-based tool for compressing files into ZIP archives and extracting files from ZIP archives, built with HTML, CSS, and JavaScript using the JSZip library.

## Features

- **File Compression**:
  - Compress multiple files into a single ZIP archive
  - Select individual files or entire folders
  - Adjustable compression levels (Fast, Normal, Balanced, Maximum)
  - Drag and drop file support
  - Customizable output filename
  - Compression statistics (original size, compressed size, ratio)

- **File Extraction**:
  - Extract files from ZIP archives
  - View contents of ZIP files
  - Download individual extracted files
  - Download all extracted files as a new ZIP archive
  - Drag and drop ZIP file support

## Technologies Used

- HTML5
- CSS3 (with Bootstrap 5 for responsive design)
- JavaScript (ES6)
- [JSZip](https://stuk.github.io/jszip/) - For ZIP file creation and extraction
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) - For file download functionality

## How to Use

### Compressing Files

1. Click "Choose files" or drag and drop files into the designated area
2. (Optional) Select a folder using the "Select Folder" button
3. (Optional) Set a custom filename for the output ZIP
4. (Optional) Select a compression level
5. Click "Compress to ZIP"
6. Wait for the compression to complete
7. Download the resulting ZIP file

### Extracting Files

1. Click "Choose ZIP file" or drag and drop a ZIP file into the designated area
2. Click "Extract Files"
3. Wait for the extraction to complete
4. Download individual files or all files as a new ZIP archive

## Browser Compatibility

The tool should work in all modern browsers including:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS and iOS)

Note: Some older browsers may have limited functionality.

## Limitations

- Due to browser security restrictions, extracted files are packaged in a new ZIP file for download
- Very large files (several GB) may cause performance issues or fail to process
- Folder structure is preserved when compressing, but may be flattened in some cases

## Credits

- JSZip library by Stuart Knightley
- FileSaver.js by Eli Grey
- Bootstrap for CSS framework
- Gradient background inspired by UI gradients

## Contributing

Contributions are welcome! Please open an issue or pull request for any improvements or bug fixes.