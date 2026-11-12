export class Resizable {
    constructor(element, options = {}) {
        this.element = element;
        
        const parentWidth = element.parentElement.clientWidth;
        const parentHeight = element.parentElement.clientHeight;

        this.minWidth = Math.min(parentWidth, options.minWidth ?? 400);
        this.minHeight = Math.min(parentHeight, options.minHeight ?? 300);
        this.maxWidth = Math.min(parentWidth, options.maxWidth ?? 500);
        this.maxHeight = Math.min(parentHeight, options.maxHeight ?? 400);

        this.isResizable = options.isResizable ?? true;
        
        this.resizer = document.createElement('div');
        this.resizer.classList.add('resize-handle');
        this.resizer.textContent = "⤢";
        this.resizer.style.top = 0;
        this.resizer.style.right = 0;

        this.resizer.hidden = (!this.isResizable);
        
        element.appendChild(this.resizer);
        
        if (this.isResizable) {
            this.enable();
        } else {
            this.disable();
        };
        
        this.resizer.addEventListener('mousedown', (e) => {
            if (!this.isResizable) { return };

            this.startResize.bind(this)
        });
    };

    enable() {
        this.isResizable = true;
        this.resizer.hidden = false;

        this.width = this.width ?? this.element.offsetWidth;
        this.element.style.width = this.width;

        this.height = this.height ?? this.element.offsetHeight;
        this.element.style.height = this.height;

        console.log(this.isResizable);
    };

    disable() {
        this.isResizable = false;
        this.resizer.hidden = true;

        console.log(this.isResizable);
    };

    fitContent() {
        this.element.style.width = `fit-content`;
        this.element.style.height = `fit-content`;
    };
};

const panel = document.getElementById('debug-panel')
const handle = panel.querySelector('.resize-handle')

const dropdown = panel.querySelector('.code-dropdown')
const dataContainer = dropdown.querySelector('pre code')

dataContainer.textContent = `'resizable.js' is linked`;