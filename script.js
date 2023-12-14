// Client ID and API key from the Developer Console
const CLIENT_ID = '956573485064-mp6svn15vc107k71dg4ba8taqj579gs0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCkGy5M-SB1CWT3xbAlUuTthgWKLn2jPfs';

// Array of API discovery doc URLs for different APIs
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

// Function to initialize the Google Sheets API client
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Function to initialize the Google Sheets API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    }).catch(function (error) {
        console.error('Error initializing Google Sheets API client:', error);
    });
}

// Function to update the sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        fetchDataAndDisplay();
        setInterval(fetchDataAndDisplay, 5000);
    }
}

// Function to fetch data from Google Sheets API and display on the page
function fetchDataAndDisplay() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
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

// Function to display data on the page
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
