const { HttpStatusCode } = axios;

window.lookupTheatres = lookupTheatres;

// render color-coded status code
export function displayStatus(statusCode) {
    let statusDisplay;

    if (typeof statusCode === 'number') {
        statusDisplay = `<span style="color: ${
            {1: 'gray', 2: 'limegreen', 3: 'yellow', 4: 'red', 5: 'red'}
            [Math.floor(statusCode/100)]
        };">${statusCode}</span> | ${HttpStatusCode[statusCode]}`;
    };

    if (typeof statusDisplay !== 'undefined') {
        document.getElementById('status-message').innerHTML = statusDisplay;
    } else {
        document.getElementById('status-message').textContent = "Invalid Status Code";
    };
};

function displayDebugData(data) {
    document.getElementById('theatre-debug-data').textContent = JSON.stringify(data, null, 2);

};

const searchButton = document.getElementById('theatre-search-button');
const defaultTheatreSearchButtonText = searchButton.textContent;

function indicateSearching() {
    let loadingTimeoutReached = false;
    searchButton.disabled = true;
    
    return setTimeout(() => {
        searchButton.textContent = "Searching...";
    }, 300);
};

function resetTheatreSearchButton() {
    searchButton.disabled = false;
    searchButton.textContent = defaultTheatreSearchButtonText;
}

function displayTheatreResults(theatres) {
    const relevanceCutoff = 75
    
    let resultsContainer = document.getElementById('theatre-results');
    resultsContainer.innerHTML = 
        "<h2>Theatre Results:</h2>"
        +"<ol id='theatre-list'>"
        +theatres.map((theatre, index) =>     
            (
                (index === 0 && theatre.ratio <= relevanceCutoff)
                ? (`<p style='margin-left: 1rem;'>No perfect matches. (`
                    +`<span class="refocus" id="focus-search-by-input" tabindex="0"`
                    +` onclick="document.getElementById('search-by-input').focus();"`
                    +`>Maybe try changing the search filter?</span>)</p>`)
                : ""
            )    
            +(
                (theatre.ratio <= relevanceCutoff && 
                (index === 0 || theatres[index-1].ratio > relevanceCutoff))
                ? ("<details id='less-relevant-theatre-results'>"
                    +`<summary>Less relevant results (${theatres.length-index}) - click to show/hide</summary>`
                    +"<div>") 
                : ""
            )
            +"<li>"
            +`<b><a href="${theatre.url}">${theatre.title}</a></b> - ${theatre.city[0].toUpperCase()+theatre.city.slice(1).toLowerCase()}`
            +"</li>"
            +(
                (index === theatres.length-1 && theatre.ratio <= 60)
                ? "</div></details>"
                : ""
            )
        ).join('')
        +"</ol>";

        document.getElementById('focus-search-by-input')?.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                this.click();
            };
        })
}

async function lookupTheatres() {
    let query = document.getElementById('query-input').value;
    let searchBy = document.getElementById('search-by-input').value;
    let resultCount = document.getElementById('theatre-result-count').value;

    let loadingTimeout = indicateSearching();
    displayDebugData();

    const response = await fetch(`/api/theatre-lookup?${new URLSearchParams({ query, searchBy, resultCount})}`);
    
    const data = await response.json();
    
    // render color-coded status code
    displayStatus(response.status);
    clearTimeout(loadingTimeout);
    resetTheatreSearchButton();
    
    // report result of API call
    if (response.ok) {
        displayDebugData(data);
        displayTheatreResults(data);
    } else {
        displayDebugData(data.detail);
    };
};

// make enter key submit search
document.getElementById('query-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        lookupTheatres();
    };
});

// MAKE DEBUG PANEL RESIZABLE
import { Resizable } from './utils/resizable.js';

const debugPanel = document.getElementById('debug-panel');
const dropdown = document.querySelector('.code-dropdown');
const panelDimensions = debugPanel.getBoundingClientRect();

const panelResizable = new Resizable(debugPanel, 
    {
        isResizable: false, 
        minWidth: panelDimensions.width,
        minHeight: panelDimensions.height + 30
        // maxWidth: 
    });

dropdown.addEventListener('toggle', () => {
    console.log('dropdown toggled');
    
    if (dropdown.open) {
        panelResizable.enable();
    } else {
        panelResizable.disable();
        panelResizable.fitContent();
    };
});

window.addEventListener('resize', () => {
    panelResizable.initParams();
    panelResizable.applyCSSBounds();
});

let bottomSpacer = document.createElement('div');
bottomSpacer.id = 'bottom-spacer';
bottomSpacer.style.height = `${panelDimensions.height}px`;
document.querySelector('body').appendChild(bottomSpacer);