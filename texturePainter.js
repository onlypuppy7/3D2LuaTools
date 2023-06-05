const canvasContainer = document.querySelector('.canvas-container');
const colorPicker = document.getElementById('colorPicker');
const imageDataContainer = document.getElementById('imageData');
const imageUploadInput = document.getElementById('imageUploadInput');
let canvasWidth = 16;
let canvasHeight = 16;
let currentColor = colorPicker.value;

colorPicker.addEventListener('change', () => {
  currentColor = colorPicker.value;
});

function createCanvas() {
    canvasContainer.innerHTML = '';
  
    const maxDimension = Math.max(canvasWidth, canvasHeight);
    const containerSize = 400; // Adjust the constant size of the canvas container as desired
    const pixelSize = Math.floor(containerSize / maxDimension);
  
    canvasContainer.style.width = `${pixelSize * canvasWidth}px`;
    canvasContainer.style.height = `${pixelSize * canvasHeight}px`;
  
    for (let i = 0; i < canvasHeight; i++) {
      for (let j = 0; j < canvasWidth; j++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.backgroundColor = '#FFFFFF'; // Set pixel color to white
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.addEventListener('mousedown', startDrawing);
        pixel.addEventListener('mouseover', draw);
        pixel.addEventListener('contextmenu', erase);
        canvasContainer.appendChild(pixel);
      }
    }
  }
 
function setCanvasSize() {
  const newWidth = parseInt(prompt('Enter canvas width:'));
  const newHeight = parseInt(prompt('Enter canvas height:'));
  if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
    alert('Invalid size. Please enter positive numbers.');
    return;
  }
  canvasWidth = newWidth;
  canvasHeight = newHeight;
  createCanvas();
}

function startDrawing(e) {
  if (e.buttons === 1) {
    draw(e);
  } else if (e.buttons === 2) {
    erase(e);
  }
}

function draw(e) {
  if (e.buttons !== 1) return;
  e.target.style.backgroundColor = currentColor;
  updateImageData();
}

function erase(e) {
  e.preventDefault();
  e.target.style.backgroundColor = '#FFFFFF';
  updateImageData();
}

function clearImageData() {
    const pixels = canvasContainer.querySelectorAll('.pixel');
    pixels.forEach((pixel) => {
      pixel.style.backgroundColor = '#FFFFFF'; // Set pixel color to white
    });
    updateImageData();
  }

function updateImageData() {
  let imageData = '';

  // Add width and height in hex
  const widthHex = canvasWidth.toString(16).padStart(3, '0').toUpperCase();
  const heightHex = canvasHeight.toString(16).padStart(3, '0').toUpperCase();
  imageData += widthHex + heightHex;

  // Add pixel colors
  const pixels = canvasContainer.querySelectorAll('.pixel');
  pixels.forEach((pixel, index) => {
    const color = pixel.style.backgroundColor || 'rgba(0, 0, 0, 0)';
    const hex = rgbToHex(color);
    imageData += hex;

    // Add line break after each row
    if ((index + 1) % canvasWidth === 0) {
      imageData += '\n';
    }
  });

  imageDataContainer.textContent = imageData.replace(/\s/g, '');
}

function rgbToHex(color) {
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    const [r, g, b] = match.map((c) => parseInt(c));
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
  } else {
    return 'FFFFFF';
  }
}

// Copy the encoded image data to the clipboard
function copyImageData() {
    const imageData = document.getElementById('imageData');
    const range = document.createRange();
    range.selectNode(imageData);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  
    // Get the text content without line breaks and spaces
    const textContent = imageData.textContent.replace(/[\n\s]/g, '');
  
    // Create a temporary textarea element to hold the cleaned text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = textContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
  
    window.getSelection().removeAllRanges();
    alert('Image data copied to clipboard!');
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.onload = function () {
        // Set canvas size to match the image size
        canvasWidth = img.width;
        canvasHeight = img.height;
        createCanvas();
  
        // Clear the canvas
        const pixels = canvasContainer.querySelectorAll('.pixel');
        pixels.forEach((pixel) => {
          pixel.style.backgroundColor = '';
        });
  
        // Draw the image onto the canvas
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const pixelData = getPixelData(img, x, y);
            const pixelIndex = y * canvasWidth + x;
            const pixel = pixels[pixelIndex];
            pixel.style.backgroundColor = pixelData;
          }
        }
  
        updateImageData();
      };
  
      img.src = e.target.result;
    };
  
    reader.readAsDataURL(file);
  }
  
  function getPixelData(img, x, y) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1;
    canvas.height = 1;
    context.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
    const pixelData = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
  }
  

  

// Create initial canvas
createCanvas();
