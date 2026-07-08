/* ============================================================
   UPDATESTUDENT.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

// Get student ID from URL parameters
const params = new URLSearchParams(window.location.search);
const studentIdFromURL = params.get("id");

// State variables
let students = JSON.parse(localStorage.getItem("students")) || [];
let classes = JSON.parse(localStorage.getItem("classes")) || [];
let selectedStudent = null;

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
    // Find student by stu_id
    if (studentIdFromURL) {
        selectedStudent = students.find(s => s.stu_id == studentIdFromURL);
    }

    // Check if student exists
    if (!selectedStudent) {
        alert("Student not found!");
        window.location.href = "../Student-List/StudentList.html";
        return;
    }

    // Populate form with student data
    document.getElementById("name").value = selectedStudent.stu_name || "";
    document.getElementById("ic").value = selectedStudent.stu_ic || "";
    document.getElementById("address").value = selectedStudent.stu_add || "";
    document.getElementById("No").value = selectedStudent.stu_phonenum || "";
    
    // Populate class dropdown
    const classSelect = document.getElementById("cls");
    classSelect.innerHTML = '<option value="">-- Select Class --</option>';
    
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.class_id || cls.classId || cls.classCode;
        const displayText = cls.classCode || cls.classId || 'N/A';
        option.textContent = displayText + ' (' + (cls.class_name || cls.className || '') + ')';
        if (option.value == selectedStudent.class_id) {
            option.selected = true;
        }
        classSelect.appendChild(option);
    });

    // Populate student type dropdown - SVM or DVM
    const typeSelect = document.getElementById("student_type");
    typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    typeSelect.innerHTML += '<option value="SVM">SVM</option>';
    typeSelect.innerHTML += '<option value="DVM">DVM</option>';
    
    if (selectedStudent.student_type) {
        typeSelect.value = selectedStudent.student_type;
    }
}

/* ────────────────────────────────────────────────────────
   SAVE STUDENT UPDATES
────────────────────────────────────────────────────────── */

function saveUpdate() {
    const stu_name = document.getElementById("name").value.trim();
    const stu_ic = document.getElementById("ic").value.trim();
    const stu_add = document.getElementById("address").value.trim();
    const stu_phonenum = document.getElementById("No").value.trim();
    const class_id = document.getElementById("cls").value;
    const student_type = document.getElementById("student_type").value;

    // ✅ VALIDATION 1: stu_name - NOT NULL
    if (!stu_name) {
        alert('Please enter the student\'s full name!');
        return;
    }

    // ✅ VALIDATION 2: stu_name - VARCHAR2(100) max length
    if (stu_name.length > 100) {
        alert('Student name cannot exceed 100 characters!');
        return;
    }

    // ✅ VALIDATION 3: stu_ic - NOT NULL
    if (!stu_ic) {
        alert('Please enter the student\'s IC Number!');
        return;
    }

    // ✅ VALIDATION 4: stu_ic - must be numeric only
    if (!/^\d+$/.test(stu_ic)) {
        alert('IC Number must contain only numbers!');
        return;
    }

    // ✅ VALIDATION 5: stu_ic - VARCHAR2(20) max length
    if (stu_ic.length > 20) {
        alert('IC Number cannot exceed 20 characters!');
        return;
    }

    // ✅ VALIDATION 6: stu_ic - minimum 10 characters
    if (stu_ic.length < 10) {
        alert('IC Number must be at least 10 characters!');
        return;
    }

    // ✅ VALIDATION 7: stu_add - VARCHAR2(255) max length (if provided)
    if (stu_add && stu_add.length > 255) {
        alert('Address cannot exceed 255 characters!');
        return;
    }

    // ✅ VALIDATION 8: stu_phonenum - VARCHAR2(20) max length (if provided)
    if (stu_phonenum && stu_phonenum.length > 20) {
        alert('Phone number cannot exceed 20 characters!');
        return;
    }

    // ✅ VALIDATION 9: stu_phonenum - must be numeric only (if provided)
    if (stu_phonenum && !/^\d+$/.test(stu_phonenum)) {
        alert('Phone number must contain only numbers!');
        return;
    }

    // ✅ VALIDATION 10: class_id - NOT NULL
    if (!class_id) {
        alert('Please select a class!');
        return;
    }

    // ✅ VALIDATION 11: student_type - NOT NULL
    if (!student_type) {
        alert('Please select a student type!');
        return;
    }

    // ✅ VALIDATION 12: student_type - must be 'SVM' or 'DVM'
    if (!['SVM', 'DVM'].includes(student_type)) {
        alert('Student type must be either "SVM" or "DVM"!');
        return;
    }

    if (selectedStudent) {
        // Update student data
        selectedStudent.stu_name = stu_name;
        selectedStudent.stu_ic = stu_ic;
        selectedStudent.stu_add = stu_add || null;
        selectedStudent.stu_phonenum = stu_phonenum || null;
        selectedStudent.class_id = parseInt(class_id);
        selectedStudent.student_type = student_type;

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