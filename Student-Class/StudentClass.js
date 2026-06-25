function loadProfile() {
    const name = localStorage.getItem('reg_name');
    const role = localStorage.getItem('reg_role');
    const accountNav = document.getElementById('nav-account');

    if (name) {
        document.getElementById('user-fullname').innerText = name;
        document.getElementById('user-initial').innerText = name.trim().charAt(0).toUpperCase();
    }

    if (role) {
        document.getElementById('display-role').innerText = role;
        if (role !== "Penyelaras Intervensi") {
            if (accountNav) accountNav.style.display = 'none';
        }
    }
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    const tbody = document.getElementById('classTableBody');
    tbody.innerHTML = '';

    if (classes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">No classes found. Click Create Class to add one.</td>
            </tr>
        `;
        return;
    }

    classes.forEach((cls, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${cls.classId}</td>
            <td>${cls.className}</td>
            <td class="action-cell">
                <button class="btn-update" onclick="goToUpdate('${encodeURIComponent(cls.classId)}')">Update</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function searchTable() {
    const filter = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#classTableBody tr').forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

function goToCreate() {
    window.location.href = 'CreateStudentClass.html';
}

function goToUpdate(classId) {
    window.location.href = `../Update-Student-Class/UpdateStudentClass.html?id=${classId}`;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

function logoutUser() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../create-account/CreateAccount.html';
    }
}

window.onload = function() {
    loadProfile();
    loadClasses();
};
