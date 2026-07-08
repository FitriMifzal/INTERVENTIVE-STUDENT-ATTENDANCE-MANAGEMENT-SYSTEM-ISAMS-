/* ============================================================
   VIEWSTUDENT.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);

    // Load student data
    loadStudentData();
});

/* ────────────────────────────────────────────────────────
   LOAD STUDENT DATA FROM LOCALSTORAGE
────────────────────────────────────────────────────────── */

function loadStudentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id");
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const classes = JSON.parse(localStorage.getItem("classes")) || [];

    // Find student by stu_id
    let selectedStudent = null;
    if (studentId) {
        // Try to find by stu_id (number)
        selectedStudent = students.find(s => s.stu_id == studentId);
        
        // If not found, try by index (fallback)
        if (!selectedStudent && !isNaN(studentId)) {
            const index = parseInt(studentId);
            if (index >= 0 && index < students.length) {
                selectedStudent = students[index];
            }
        }
    }

    // Validate student exists
    if (!selectedStudent) {
        alert("Student record not found!");
        window.location.href = "../Student-List/StudentList.html";
        return;
    }

    // Find class name from class_id
    let className = 'N/A';
    if (selectedStudent.class_id) {
        const classObj = classes.find(c => (c.class_id || c.classId || c.classCode) == selectedStudent.class_id);
        if (classObj) {
            className = classObj.class_name || classObj.className || classObj.classCode || 'N/A';
        }
    }

    // Get student data - try both field naming conventions
    const studentName = selectedStudent.stu_name || selectedStudent.name || 'N/A';
    const studentIc = selectedStudent.stu_ic || selectedStudent.ic || 'N/A';
    const studentType = selectedStudent.student_type || 'N/A';
    const studentAddress = selectedStudent.stu_add || selectedStudent.address || 'N/A';
    const studentPhone = selectedStudent.stu_phonenum || selectedStudent.No || selectedStudent.phone || 'N/A';

    // Populate view fields
    document.getElementById("v_name").innerText = studentName;
    document.getElementById("v_ic").innerText = studentIc;
    document.getElementById("v_cls").innerText = className;
    document.getElementById("v_type").innerText = studentType;
    document.getElementById("v_address").innerText = studentAddress;
    document.getElementById("v_No").innerText = studentPhone;

    // Debug - log to console to see what data is available
    console.log("Student Data:", selectedStudent);
    console.log("Student Name:", studentName);
    console.log("Student IC:", studentIc);
    console.log("Student Type:", studentType);
    console.log("Student Address:", studentAddress);
    console.log("Student Phone:", studentPhone);
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