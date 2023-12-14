document.addEventListener('DOMContentLoaded', function () {
    // Fetch data and display on page load
    fetchDataAndDisplay();

    // Fetch data every 5 seconds (adjust as needed)
    setInterval(fetchDataAndDisplay, 5000);
});

function fetchDataAndDisplay() {
    fetch('excel.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Filter data for specific columns
            const filteredData = filterData(jsonData);

            // Display filtered data
            displayData(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function filterData(data) {
    // Index of columns to display
    const columnsToDisplay = ["MOTU PATLU", "SHIN-CHAN", "CHHOTA BHEEM", "TOM & JERRY"];

    // Find indices of columns to display
    const headerRow = data[0].map(cell => cell.toString().trim());
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
