// Navigation
const navigation = document.createElement('nav');
navigation.classList.add('navigation');

navigation.appendChild(createLink('index.html', 'Home'));
navigation.appendChild(createLink('objToLua.html', 'OBJ to Lua (OLD)'));
navigation.appendChild(createLink('objToLua2.html', 'OBJ to Lua'));
navigation.appendChild(createLink('texturePainter.html', 'Texture Painter'));
navigation.appendChild(createLink('modelGenerator.html', 'Model Viewer'));

document.body.appendChild(navigation);

function createLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.classList.add('button');
  return link;
}

const styles = `
  /* Styling for the navigation and buttons */
  .navigation {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .button {
    display: inline-block;
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #3498db;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .button:hover {
    background-color: #2980b9;
  }
  
  .button.active {
    background-color: #2980b9;
  }
`;

const styleTag = document.createElement('style');
styleTag.textContent = styles;
document.head.appendChild(styleTag);
