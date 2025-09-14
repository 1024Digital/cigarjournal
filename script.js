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
});
