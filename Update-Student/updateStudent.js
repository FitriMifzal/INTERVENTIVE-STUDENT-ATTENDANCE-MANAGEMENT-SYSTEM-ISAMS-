/* ============================================================
   UPDATESTUDENT.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

// Get student ID from URL parameters
const params = new URLSearchParams(window.location.search);
const studentIndex = params.get("id");

// State variables
let students = JSON.parse(localStorage.getItem("students")) || [];
let selectedStudent = (studentIndex !== null && studentIndex >= 0 && studentIndex < students.length) ? students[studentIndex] : null;

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);
    // Load student data for editing
    loadStudentData();
});

/* ────────────────────────────────────────────────────────
   LOAD STUDENT DATA FROM LOCALSTORAGE
────────────────────────────────────────────────────────── */

function loadStudentData() {
    // Check if student exists
    if (studentIndex === null || studentIndex < 0 || studentIndex >= students.length) {
        alert("Student not found!");
        window.location.href = "../Student-List/StudentList.html";
        return;
    }

    // If student found, populate form
    if (selectedStudent) {
        document.getElementById("name").value = selectedStudent.name || "";
        document.getElementById("ic").value = selectedStudent.ic || "";
        document.getElementById("cls").value = selectedStudent.cls || "";
        document.getElementById("address").value = selectedStudent.address || "";
        document.getElementById("No").value = selectedStudent.No || "";
    } else {
        alert("No student data found");
        window.location.href = "../Student-List/StudentList.html";
    }
}

/* ────────────────────────────────────────────────────────
   SAVE STUDENT UPDATES
────────────────────────────────────────────────────────── */

function saveUpdate() {
    const name = document.getElementById("name").value.trim();
    const ic = document.getElementById("ic").value.trim();
    const cls = document.getElementById("cls").value.trim();
    const address = document.getElementById("address").value.trim();
    const No = document.getElementById("No").value.trim();

    // Validation - check if all fields filled
    if (!name || !ic || !cls || !No) {
        alert("Please fill in all required fields!");
        return;
    }

    // Validation - IC Number must be 12 digits
    if (ic.length !== 12 || isNaN(ic)) {
        alert("Error: IC Number must contain exactly 12 digits.");
        return;
    }

    // Validation - Contact No should be valid
    if (isNaN(No) || No.length < 10) {
        alert("Error: Contact number must contain at least 10 digits.");
        return;
    }

    if (selectedStudent) {
        // Update student data
        selectedStudent.name = name;
        selectedStudent.ic = ic;
        selectedStudent.cls = cls;
        selectedStudent.address = address || "Not provided";
        selectedStudent.No = No;

        // Save to localStorage
        localStorage.setItem("students", JSON.stringify(students));

        alert("Student updated successfully!");

        // Redirect to student list
        window.location.href = "../Student-List/StudentList.html";
    }
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