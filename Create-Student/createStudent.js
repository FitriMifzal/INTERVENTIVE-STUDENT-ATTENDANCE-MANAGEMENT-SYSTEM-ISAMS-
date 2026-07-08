/* ============================================================
   CREATESTUDENT.JS — Create Student Logic
   Handles form submission and validation
   Based on table constraint:
   - stu_id: NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
   - stu_name: VARCHAR2(100) NOT NULL
   - stu_ic: VARCHAR2(20) NOT NULL
   - stu_add: VARCHAR2(255)
   - stu_phonenum: VARCHAR2(20)
   - class_id: NUMBER NOT NULL
   - student_type: VARCHAR2(10) (SVM or DVM)
   - CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classroom(class_id)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Load classes into dropdown
    loadClassDropdown();
});

/* ────────────────────────────────────────────────────────
   LOAD CLASSES INTO DROPDOWN
────────────────────────────────────────────────────────── */
function loadClassDropdown() {
    const classSelect = document.getElementById('class_id');
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    
    // Clear existing options (keep first option)
    classSelect.innerHTML = '<option value="">-- Select Class --</option>';
    
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.class_id || cls.classId || cls.classCode;
        const displayText = cls.classCode || cls.classId || 'N/A';
        option.textContent = displayText + ' (' + (cls.class_name || cls.className || '') + ')';
        classSelect.appendChild(option);
    });
}

/* ────────────────────────────────────────────────────────
   HANDLE FORM SUBMISSION
────────────────────────────────────────────────────────── */

function handleForm(event) {
    event.preventDefault();

    const stu_name = document.getElementById('stu_name').value.trim();
    const stu_ic = document.getElementById('stu_ic').value.trim();
    const stu_add = document.getElementById('stu_add').value.trim();
    const stu_phonenum = document.getElementById('stu_phonenum').value.trim();
    const class_id = document.getElementById('class_id').value;
    const student_type = document.getElementById('student_type').value;

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

    // ✅ VALIDATION 6: stu_ic - minimum 10 characters (Malaysian IC standard)
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

    // Get existing students
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // ✅ VALIDATION 13: Check for duplicate IC (business rule)
    if (students.some(s => s.stu_ic === stu_ic)) {
        alert('This IC Number already exists in the system!');
        return;
    }

    // Generate new stu_id (auto increment like NUMBER GENERATED ALWAYS AS IDENTITY)
    let nextId = 1;
    if (students.length > 0) {
        const maxId = Math.max(...students.map(s => parseInt(s.stu_id) || 0));
        nextId = maxId + 1;
    }

    // Create new student object - EXACT DATABASE SCHEMA
    const newStudent = {
        stu_id: nextId,              // NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
        stu_name: stu_name,          // VARCHAR2(100) NOT NULL
        stu_ic: stu_ic,              // VARCHAR2(20) NOT NULL
        stu_add: stu_add || null,    // VARCHAR2(255)
        stu_phonenum: stu_phonenum || null, // VARCHAR2(20)
        class_id: parseInt(class_id), // NUMBER NOT NULL
        student_type: student_type,   // VARCHAR2(10) - SVM or DVM
        isArchived: false
    };

    // Add to students array
    students.push(newStudent);

    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));

    alert('Student created successfully!');

    // Redirect to student list
    window.location.href = '../Student-List/StudentList.html';
}

/* ────────────────────────────────────────────────────────
   TOGGLE PROFILE
────────────────────────────────────────────────────────── */
function toggleProfile() {
    sessionStorage.setItem('profile_return_url', window.location.href);
    window.location.href = '../Profile-Details/Profile-Details.html';
}