function loadProfile() {
    const name = localStorage.getItem('reg_name');
    const role = localStorage.getItem('reg_role');
    const accountNav = document.getElementById('nav-account');
    
    if (name) {
        document.getElementById('user-fullname').innerText = name;
        document.getElementById('user-initial').innerText = name.trim().charAt(0).toUpperCase();
    }
    
    if (role) {
        document.getElementById('sidebar-role').innerText = role;
        if (role !== "Penyelaras Intervensi") {
            if (accountNav) accountNav.style.display = 'none';
        }
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const students = JSON.parse(localStorage.getItem("students")) || [];

function loadStudentData() {
    const s = students[id];
    if (s) {
        document.getElementById("name").value = s.name || "";
        document.getElementById("ic").value = s.ic || "";
        document.getElementById("cls").value = s.cls || "";
        document.getElementById("address").value = s.address || "";
        document.getElementById("No").value = s.No || "";
       
    }
}

function saveUpdate() {
    const name = document.getElementById("name").value;
    const ic = document.getElementById("ic").value;
    const cls = document.getElementById("cls").value;
    const address = document.getElementById("address").value;
    const No = document.getElementById("No").value;

    if (!name || !ic || !cls || !address || !No) {
        alert("Please fill in all details!");
        return;
    }
    if (ic.length != 12 || isNaN(ic)) {
        alert("Error: IC Number must contain exactly 12 digits.");
        return;
    }

    students[id] = {
        name: name,
        ic: ic,
        cls: cls,
        address: address,
        No: No
    };

    // Simpan ke LocalStorage
    localStorage.setItem("students", JSON.stringify(students));

    // 1. Tunjukkan mesej berjaya
    alert("Success! Student profile has been updated.");

    // 2. Kembali ke student-list.html selepas user tekan 'OK'
    window.location.href = "studentList.html";
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "login.html";
    }
}

window.onload = function() {
    loadProfile();
    loadStudentData();
};