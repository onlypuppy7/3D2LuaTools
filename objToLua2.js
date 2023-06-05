function convertImageToEncodedData(file) {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }
  
    function decToHex(dec) {
      return dec.toString(16).padStart(3, "0");
    }
  
    function rgbToHex(red, green, blue) {
      const hex = ((red << 16) | (green << 8) | blue).toString(16).padStart(6, "0");
      return hex.toUpperCase();
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const image = new Image();
        image.onload = function () {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
  
          let encodedData = "";
          encodedData += decToHex(image.width);
          encodedData += decToHex(image.height);
  
          const imageData = context.getImageData(0, 0, image.width, image.height).data;
          for (let i = 0; i < imageData.length; i += 4) {
            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];
            const hex = rgbToHex(red, green, blue);
            encodedData += hex;
          }
  
          resolve(encodedData);
        };
        image.onerror = function () {
          reject(new Error("Failed to load the image."));
        };
        image.src = e.target.result;
      };
      reader.onerror = function () {
        reject(new Error("Failed to read the image file."));
      };
      reader.readAsDataURL(file);
    });
  }  

function convert() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (!file) {
      return;
    }
  
    if (file.type === "image/png" || file.type === "image/jpeg") {
      convertSingleImage(file);
    } else {
      convertSingleObj(file);
    // } else if (file.type === "application/zip") {
    //   convertZip(file);
    }
  }
  
  function convertSingleImage(imageFile) {
    convertImageToEncodedData(imageFile)
      .then((encodedData) => {
        displayEncodedData(encodedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function convertSingleObj(objFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const objData = e.target.result;
        const lines = objData.split("\n");
  
        const object = {
          textures: [],
          vertices: [],
          normals: [],
          textureCoords: [],
          faces: [],
        };
  
        let textureID = 0;
  
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
  
        for (const line of lines) {
          const tokens = line.trim().split(/\s+/);
          const type = tokens[0];
  
          switch (type) {
            case "vt":
              const textureCoord = [
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
              ];
              object.textureCoords.push(textureCoord);
              break;
            case "vn":
              const normal = [
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
                parseFloat(tokens[3]),
              ];
              object.normals.push(normal);
              break;
            case "v":
              const vertex = [
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
                parseFloat(tokens[3]),
              ];
              object.vertices.push(vertex);
              minX = Math.min(minX, vertex[0]);
              minY = Math.min(minY, vertex[1]);
              minZ = Math.min(minZ, vertex[2]);
              maxX = Math.max(maxX, vertex[0]);
              maxY = Math.max(maxY, vertex[1]);
              maxZ = Math.max(maxZ, vertex[2]);
              break;
            case "f":
              const faceVertices = [];
              for (let i = 1; i < tokens.length; i++) {
                const faceToken = tokens[i].split("/");
                const vertexIndex = parseInt(faceToken[0]);
                const textureCoordIndex = parseInt(faceToken[1]);
                const normalIndex = parseInt(faceToken[2]);
                const faceVertex = [
                  vertexIndex,
                  textureCoordIndex,
                  normalIndex,
                ];
                faceVertices.push(faceVertex);
              }
              const face = {
                vertices: faceVertices,
                textureID: textureID,
              };
              object.faces.push(face);
              break;
            case "usemtl":
              textureID++;
              break;
          }
        }
  
        // Calculate the scaling factor
        const scaleX = 2 / (maxX - minX);
        const scaleY = 2 / (maxY - minY);
        const scaleZ = 2 / (maxZ - minZ);
        const scale = Math.min(scaleX, scaleY, scaleZ);
  
        // Scale and center the vertices
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
  
        for (let i = 0; i < object.vertices.length; i++) {
          const vertex = object.vertices[i];
          vertex[0] = (vertex[0] - centerX) * scale;
          vertex[1] = (vertex[1] - centerY) * scale;
          vertex[2] = (vertex[2] - centerZ) * scale;
        }
  
        const encodedData = generateLuaCode(object);
        console.log(encodedData);
        displayEncodedData(encodedData);
        resolve(encodedData);
      };
  
      reader.onerror = function () {
        reject(new Error("Failed to read the OBJ file."));
      };
  
      reader.readAsText(objFile);
    });
  }  
  

  function generateLuaCode(object) {
    let luaCode = "local model = {\n";
    luaCode += "  textures = {\n";
    for (let i = 0; i < object.textures.length; i++) {
      luaCode += `    "${object.textures[i]}"`;
      if (i !== object.textures.length - 1) {
        luaCode += ", ";
      }
      luaCode += "\n";
    }
    luaCode += "  },\n";
    luaCode += "  vertices = {\n";
    for (let i = 0; i < object.vertices.length; i++) {
      const vertex = object.vertices[i];
      luaCode += `    { ${vertex[0]}, ${vertex[1]}, ${vertex[2]} }`;
      if (i !== object.vertices.length - 1) {
        luaCode += ",";
      }
      luaCode += "\n";
    }
    luaCode += "  },\n";
    luaCode += "  normals = {\n";
    for (let i = 0; i < object.normals.length; i++) {
      const normal = object.normals[i];
      luaCode += `    { ${normal[0]}, ${normal[1]}, ${normal[2]} }`;
      if (i !== object.normals.length - 1) {
        luaCode += ",";
      }
      luaCode += "\n";
    }
    luaCode += "  },\n";
    luaCode += "  textureCoords = {\n";
    for (let i = 0; i < object.textureCoords.length; i++) {
      const textureCoord = object.textureCoords[i];
      luaCode += `    { ${textureCoord[0]}, ${textureCoord[1]} }`;
      if (i !== object.textureCoords.length - 1) {
        luaCode += ",";
      }
      luaCode += "\n";
    }
    luaCode += "  },\n";
    luaCode += "  faces = {\n";
    for (let i = 0; i < object.faces.length; i++) {
      const face = object.faces[i];
      luaCode += "    { ";
      for (let j = 0; j < face.vertices.length; j++) {
        const vertex = face.vertices[j];
        luaCode += `{ ${vertex[0]}, ${vertex[1]}, ${vertex[2]} }`;
        if (j !== face.vertices.length - 1) {
          luaCode += ",";
        }
        luaCode += " ";
      }
      luaCode += `,textureID = ${face.textureID} }`;
      if (i !== object.faces.length - 1) {
        luaCode += ",";
      }
      luaCode += "\n";
    }
    luaCode += "  }\n";
    luaCode += "}";
  
    return luaCode;
  }  
  
  function displayEncodedData(encodedData) {
    const imageDataTextarea = document.getElementById("imageData");
    imageDataTextarea.value = encodedData;
  }
  
  function copyCode() {
    const imageDataTextarea = document.getElementById("imageData");
    imageDataTextarea.select();
    document.execCommand("copy");
  }
  