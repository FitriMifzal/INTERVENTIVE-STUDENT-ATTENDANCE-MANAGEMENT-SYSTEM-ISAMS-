/* ============================================================
   STUDENTLIST.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);
    // Load students into table
    loadStudents();
});

/* ────────────────────────────────────────────────────────
   LOAD STUDENTS FROM LOCALSTORAGE
────────────────────────────────────────────────────────── */

function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No students found. <a href="../Create-Student/createStudent.html">Create one</a></td>
            </tr>
        `;
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement("tr");
        
        // Get student name - try both formats
        const studentName = student.stu_name || student.name || 'N/A';
        const studentIc = student.stu_ic || student.ic || 'N/A';
        
        // Find class name from class_id
        let className = 'N/A';
        if (student.class_id) {
            const classObj = classes.find(c => (c.class_id || c.classId || c.classCode) == student.class_id);
            if (classObj) {
                className = classObj.class_name || classObj.className || classObj.classCode || 'N/A';
            }
        }

        // Use stu_id for unique identification, fallback to index
        const studentId = student.stu_id || index;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${studentName}</td>
            <td>${studentIc}</td>
            <td>${className}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-table-action btn-view" onclick="viewStudent(${studentId})">View</button>
                    <button class="btn-table-action btn-update" onclick="updateStudent(${studentId})">Update</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/* ────────────────────────────────────────────────────────
   SEARCH FUNCTIONALITY
────────────────────────────────────────────────────────── */

function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.querySelector("table");
    const rows = table.getElementsByTagName("tr");

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length === 0) continue;

        const name = cells[1] ? cells[1].textContent.toUpperCase() : "";
        const ic = cells[2] ? cells[2].textContent.toUpperCase() : "";
        const kelas = cells[3] ? cells[3].textContent.toUpperCase() : "";

        if (name.includes(filter) || ic.includes(filter) || kelas.includes(filter)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

/* ────────────────────────────────────────────────────────
   VIEW STUDENT DETAILS - Navigate to ViewStudent page
────────────────────────────────────────────────────────── */

function viewStudent(studentId) {
    window.location.href = "../View-Student/ViewStudent.html?id=" + studentId;
}

/* ────────────────────────────────────────────────────────
   UPDATE STUDENT - Navigate to UpdateStudent page
────────────────────────────────────────────────────────── */

function updateStudent(studentId) {
    window.location.href = "../Update-Student/UpdateStudent.html?id=" + studentId;
}

/* ────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
────────────────────────────────────────────────────────── */

function toggleProfile() {
    var profileSection = document.getElementById('profile-section');
    var welcomeCard = document.getElementById('welcome-card');

    if (profileSection) {
        var isHidden = profileSection.style.display === 'none' || profileSection.style.display === '';
        profileSection.style.display = isHidden ? 'block' : 'none';
    }
    if (welcomeCard) {
        var isHidden = welcomeCard.style.display === 'none' || welcomeCard.style.display === '';
        welcomeCard.style.display = isHidden ? 'none' : 'block';
    }
}