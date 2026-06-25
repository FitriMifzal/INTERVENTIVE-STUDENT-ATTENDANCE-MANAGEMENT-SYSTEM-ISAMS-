const params = new URLSearchParams(window.location.search);
const classIdFromURL = params.get("id");

let classes = JSON.parse(localStorage.getItem("classes")) || [];
let selectedClass = classes.find(c => c.classId === classIdFromURL);

// Pengesahan data kelas daripada parameter URL
if (classIdFromURL && !selectedClass) {
  alert("Class not found!");
  window.location.href = "main.html";
} else if (selectedClass) {
  document.getElementById("classId").value = selectedClass.classId;
  document.getElementById("className").value = selectedClass.className;
}

// Fungsi mengemas kini maklumat kelas
function updateClass() {
  const updatedName = document.getElementById("className").value.trim();

  if (!updatedName) {
    alert("Please fill in the Class Name!");
    return;
  }

  if (selectedClass) {
      selectedClass.className = updatedName;
      localStorage.setItem("classes", JSON.stringify(classes));
      alert("Class updated successfully!");
      window.location.href = "main.html";
  }
}

// Fungsi kawalan semasa halaman dimuatkan (Urusan sesi & profil maklumat)
window.onload = function () {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = "login.html";
      return;
  }

  const storedName = localStorage.getItem('active_name') || "Guest User";
  const storedRole = localStorage.getItem('active_role') || "Subject Teacher";

  document.getElementById('user-fullname').innerText = storedName;
  document.getElementById('display-role').innerText = storedRole;
  document.getElementById('user-initial').innerText = storedName.charAt(0).toUpperCase();

  if (storedRole === "Penyelaras Intervensi") {
    const accountNav = document.getElementById('nav-account');
    if (accountNav) accountNav.style.display = 'flex';
  }
};

// Fungsi interaksi sidebar toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('main-wrapper').classList.toggle('expanded');
}

// Fungsi log keluar sistem
function logoutUser() {
  if(confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
  }
}