document.getElementById('cigarForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const size = document.getElementById('size').value;
    const company = document.getElementById('company').value;
    const filler = document.getElementById('filler').value;
    const wrapper = document.getElementById('wrapper').value;
    const binder = document.getElementById('binder').value;
    const quality = document.getElementById('quality').value;
    const notes = document.getElementById('notes').value;

    // Create a new row
    const table = document.getElementById('cigarTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Insert cells
    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = size;
    newRow.insertCell(2).textContent = company;
    newRow.insertCell(3).textContent = filler;
    newRow.insertCell(4).textContent = wrapper;
    newRow.insertCell(5).textContent = binder;
    newRow.insertCell(6).textContent = quality;
    newRow.insertCell(7).textContent = notes;

    // Clear the form
    document.getElementById('cigarForm').reset();
});
