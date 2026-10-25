async function lookupTheatres(query) {
    const response = await fetch(`/api/test?${new URLSearchParams({ query })}`, {
        method: 'GET',
        redirect: 'error'
    });
    const data = await response.json();

    document.getElementById('status-message').textContent = data.message;
}