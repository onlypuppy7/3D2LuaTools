document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    const contents = reader.result;
    convertOBJToLua(contents);
  };
  reader.readAsText(file);
}

function convertOBJToLua(objData) {
  // Parse OBJ data
  const model = parseOBJ(objData);

  // Format the model as Lua table
  const formattedModel = formatModel(model);

  // Display the formatted model
  document.getElementById('resultContainer').innerHTML = formattedModel;
}

function parseOBJ(objData) {
  const lines = objData.split('\n');
  const vertices = [];
  const edges = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('v ')) {
      const [, x, y, z] = line.split(/\s+/);
      vertices.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
    } else if (line.startsWith('f ')) {
      const [, v1, v2] = line.split(/\s+/);
      edges.push([parseInt(v1), parseInt(v2)]);
    }
  }

  return { vertices, edges };
}

function formatModel(model) {
  const { vertices, edges } = model;
  let result = 'local model = {\n';
  result += '  vertices = {\n';

  for (let i = 0; i < vertices.length; i++) {
    const [x, y, z] = vertices[i];
    result += `    {${x}, ${y}, ${z}}`;
    if (i !== vertices.length - 1) {
      result += ',';
    }
    result += '\n';
  }

  result += '  },\n';
  result += '  edges = {\n';

  for (let i = 0; i < edges.length; i++) {
    const [v1, v2] = edges[i];
    result += `    {${v1}, ${v2}}`;
    if (i !== edges.length - 1) {
      result += ',';
    }
    result += '\n';
  }

  result += '  }\n';
  result += '}\n';

  return result;
}