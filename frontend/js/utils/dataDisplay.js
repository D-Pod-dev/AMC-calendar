const { HttpStatusCode } = axios;

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

export function displayDebugData(data) {
    document.getElementById('theatre-debug-data').textContent = JSON.stringify(data, null, 2);
};

