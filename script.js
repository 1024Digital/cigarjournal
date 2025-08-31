// Replace with your actual values from Supabase Dashboard
const SUPABASE_URL = 'https://luwtatdmiqisbqvunfit.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1d3RhdGRtaXFpc2JxdnVuZml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjIxNjUsImV4cCI6MjA3MjEzODE2NX0.zJxKcPRXEDVq7mMlg1WjjQBvEH3iPuAVN-zZ0NclpVQ';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('cigarForm');
const tableBody = document.getElementById('cigarTableBody');

// Fetch and display cigars
async function loadCigars() {
  const { data, error } = await supabase.from('cigars').select('*');
  if (error) {
    console.error('Error loading cigars:', error.message);
    alert("Failed to load cigars.");
    return;
  }
  tableBody.innerHTML = '';
  data.forEach(appendCigarRow);
}

loadCigars();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cigar = {
    name: document.getElementById('Name').value,
    size: document.getElementById('Size').value,
    brand: document.getElementById('Brand').value,
    binder: document.getElementById('Binder').value,
    filler: document.getElementById('Filler').value,
    wrapper: document.getElementById('Wrapper').value,
    origin: document.getElementById('Origin').value,
    rating: parseInt(document.getElementById('Rating').value),
    notes: document.getElementById('Notes').value
  };

  const button = e.target.querySelector('button[type="submit"]');
  button.disabled = true;
  button.innerText = "Saving...";

  const { data, error } = await supabase.from('cigars').insert([cigar]);

  button.disabled = false;
  button.innerText = "Add";

  if (error) {
    console.error("Insert failed:", error.message);
    alert("Failed to add cigar.");
  } else {
    appendCigarRow(data[0]);
    form.reset();
    alert("Cigar added successfully!");
  }
});


function appendCigarRow(cigar) {
  const row = document.createElement('tr');
  row.setAttribute('data-id', cigar.id);
  row.innerHTML = `
    <td>${cigar.Name}</td>
    <td>${cigar.Size}</td>
    <td>${cigar.Brand}</td>
    <td>${cigar.Binder}</td>
    <td>${cigar.Filler}</td>
    <td>${cigar.Wrapper}</td>
    <td>${cigar.Origin}</td>
    <td>${cigar.Rating}</td>
    <td>${cigar.Notes}</td>
    <td><button class="btn btn-sm btn-danger delete-btn">Delete</button></td>
  `;
  tableBody.appendChild(row);
}

// Delete cigar from Supabase
tableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('tr');
    const id = row.getAttribute('data-id');

    if (!confirm("Are you sure you want to delete this cigar entry?")) return;

    const { error } = await supabase.from('cigars').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error.message);
      alert("Failed to delete cigar.");
    } else {
      row.remove();
      alert("Cigar deleted.");
    }
  }
});

