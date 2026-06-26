function loadProfile() {
    const name = localStorage.getItem('reg_name');
    const role = localStorage.getItem('reg_role');
    const accountNav = document.getElementById('nav-account');
    
    if (name) {
        const fullnameElem = document.getElementById('user-fullname');
        const initialElem = document.getElementById('user-initial');
        
        if (fullnameElem) fullnameElem.innerText = name;
        if (initialElem) initialElem.innerText = name.trim().charAt(0).toUpperCase();
    }
    
    if (role) {
        const roleDisplay = document.getElementById('display-role') || document.getElementById('sidebar-role');
        if (roleDisplay) {
            roleDisplay.innerText = role;
        }
        
        if (role !== "Penyelaras Intervensi") {
            if (accountNav) accountNav.style.display = 'none';
        }
    }
}

// Kawalan Buka/Tutup Submenu dan Pewarnaan Kotak Utama Khas (Don Norman - Feedback)
function toggleSubjectSubmenu() {
    const submenu = document.getElementById('subject-submenu');
    const menuBtn = document.getElementById('subject-menu-btn');
    
    if (submenu && menuBtn) {
        submenu.classList.toggle('show');
        menuBtn.classList.toggle('menu-active');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.getElementById('main-wrapper');
    
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (mainWrapper) mainWrapper.classList.toggle('expanded');
}

function saveStudent() {
    const name = document.getElementById("name").value;
    const ic = document.getElementById("ic").value;
    const cls = document.getElementById("cls").value;
    const addr = document.getElementById("address").value;
    const No = document.getElementById("No").value;

    if (!name || !ic || !cls || !addr || !No) {
        alert("Error: Please fill in all student details before saving.");
        return;
    }
    if (ic.length != 12 || isNaN(ic)) {
        alert("Error: IC Number must contain exactly 12 digits.");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push({ name, ic, cls, address: addr, No});
    localStorage.setItem("students", JSON.stringify(students));
    alert("Student profile created successfully!");
    window.location.href = "../Student-List/StudentList.html";
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = "../Login/Login.html";
    }
}