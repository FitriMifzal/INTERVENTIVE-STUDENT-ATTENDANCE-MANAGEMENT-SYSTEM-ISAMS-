function loadClasses() {
  const classes = JSON.parse(localStorage.getItem("classes")) || [];
  const table = document.getElementById("classTable");
  table.innerHTML = "";

  if (classes.length === 0) {
    table.innerHTML = `<tr><td colspan="4">No classes found</td></tr>`;
    return;
  }

  classes.forEach((c, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.classId}</td>
      <td>${c.className}</td>
      <td>
        <button class="btn-update" 
                onclick="window.location.href='updatestudentclass.html?id=${c.classId}'">Update</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('main-wrapper').classList.toggle('expanded');
}

function logoutUser() {
  if(confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
  }
}

window.onload = function() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = "login.html";
    return;
  }

  loadClasses();

  const name = localStorage.getItem('active_name') || "Guest User";
  const role = localStorage.getItem('active_role') || "Subject Teacher";

  document.getElementById('user-fullname').innerText = name;
  document.getElementById('display-role').innerText = role;
  document.getElementById('user-initial').innerText = name.charAt(0).toUpperCase();

  if (role === "Penyelaras Intervensi") {
    const navAccount = document.getElementById('nav-account');
    if(navAccount) navAccount.style.display = 'flex';
  }

  if (role === "Subject Teacher") {
    const createBtn = document.querySelector(".btn-create");
    if (createBtn) createBtn.style.display = "none";
  }
};