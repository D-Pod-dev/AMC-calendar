const { HttpStatusCode } = axios;

const defaultTheatreSearchButtonText = document.getElementById('theatre-search-button').textContent

// render color-coded status code
function displayStatus(statusCode) {
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

function indicateSearching() {
    let searchButton = document.getElementById('theatre-search-button')
    
    loadingTimeoutReached = false;
    searchButton.disabled = true;
    
    return setTimeout(() => {
        searchButton.textContent = "Searching...";
    }, 300);
};

function resetTheatreSearchButton() {
    let searchButton = document.getElementById('theatre-search-button');

    searchButton.disabled = false;
    searchButton.textContent = defaultTheatreSearchButtonText;
}

function displayTheatreResults(theatres) {
    let resultsContainer = document.getElementById('theatre-results');
    resultsContainer.innerHTML = 
        "<h2>Theatre Results:</h2>"
        +"<ol id='theatre-list'>"
        +theatres.map((theatre, index) =>     
            (
                (index === 0 && theatre.ratio <= 60)
                ? ("<p style='margin-left: 1rem;'>No perfect matches.</p>")
                : ""
            )    
            +(
                (theatre.ratio <= 60 && 
                (index === 0 || theatres[index-1].ratio > 60))
                ? ("<div id='theatre-results-divider'>"
                    +"<hr>"
                    +"<details id='less-relevant-theatre-results'>"
                    +`<summary>Less relevant results (${theatres.length-index}) - click to show/hide</summary>`
                    +"<div>") 
                : ""
            )
            +"<li>"
            +`<b><a href="${theatre.url}">${theatre.title}</a></b> - ${theatre.city[0].toUpperCase()+theatre.city.slice(1).toLowerCase()}`
            +"</li>"
            +(
                (index === theatres.length-1 && theatre.ratio <= 60)
                ? "</div></details></div>"
                : ""
            )
        ).join('')
        +"</ol>";
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