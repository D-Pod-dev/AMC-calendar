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
        this.resizer.style.transform = "translate(-1px, 0)";

        this.resizer.hidden = (!this.isResizable);
        
        element.appendChild(this.resizer);
        
        if (this.isResizable) {
            this.enable();
        } else {
            this.disable();
        };
        
        this.resizer.addEventListener('mousedown', (e) => {
            if (!this.isResizable) { return };

            this.startResize(e);
        });
    };

    enable() {
        this.resizer.hidden = false;
        
        this.isResizable = true;
        this.element.style.borderTopRightRadius = 0;

        this.width = this.width ?? this.element.offsetWidth;
        this.element.style.width = this.width;

        this.height = this.height ?? this.element.offsetHeight;
        this.element.style.height = this.height;

    };

    disable() {
        this.resizer.hidden = true;
        
        this.isResizable = false;
        this.element.style.borderTopRightRadius = '';
    };

    fitContent() {
        this.element.style.width = `fit-content`;
        this.element.style.height = `fit-content`;
    };

    startResize() {

    }
};