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

let students = JSON.parse(localStorage.getItem("students")) || [];

function renderTable() {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    students.forEach((s, i) => {
        const tr = document.createElement("tr");
        tr.onclick = () => goToView(i);

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${s.name}</td>
            <td>${s.ic}</td>
            <td>${s.cls}</td>
            <td onclick="event.stopPropagation()">
                <div class="action-cell">
                    <button class="btn-update" onclick="goToUpdate(${i}, event)">Update</button>
                    <button class="btn-row-absent" onclick="goToAbsent(${i}, event)">Absent Record</button>
                    <button class="delete-icon-only" onclick="removeStudent(${i}, event)">🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function searchTable() {
    const filter = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll("#studentTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
}

function goToView(index) {
    window.location.href = "viewStudent.html?id=" + index;
}

function goToUpdate(index, event) {
    event.stopPropagation();
    window.location.href = "updateStudent.html?id=" + index;
}

function goToAbsent(index, event) {
    event.stopPropagation();
    // Menghantar index pelajar ke halaman absent record
    window.location.href = "absent_record.html?student_id=" + index;
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

function removeStudent(index, event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        renderTable();
        alert("Student profile deleted successfully!");
    }
}

window.onload = function() {
    loadProfile();
    renderTable();
};