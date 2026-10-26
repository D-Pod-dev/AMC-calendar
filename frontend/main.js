const { HttpStatusCode } = axios;

// render color-coded status code
function displayStatus(statusCode) {
    document.getElementById('status-message').innerHTML = 
        `<span style="color: ${
            {1: 'gray', 2: 'limegreen', 3: 'yellow', 4: 'red', 5: 'red'}
            [Math.floor(statusCode/100)]
        };">${statusCode}</span> | ${HttpStatusCode[statusCode]}`;
};

async function lookupTheatres(query) {
    const response = await fetch(`/api/theatre-lookup?${new URLSearchParams({ query })}`);
    const data = await response.json();
    
    // render color-coded status code
    displayStatus(response.status);
    
    // report result of API call
    if (response.ok) {
        document.getElementById('theatre-results').innerHTML = 
        `<br><b>API Works! | Query: </b> ${data.message}`;
    } else {
        document.getElementById('theatre-results').innerHTML = 
        "<br><b>API Error! Response: </b><br>"+
        `<pre><code>${response}</code></pre>`;
    };
};

// make enter key submit search
document.getElementById('query-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        lookupTheatres(document.getElementById('query-input').value);
    };
});