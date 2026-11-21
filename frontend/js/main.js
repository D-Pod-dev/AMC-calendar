import { lookupTheatres, populateTheatreSidebar, updateSelectedTheatreDisplay } from './theatreLookup.js';
import { Resizable } from './utils/resizable.js';
import { displayStatus, displayDebugData } from './utils/dataDisplay.js';

window.lookupTheatres = lookupTheatres;
window.populateTheatreSidebar = populateTheatreSidebar;
window.displayDebugData = displayDebugData;

// make enter key submit search
document.getElementById('theatre-query-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        lookupTheatres();
    };
});

// MAKE DEBUG PANEL RESIZABLE
const debugPanel = document.getElementById('debug-panel');
const dropdown = document.querySelector('.code-dropdown');
const panelDimensions = debugPanel.getBoundingClientRect();

const panelResizable = new Resizable(debugPanel, 
    {
        isResizable: false, 
        minWidth: panelDimensions.width,
        minHeight: panelDimensions.height + 30,
        fitToWindow: true
    });

dropdown.addEventListener('toggle', () => {
    // console.log('dropdown toggled');
    
    if (dropdown.open) {
        panelResizable.enable();
    } else {
        panelResizable.disable();
        panelResizable.fitContent();
    };
});

document.querySelector('main').style.paddingBottom = `${panelDimensions.height}px`

updateSelectedTheatreDisplay();