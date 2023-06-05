// Load necessary dependencies (THREE.js)
const script = document.createElement('script');
script.src = 'https://cdn.rawgit.com/mrdoob/three.js/r129/build/three.min.js';
document.head.appendChild(script);

// Define the default model
const defaultModel = {
  vertices: [
    [-50, -50, -50, 0, 0],
    [50, -50, -50, 1, 0],
    [50, 50, -50, 1, 1],
    [-50, 50, -50, 0, 1],
    [-50, -50, 50, 0, 0],
    [50, -50, 50, 1, 0],
    [50, 50, 50, 1, 1],
    [-50, 50, 50, 0, 1]
  ],
  faces: [
    { vertices: [1, 2, 3], texture: 0 },
    { vertices: [3, 4, 1], texture: 0 },
    { vertices: [2, 6, 7], texture: 0 },
    { vertices: [7, 3, 2], texture: 0 },
    { vertices: [6, 5, 8], texture: 0 },
    { vertices: [8, 7, 6], texture: 0 },
    { vertices: [5, 1, 4], texture: 0 },
    { vertices: [4, 8, 5], texture: 0 },
    { vertices: [4, 3, 7], texture: 0 },
    { vertices: [7, 8, 4], texture: 0 },
    { vertices: [5, 6, 2], texture: 0 },
    { vertices: [2, 1, 5], texture: 0 }
  ],
  textures: [
    '005005FFFFFFFFFFFF000000FFFFFFFFFFFFFFFFFF000000000000000000FFFFFF000000FFFFFF000000FFFFFF000000FFFFFFFFFFFF000000FFFFFFFFFFFFFFFFFFFFFFFF000000FFFFFFFFFFFF'
  ]
};

// Function to generate the model based on the input code
function generateModel() {
  const codeInput = document.getElementById('codeInput');
  const code = codeInput.value.trim();

  // Decode the image data
  const widthHex = code.substr(0, 3);
  const heightHex = code.substr(3, 3);
  const width = parseInt(widthHex, 16);
  const height = parseInt(heightHex, 16);
  const imageData = code.substr(6);

  // Generate the model based on the code
  const model = {
    vertices: defaultModel.vertices.slice(),
    faces: defaultModel.faces.slice(),
    textures: [imageData]
  };

  // Create the 3D model viewer
  const modelViewer = document.getElementById('model-viewer');
  modelViewer.innerHTML = '';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  modelViewer.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

// Execute the default model generation on page load
generateModel();
