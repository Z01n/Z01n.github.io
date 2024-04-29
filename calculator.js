document.addEventListener('DOMContentLoaded', () => {
    populateInitialData();
    document.getElementById('updateTableButton').addEventListener('click', updateTable);
    document.getElementById('calculateQDPButton').addEventListener('click', calculateQDP);
});

function populateInitialData() {
    const classData = [
        { start: 8001, end: 9000, frequency: 540 },
        { start: 9001, end: 10000, frequency: 600 },
        { start: 10001, end: 11000, frequency: 580 },
        { start: 11001, end: 12000, frequency: 550 },
        { start: 12001, end: 13000, frequency: 450 },
        { start: 13001, end: 14000, frequency: 500 },
        { start: 14001, end: 15000, frequency: 400 }
    ];
    const table = document.getElementById('data-table');
    classData.forEach(item => {
        const row = table.insertRow();
        Object.keys(item).forEach((key, index) => {
            let cell = row.insertCell();
            let input = document.createElement('input');
            input.type = 'number';
            input.value = item[key];
            input.className = 'editable';
            input.oninput = updateTable;  // Recalculate when any input changes
            cell.appendChild(input);
        });
        row.insertCell(); // Cell for Lower Boundary
        row.insertCell(); // Cell for Cumulative Frequency
    });
}

function updateTable() {
    let cumulativeFrequency = 0;
    const rows = document.querySelectorAll('#data-table tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('input');
        const start = parseInt(cells[0].value, 10);
        const frequency = parseInt(cells[2].value, 10);

        const lowerBoundary = start - 0.5;
        cumulativeFrequency += frequency;

        const lbCell = row.cells[3];
        lbCell.textContent = lowerBoundary.toFixed(1);

        const cfCell = row.cells[4];
        cfCell.textContent = cumulativeFrequency;
    });
}

function calculateQDP() {
    const type = document.getElementById('typeInput').value.toUpperCase();
    const value = parseInt(document.getElementById('valueInput').value, 10);
    let position, totalFrequency = 0;
    Array.from(document.querySelectorAll('#data-table tr')).forEach(row => {
        totalFrequency += parseInt(row.querySelectorAll('input')[2].value, 10);
    });

    switch (type) {
        case 'Q': // Quartile
            position = totalFrequency * value / 4;
            break;
        case 'D': // Decile
            position = totalFrequency * value / 10;
            break;
        case 'P': // Percentile
            position = totalFrequency * value / 100;
            break;
        default:
            document.getElementById('result').textContent = 'Invalid type!';
            return;
    }

    let cumulative = 0;
    let result = "Not Found";
    Array.from(document.querySelectorAll('#data-table tr')).some(row => {
        const start = parseInt(row.querySelectorAll('input')[0].value, 10);
        const end = parseInt(row.querySelectorAll('input')[1].value, 10);
        const freq = parseInt(row.querySelectorAll('input')[2].value, 10);
        const previousCumulative = cumulative;
        cumulative += freq;
        if (cumulative >= position) {
            const cf = previousCumulative;
            const f = freq;
            const L = start - 0.5;
            const c = end - start;
            const QDP = L + ((position - cf) / f) * c;
            result = `${type}${value} is approximately ${QDP.toFixed(2)}`;
            return true; // Stop the loop
        }
        return false; // Continue the loop
    });

    document.getElementById('result').textContent = result;
}
