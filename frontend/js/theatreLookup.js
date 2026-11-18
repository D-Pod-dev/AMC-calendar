import { displayStatus, displayDebugData } from './utils/dataDisplay.js';

const searchButton = document.getElementById('theatre-search-button');
const defaultTheatreSearchButtonText = searchButton.textContent;

export function indicateSearching() {
    searchButton.disabled = true;
    
    return setTimeout(() => {
        searchButton.textContent = "Searching...";
    }, 300);
};

export function resetTheatreSearchButton() {
    searchButton.disabled = false;
    searchButton.textContent = defaultTheatreSearchButtonText;
}

export function displayTheatreResults(theatres) {
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

export async function lookupTheatres() {
    let query = document.getElementById('query-input').value;
    let searchBy = document.getElementById('search-by-input').value;
    let resultCount = document.getElementById('theatre-result-count').value;

    let loadingTimeout = indicateSearching();
    
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
