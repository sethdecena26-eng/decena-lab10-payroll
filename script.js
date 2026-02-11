const form = document.getElementById("payrollForm");
const tbody = document.getElementById("payrollTbody");
const empName = document.getElementById("empName");
const hours = document.getElementById("hours");
const rate = document.getElementById("rate");
const tax = document.getElementById("tax");
const otherDed = document.getElementById("otherDed");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const msg = document.getElementById("msg");
const sumEmployees = document.getElementById("sumEmployees");
const sumGross = document.getElementById("sumGross");
const sumDed = document.getElementById("sumDed");
const sumNet = document.getElementById("sumNet");
let editRow = null;


const peso = num => `₱${num.toFixed(2)}`;

function updateSummary() {
  let employees = tbody.rows.length;
  let grossTotal = 0;
  let dedTotal = 0;
  let netTotal = 0;

  [...tbody.rows].forEach(row => {
    grossTotal += parseFloat(row.dataset.gross);
    dedTotal += parseFloat(row.dataset.ded);
    netTotal += parseFloat(row.dataset.net);
  });

  sumEmployees.textContent = employees;
  sumGross.textContent = peso(grossTotal);
  sumDed.textContent = peso(dedTotal);
  sumNet.textContent = peso(netTotal);
}

function resetForm() {
  form.reset();
  submitBtn.textContent = "Add Payroll";
  editRow = null;
  msg.textContent = "";
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const h = parseFloat(hours.value);
  const r = parseFloat(rate.value);
  const t = parseFloat(tax.value);
  const o = parseFloat(otherDed.value);
  const gross = h * r;
  const taxDeduction = gross * (t / 100);
  const net = gross - taxDeduction - o;

  if (editRow) {
    editRow.children[1].textContent = empName.value;
    editRow.children[2].textContent = h;
    editRow.children[3].textContent = r;
    editRow.children[4].textContent = peso(gross);
    editRow.children[5].textContent = peso(taxDeduction);
    editRow.children[6].textContent = peso(o);
    editRow.children[7].textContent = peso(net);
    editRow.dataset.gross = gross;
    editRow.dataset.ded = taxDeduction + o;
    editRow.dataset.net = net;
    msg.textContent = "Payroll updated successfully ✔";
  } 
  else {
    const tr = document.createElement("tr");

    tr.dataset.gross = gross;
    tr.dataset.ded = taxDeduction + o;
    tr.dataset.net = net;

    tr.innerHTML = `
      <td>${tbody.rows.length + 1}</td>
      <td>${empName.value}</td>
      <td>${h}</td>
      <td>${r}</td>
      <td>${peso(gross)}</td>
      <td>${peso(taxDeduction)}</td>
      <td>${peso(o)}</td>
      <td>${peso(net)}</td>
      <td>
        <button class="secondary editBtn">Edit</button>
        <button class="secondary danger delBtn">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
    msg.textContent = "Payroll added ✔";
  }

  renumberRows();
  updateSummary();
  resetForm();
});

tbody.addEventListener("click", e => {
  const row = e.target.closest("tr");

  if (e.target.classList.contains("editBtn")) {
    editRow = row;

    empName.value = row.children[1].textContent;
    hours.value = row.children[2].textContent;
    rate.value = row.children[3].textContent;
    tax.value = (parseFloat(row.children[5].textContent.replace("₱","")) /
                parseFloat(row.children[4].textContent.replace("₱",""))) * 100;
    otherDed.value = row.children[6].textContent.replace("₱","");

    submitBtn.textContent = "Update Payroll";
    msg.textContent = "Editing payroll record...";
  }

  if (e.target.classList.contains("delBtn")) {
    row.remove();
    renumberRows();
    updateSummary();
  }
});
resetBtn.addEventListener("click", resetForm);
clearAllBtn.addEventListener("click", () => {
  tbody.innerHTML = "";
  updateSummary();
  resetForm();
});
function renumberRows() {
  [...tbody.rows].forEach((row, i) => {
    row.children[0].textContent = i + 1;
  });
}
