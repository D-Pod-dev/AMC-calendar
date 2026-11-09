class Resizable {
    constructor(element, options = {}) {
        this.element = element;
        
        parentWidth = element.parentElement.clientWidth;
        parentHeight = element.parentElement.clientHeight;

        this.minWidth = Math.min(parentWidth, options.minWidth || 400);
        this.minHeight = Math.min(parentHeight, options.minHeight || 300);
        this.maxWidth = Math.min(parentWidth, options.maxWidth || 500);
        this.maxHeight = Math.min(parentHeight, options.maxHeight || 400);

        self.resizer = document.createElement('div')
        self.resizer.classList.add('resize-handle')
        
        element.appendChild(self.resizer)

        handle.addEventListener('mousedown', (e) => {
            // if (!isResizable) { return };
        });
    };
};

const panel = document.getElementById('debug-panel')
const handle = panel.querySelector('.resize-handle')

const dropdown = panel.querySelector('.code-dropdown')
const dataContainer = dropdown.querySelector('pre code')

dataContainer.textContent = `'resizable.js' is linked`;

