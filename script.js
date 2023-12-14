document.addEventListener('DOMContentLoaded', function () {
    // Load the Google Sheets API
    gapi.load('client', initClient);
});

function initClient() {
    // Initialize the Google Sheets API client
    gapi.client.init({
        apiKey: 'AIzaSyCkGy5M-SB1CWT3xbAlUuTthgWKLn2jPfs', // Replace with your API key
    }).then(function () {
        // Fetch data and display on page load
        fetchDataAndDisplay();

        // Fetch data every 5 seconds (adjust as needed)
        setInterval(fetchDataAndDisplay, 5000);
    }).catch(function (error) {
        console.error('Error initializing Google Sheets API client:', error);
    });
}

function fetchDataAndDisplay() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1t6KEmxqt6DIpJuSdwMM-FmjiM4Y5UdTo1sRxfAlmdLk',
        range: 'Sheet1', // Adjust sheet name as needed
    }).then(function(response) {
        const jsonData = response.result.values;

        // Filter data for specific columns
        const filteredData = filterData(jsonData);

        // Display filtered data
        displayData(filteredData);
    }).catch(function(error) {
        console.error('Error fetching data:', error);
    });
}

// Replace this function with the one that fits your Google Sheets API response format
function filterData(data) {
    // Assuming the first row contains column names
    const columnsToDisplay = ["Motu Patlu", "Shin-Chan", "Chhota Bheem", "Tom & Jerry"];

    // Find indices of columns to display
    const headerRow = data[0];
    const columnIndices = columnsToDisplay.map(column => headerRow.indexOf(column));

    // Filter data based on column indices
    const filteredData = data.map(row => columnIndices.map(index => row[index]));

    return filteredData;
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create table header
    for (const header of data[0]) {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        for (const cell of data[i]) {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}
