fetch('oscars.json')
    .then(response => response.json())
    .then(data => {
        window.oscarsData = data;
    });

function displayResults() {
    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value) || startYear;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const filteredData = oscarsData.filter(item => item.Year >= startYear && item.Year <= endYear);

    if (filteredData.length === 1) {
        // Single year display
        const yearData = filteredData[0];
        resultsDiv.innerHTML = `
            <h2>${yearData.Year}</h2>
            <p>Best Actor in a Leading Role: ${yearData["Best Actor in a Leading Role"]}</p>
            <p>Best Actor in a Supporting Role: ${yearData["Best Actor in a Supporting Role"]}</p>
            <p>Best Actress in a Leading Role: ${yearData["Best Actress in a Leading Role"]}</p>
            <!-- Add more fields as needed -->
        `;
    } else {
        // Multi-year table
        let table = '<table><tr><th>Year</th>';
        const headers = Object.keys(filteredData[0]).filter(key => key !== 'Year');
        headers.forEach(header => table += `<th>${header}</th>`);
        table += '</tr>';

        filteredData.forEach(item => {
            table += `<tr><td>${item.Year}</td>`;
            headers.forEach(header => table += `<td>${item[header]}</td>`);
            table += '</tr>';
        });
        table += '</table>';
        resultsDiv.innerHTML = table;
    }
}

function showTopWinners() {
    const category = document.getElementById('category').value;
    if (!category) return;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const winners = {};
    oscarsData.forEach(item => {
        const winner = item[category];
        if (winner && winner !== 'NA') {
            winners[winner] = (winners[winner] || 0) + 1;
        }
    });

    const sortedWinners = Object.entries(winners)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => `${name}: ${count} time${count > 1 ? 's' : ''}`);

    resultsDiv.innerHTML = `<h2>Top ${category} Winners</h2><ul>${sortedWinners.map(w => `<li>${w}</li>`).join('')}</ul>`;
}