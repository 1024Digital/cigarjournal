document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cigarForm');
  const tableBody = document.getElementById('cigarTableBody');
  const submitBtn = form.querySelector('button[type="submit"]');

  let cigars = JSON.parse(localStorage.getItem('cigars')) || [];
  let editIndex = null;

  // Render all saved cigars
  cigars.forEach((cigar, index) => renderCigarRow(cigar, index));

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const cigar = {
      name: document.getElementById('cigarName').value.trim(),
      size: document.getElementById('cigarSize').value.trim(),
      brand: document.getElementById('cigarBrand').value.trim(),
      binder: document.getElementById('Binder').value.trim(),
      filler: document.getElementById('Filler').value.trim(),
      wrapper: document.getElementById('Wrapper').value.trim(),
      origin: document.getElementById('Origin').value.trim(),
      rating: document.getElementById('Rating').value,
      notes: document.getElementById('Notes').value.trim()
    };

    if (editIndex === null) {
      cigars.push(cigar);
    } else {
      cigars[editIndex] = cigar;
      editIndex = null;
      submitBtn.textContent = "Add";
    }

    localStorage.setItem('cigars', JSON.stringify(cigars));
    renderTable();
    form.reset();
  });

  function renderTable() {
    tableBody.innerHTML = '';
    cigars.forEach((cigar, index) => renderCigarRow(cigar, index));
  }

  function renderCigarRow(cigar, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cigar.name}</td>
      <td>${cigar.size}</td>
      <td>${cigar.brand}</td>
      <td>${cigar.binder}</td>
      <td>${cigar.filler}</td>
      <td>${cigar.wrapper}</td>
      <td>${cigar.origin}</td>
      <td>${cigar.rating}</td>
      <td>${cigar.notes}</td>
      <td>
        <button class="btn btn-sm btn-warning mr-1" onclick="editCigar(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCigar(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  window.deleteCigar = function (index) {
    cigars.splice(index, 1);
    localStorage.setItem('cigars', JSON.stringify(cigars));
    renderTable();
  };

  window.editCigar = function (index) {
    const cigar = cigars[index];
    document.getElementById('cigarName').value = cigar.name;
    document.getElementById('cigarSize').value = cigar.size;
    document.getElementById('cigarBrand').value = cigar.brand;
    document.getElementById('Binder').value = cigar.binder;
    document.getElementById('Filler').value = cigar.filler;
    document.getElementById('Wrapper').value = cigar.wrapper;
    document.getElementById('Origin').value = cigar.origin;
    document.getElementById('Rating').value = cigar.rating;
    document.getElementById('Notes').value = cigar.notes;

    editIndex = index;
    submitBtn.textContent = "Update";
  };
document.getElementById('exportExcelBtn').addEventListener('click', () => {
  const cigars = JSON.parse(localStorage.getItem('cigars')) || [];

  if (cigars.length === 0) {
    alert("No records to export.");
    return;
  }

  // Convert array of objects to worksheet
  const worksheet = XLSX.utils.json_to_sheet(cigars);

  // Create a new workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cigar Journal");

  // Save to file
  XLSX.writeFile(workbook, "Cigar_Journal.xlsx");
});

document.getElementById('importExcelInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const importedData = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(importedData) || importedData.length === 0) {
      alert("Excel file appears to be empty or improperly formatted.");
      return;
    }

    // Merge into existing cigars or replace entirely (here we merge)
    cigars = [...cigars, ...importedData];
    localStorage.setItem('cigars', JSON.stringify(cigars));
    renderTable();
    alert("Records imported successfully!");
  };

  reader.readAsArrayBuffer(file);
});

let currentSortColumn = null;
let currentSortDirection = 'asc';

window.sortTableBy = function (column) {
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = column;
    currentSortDirection = 'asc';
  }

  cigars.sort((a, b) => {
    let valA = a[column]?.toString().toLowerCase() || '';
    let valB = b[column]?.toString().toLowerCase() || '';

    if (!isNaN(valA) && !isNaN(valB)) {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }

    if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  renderTable();
};



});
