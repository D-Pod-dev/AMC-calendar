export class Resizable {
    constructor(element, options = {}) {
        this.element = element;
        this.options = options;
        this.isResizable = options.isResizable ?? true;
        
        this.startResize = this.startResize.bind(this)
        this.initParams()
        
        // init resizer
        this.resizer = document.createElement('div');
        this.resizer.classList.add('resize-handle');
        this.resizer.textContent = "⤢";
        
        this.resizer.style.top = 0;
        this.resizer.style.right = 0;
        this.resizer.style.transform = "translate(-1px, 0)";

        this.resizer.hidden = (!this.isResizable);
        
        element.appendChild(this.resizer);
        
        // enable
        if (this.isResizable) {
            this.enable();
        };
    };

    initParams() {
        const options = this.options
        
        const parentWidth = this.element.parentElement.offsetWidth;
        const parentHeight = this.element.parentElement.offsetHeight;

        // init params
        this.minWidth = Math.min(parentWidth, options.minWidth ?? 100);
        this.minHeight = Math.min(parentHeight, options.minHeight ?? 100);
        this.maxWidth = Math.min(parentWidth, options.maxWidth ?? Infinity);
        this.maxHeight = Math.min(
            (parentHeight - this.minHeight < 50) 
                ? window.innerHeight - 10
                : parentHeight,
            options.maxHeight ?? Infinity
        );
    };
    
    applyCSSBounds() {
        this.element.style.minWidth = `${this.minWidth}px`;
        this.element.style.minHeight = `${this.minHeight}px`;
        this.element.style.maxWidth = `${this.maxWidth}px`;
        this.element.style.maxHeight = `${this.maxHeight}px`;
    };

    clearCSSBounds() {
        this.element.style.minWidth = ''
        this.element.style.minHeight = '';
        this.element.style.maxWidth = '';
        this.element.style.maxHeight = '';
    };

    enable() {
        console.log('resizability enabled')

        this.isResizable = true;
        
        // resizer styling
        this.resizer.hidden = false;
        this.element.style.borderTopRightRadius = 0;

        // init width and height if not yet defined
        if (typeof (this.width && this.height) === 'undefined') {
            if (typeof this.width === 'undefined') {
                this.width = this.clampWidth(this.element.offsetWidth)
                console.log(`'this.width' logged: ${this.width}`)
            };
            if (typeof this.height === 'undefined') {
                this.height = this.clampHeight(this.element.offsetHeight)
                console.log(`'this.height' logged: ${this.height}`)
            };
        } else {
            // set dimensions to last checkpoint
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
        };

        this.applyCSSBounds();

        // start drag listener IF IS RESIZABLE
        this.resizer.addEventListener('mousedown', this.startResize);
    };

    disable() {
        this.resizer.hidden = true;

        this.resizer.removeEventListener('mousedown', this.startResize);
        
        this.isResizable = false;
        this.element.style.borderTopRightRadius = '';

        this.clearCSSBounds();
    };

    fitContent() {
        this.element.style.width = `fit-content`;
        this.element.style.height = `fit-content`;
    };

    clampWidth(width) {
        return Math.min(this.maxWidth, Math.max(this.minWidth, width));
    };

    clampHeight(height) {
        return Math.min(this.maxHeight, Math.max(this.minHeight, height));
    };

    startResize(e) {     
        e.preventDefault();

        // get pre-drag state
        const startX = e.clientX;
        const startY = e.clientY;

        const elementDimensions = this.element.getBoundingClientRect()
        const startWidth = elementDimensions.width;
        const startHeight = elementDimensions.height;
        
        const onMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const newWidth = this.clampWidth(startWidth + dx);

            const dy = moveEvent.clientY - startY;
            const newHeight = this.clampHeight(startHeight - dy);
            
            this.element.style.width = `${newWidth}px`
            this.element.style.height = `${newHeight}px`
            
            this.width = newWidth;
            this.height = newHeight;
        };

        const onUp = (upEvent) => {
            document.removeEventListener('mousemove', onMove)
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }
};