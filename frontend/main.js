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
    document.getElementById('theatre-debug-data').textContent = data;
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

async function lookupTheatres(query) {
    let loadingTimeout = indicateSearching();
    displayDebugData();

    const response = await fetch(`/api/theatre-lookup?${new URLSearchParams({ query })}`);
    
    const data = await response.json();
    
    // render color-coded status code
    displayStatus(response.status);
    clearTimeout(loadingTimeout);
    resetTheatreSearchButton();
    
    // report result of API call
    if (response.ok) {
        displayDebugData(data);
    } else {
        displayDebugData(data.detail);
    };
};

// make enter key submit search
document.getElementById('query-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        lookupTheatres(document.getElementById('query-input').value);
    };
});