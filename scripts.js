const fileInput = document.getElementById('fileInput');
const compressButton = document.getElementById('compressButton');
const decompressButton = document.getElementById('decompressButton');
const downloadButton = document.getElementById('downloadButton');
const downloadDecompressedButton = document.getElementById('downloadDecompressedButton');
const outputDiv = document.getElementById('output');

class Node {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

function buildHuffmanTree(freqMap) {
    const priorityQueue = [];

    // Create nodes and add to priority queue
    for (const char in freqMap) {
        const node = new Node(char, freqMap[char]);
        priorityQueue.push(node);
    }

    // Sort priority queue by frequency
    priorityQueue.sort((a, b) => a.freq - b.freq);

    // Build Huffman tree
    while (priorityQueue.length > 1) {
        const node1 = priorityQueue.shift();
        const node2 = priorityQueue.shift();

        const newNode = new Node(null, node1.freq + node2.freq);
        newNode.left = node1;
        newNode.right = node2;

        priorityQueue.push(newNode);
        priorityQueue.sort((a, b) => a.freq - b.freq);
    }

    return priorityQueue[0];
}

function generateHuffmanCodes(node, currentCode, huffmanCodes) {
    if (node === null) return;

    if (node.char !== null) {
        huffmanCodes[node.char] = currentCode;
    }

    generateHuffmanCodes(node.left, currentCode + '0', huffmanCodes);
    generateHuffmanCodes(node.right, currentCode + '1', huffmanCodes);
}

function compressFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        const fileContent = reader.result;
        const freqMap = {};

        for (let i = 0; i < fileContent.length; i++) {
            const char = fileContent[i];
            freqMap[char] = (freqMap[char] || 0) + 1;
        }

        const huffmanTree = buildHuffmanTree(freqMap);
        const huffmanCodes = {};
        generateHuffmanCodes(huffmanTree, '', huffmanCodes);

        let compressedContent = '';
        for (let i = 0; i < fileContent.length; i++) {
            compressedContent += huffmanCodes[fileContent[i]];
        }

        const binaryString = [];
        for (let i = 0; i < compressedContent.length; i += 8) {
            binaryString.push(parseInt(compressedContent.substring(i, i + 8), 2));
        }

        const compressedFile = new Blob([new Uint8Array(binaryString)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(compressedFile);

        downloadButton.disabled = false;
        downloadButton.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed_file.huf';
            a.click();
        };

        outputDiv.innerText = 'File compressed successfully!';
    };
    reader.readAsBinaryString(file);
}

fileInput.onchange = () => {
    compressButton.disabled = false;
    decompressButton.disabled = false;
};

compressButton.onclick = () => {
    const file = fileInput.files[0];
    compressFile(file);
};
