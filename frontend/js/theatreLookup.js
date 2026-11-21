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

export function updateSelectedTheatreDisplay() {
    const selectedTheatre = JSON.parse(localStorage.getItem('selectedTheatre'));
    
    document.getElementById('selected-theatre-message').innerHTML = 
    (selectedTheatre !== null) ? 
    `<b>Theatre:</b> ${selectedTheatre.title}`
    : 'No theatre selected yet.';

    if (selectedTheatre === null) { document.getElementById('open-theatre-lookup-button').focus(); };
};

export async function populateTheatreSidebar(theatreId) {
    const theatreSidebar = document.getElementById('infobar');
    const header = theatreSidebar.querySelector('header');
    const dataContainer = theatreSidebar.querySelector('section');
    const dataTemplate = theatreSidebar.querySelector('#theatre-info-template').content.cloneNode(true);

    theatreSidebar.hidden = false;
    
    const response = await fetch(`/api/get-theatre-by-id?${new URLSearchParams({ theatreId })}`);
    const theatre = await response.json();
    displayDebugData(theatre)
    
    dataContainer.innerHTML = '';
    header.querySelector('h2').textContent = theatre.title;
    header.querySelector('#amc-link').href = theatre.url;

    const address = `${theatre.addressLine1}, ${capitalCase(theatre.city)}, ${theatre.state}`;
    dataTemplate.querySelector('#address').textContent = address;
    
    dataTemplate.querySelector('#select-theatre-button').onclick = () => {
        localStorage.setItem("selectedTheatre", JSON.stringify(theatre));
        console.log(JSON.parse(localStorage.getItem('selectedTheatre')).title);
        updateSelectedTheatreDisplay();
    };

    dataContainer.append(dataTemplate);
};

function capitalCase(str) {
    return str.split(' ').map((word) => 
        word[0].toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

export function displayTheatreResults(theatres) {
    // minimum ratio value that defines what results are matches
    const relevanceCutoff = 75;
    
    let resultsContainer = document.getElementById('theatre-results');
    
    resultsContainer.innerHTML = 
        "<h2>Theatre Results:</h2>"
        +"<ol id='theatre-list'>"
        +theatres.map((theatre, index) =>     
            ( // if the first result's ratio is less than the relevance cutoff - no perfect matches
                (index === 0 && theatre.ratio <= relevanceCutoff) ?

                (`<p style='margin-left: 1rem;'>No perfect matches. `+
                    // make an element that will suggest changing search-by term and refocus to it on click
                    `(<span class="refocus" id="focus-search-by-input" tabindex="0"
                        onclick="document.getElementById('search-by-input').focus();"
                        >Maybe try changing the search filter?</span>)
                    </p>`
                )
                
                : ""
            )    
            +
            ( // dropdown containing non-matches rendered before first non-matching result
                (theatre.ratio <= relevanceCutoff && 
                (index === 0 || theatres[index-1].ratio > relevanceCutoff)) ?

                (`<details id='less-relevant-theatre-results'>
                    <summary>Less relevant results (${theatres.length-index}) - click to show/hide</summary>`
                )
                
                : ""
            )
            + // render theater result (this iterates through results, remember?)
            `<li><button onclick="populateTheatreSidebar(${theatre.theatreId});">
                <b>${theatre.title}</b>
                 - 
                ${capitalCase(theatre.city)}
            </button></li>`
            +
            ( // close less relevant results details if it's the last result AND there were imperfect matches
                (index === theatres.length-1 && theatre.ratio <= 60) ?
                "</details>"
                : ""
            )
        ).join('')
        +"</ol>";

        // make the search-by refocus keyboard accessible
        document.getElementById('focus-search-by-input')?.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                this.click();
            };
        })
}

export async function lookupTheatres() {
    let query = document.getElementById('theatre-query-input').value;
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
