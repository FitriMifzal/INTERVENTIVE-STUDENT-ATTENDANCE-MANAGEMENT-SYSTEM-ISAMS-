
  // 1. Ambil Parameter ID dari URL
  const params = new URLSearchParams(window.location.search);
  const classIdFromURL = params.get("id");

  // 2. Muat data dari LocalStorage
  let classes = JSON.parse(localStorage.getItem("classes")) || [];
  let selectedClass = classes.find(c => c.classId === classIdFromURL);

  // 3. Masukkan data ke dalam form jika class dijumpai
  if (classIdFromURL && !selectedClass) {
    alert("Class not found!");
    window.location.href = "main.html";
  } else if (selectedClass) {
    document.getElementById("classId").value = selectedClass.classId;
    document.getElementById("className").value = selectedClass.className;
    // Bahagian Credit Hour telah dibuang dari sini
  }

  // 4. Fungsi Update Data
  function updateClass() {
    const updatedName = document.getElementById("className").value.trim();

    if (!updatedName) {
      alert("Please fill in the Class Name!");
      return;
    }

    if (selectedClass) {
        selectedClass.className = updatedName;
        // Penukaran nilai creditHour telah dibuang dari sini
        localStorage.setItem("classes", JSON.stringify(classes));
        alert("Class updated successfully!");
        window.location.href = "StudentClass.html";
  }

  // 5. Setup Profil & Sidebar semasa Page Load
  window.onload = function () {
    const storedName = localStorage.getItem('reg_name') || "Guest User";
    const storedRole = localStorage.getItem('reg_role') || "Staff";

    document.getElementById('user-fullname').innerText = storedName;
    document.getElementById('display-role').innerText = storedRole;
    document.getElementById('user-initial').innerText = storedName.charAt(0).toUpperCase();

    if (storedRole === "Penyelaras Intervensi") {
      const accountNav = document.getElementById('nav-account');
      if (accountNav) accountNav.style.display = 'flex';
    }
  };

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
  }

  function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
      window.location.href = "../create-account/CreateAccount.html";
    }
  }

