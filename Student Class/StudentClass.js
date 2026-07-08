/* ============================================================
   STUDENTCLASS.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    sessionStorage.setItem('profile_return_url', window.location.href);

    // Load classes into table
    loadClasses();

    // Check user role and adjust UI accordingly
    const role = localStorage.getItem('active_role') || 'Teacher';
    if (role === 'Teacher') {
        const createBtn = document.querySelector('.btn-create');
        if (createBtn) {
            createBtn.style.display = 'none';
        }
    }
});

/* ────────────────────────────────────────────────────────
   LOAD CLASSES FROM LOCALSTORAGE
────────────────────────────────────────────────────────── */

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

        // Use classId for display (fallback to classCode if classId doesn't exist)
        const displayClassId = c.classId || c.classCode || 'N/A';
        const displayClassName = c.className || c.class_name || 'N/A';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${displayClassId}</td>
            <td>${displayClassName}</td>
            <td>
                <button class="btn-update" 
                        onclick="window.location.href='../Update-Student-Class/UpdateStudentClass.html?id=${c.class_id || c.classId || index}'">
                    Update
                </button>
            </td>
        `;
        table.appendChild(row);
    });
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