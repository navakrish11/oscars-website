let oscarsData = null;

fetch('oscar.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data loaded successfully:', data);
        oscarsData = data;
    })
    .catch(error => {
        console.error('Error loading oscar.json:', error);
        document.getElementById('results').innerHTML = '<p>Error loading data. Please try again later.</p>';
    });

function displayResults() {
    const resultsDiv = document.getElementById('results');
    if (!oscarsData) {
        resultsDiv.innerHTML = '<p>Data is not loaded yet. Please wait or refresh the page.</p>';
        return;
    }

    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value) || startYear;
    resultsDiv.innerHTML = '';

    console.log('Start Year:', startYear, 'End Year:', endYear);

    if (isNaN(startYear) || startYear < 1929 || startYear > 2025) {
        resultsDiv.innerHTML = '<p>Please enter a valid start year between 1929 and 2025.</p>';
        return;
    }
    if (isNaN(endYear) || endYear < 1929 || endYear > 2025 || endYear < startYear) {
        resultsDiv.innerHTML = '<p>Please enter a valid end year between 1929 and 2025, not less than start year.</p>';
        return;
    }

    const filteredData = oscarsData.filter(item => item.Year >= startYear && item.Year <= endYear);

    console.log('Filtered Data:', filteredData);

    if (filteredData.length === 0) {
        resultsDiv.innerHTML = '<p>No data found for the selected year range.</p>';
        return;
    }

    if (filteredData.length === 1) {
        const yearData = filteredData[0];
        let html = `<h2>${yearData.Year}</h2><table><tr><th>Category</th><th>Winner</th></tr>`;
        for (let category in yearData) {
            const winner = yearData[category];
            if (winner !== 'NA' && category !== 'Year') {
                html += `<tr><td>${category}</td><td>${winner}</td></tr>`;
            }
        }
        html += '</table>';
        resultsDiv.innerHTML = html;
    } else {
        let table = '<table><tr><th>Year</th>';
        const headers = Object.keys(filteredData[0] || {}).filter(key => key !== 'Year');
        headers.forEach(header => table += `<th>${header}</th>`);
        table += '</tr>';

        filteredData.forEach(item => {
            table += `<tr><td>${item.Year}</td>`;
            headers.forEach(header => table += `<td>${item[header] || 'NA'}</td>`);
            table += '</tr>';
        });
        table += '</table>';
        resultsDiv.innerHTML = table;
    }
}

function showTopWinners() {
    const resultsDiv = document.getElementById('results');
    if (!oscarsData) {
        resultsDiv.innerHTML = '<p>Data is not loaded yet. Please wait or refresh the page.</p>';
        return;
    }

    const category = document.getElementById('category').value;
    if (!category) return;

    resultsDiv.innerHTML = '';

    const winners = {};
    oscarsData.forEach(item => {
        const winner = item[category];
        if (winner && winner !== 'NA') {
            const name = winner.replace(/\s*\([^)]+\)/, '').trim();
            winners[name] = (winners[name] || 0) + 1;
        }
    });

    const sortedWinners = Object.entries(winners)
        .sort((a, b) => b[1] - a[1]);

    if (sortedWinners.length === 0) {
        resultsDiv.innerHTML = '<p>No winners found for this category.</p>';
        return;
    }

    let table = '<table><tr><th>Winner</th><th>Number of Awards</th></tr>';
    sortedWinners.forEach(([name, count]) => {
        table += `<tr><td>${name}</td><td>${count} time${count > 1 ? 's' : ''}</td></tr>`;
    });
    table += '</table>';
    resultsDiv.innerHTML = `<h2>Top ${category} Winners</h2>${table}`;
}
