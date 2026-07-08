/* ============================================================
   SUBJECT.JS — Hardcoded for Localhost Testing
   Shows sample subjects immediately when page loads
   ============================================================ */

let subjects = [];
let currentUserRole = "";
let activeSubId = null;

// ════════════════════════════════════════════════════════
// ✅ HARDCODED SAMPLE SUBJECTS FOR TESTING
// ════════════════════════════════════════════════════════
const SAMPLE_SUBJECTS = [
    {
        subId: 1,
        subName: 'Mathematics',
        creditHours: 3,
        tId: null,
        teacherName: 'Unassigned'
    },
    {
        subId: 2,
        subName: 'English Language',
        creditHours: 3,
        tId: null,
        teacherName: 'Unassigned'
    },
    {
        subId: 3,
        subName: 'Physics',
        creditHours: 4,
        tId: null,
        teacherName: 'Unassigned'
    },
    {
        subId: 4,
        subName: 'Chemistry',
        creditHours: 4,
        tId: null,
        teacherName: 'Unassigned'
    },
    {
        subId: 5,
        subName: 'Biology',
        creditHours: 3,
        tId: null,
        teacherName: 'Unassigned'
    },
    {
        subId: 6,
        subName: 'Information Technology',
        creditHours: 3,
        tId: 1,
        teacherName: 'Ahmad Mohamed'
    }
];

document.addEventListener('DOMContentLoaded', function () {
    console.log('Subject page loaded - Multiple Teachers Architecture');
    
    // Get role from localStorage
    currentUserRole = localStorage.getItem('active_role') || 'Subject Teacher';
    currentTeacherId = parseInt(localStorage.getItem('active_tId')) || null;
    currentTeacherName = localStorage.getItem('active_name') || 'Unknown Teacher';
    
    console.log('=== USER INFO ===');
    console.log('Role:', currentUserRole);
    console.log('Teacher ID:', currentTeacherId);
    console.log('Teacher Name:', currentTeacherName);
    console.log('================');
    
    // ✅ CHANGE PAGE TITLE AND DESCRIPTION BASED ON ROLE
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.getElementById('pageDescription');
    
    if (currentUserRole.trim() === "Penyelaras Intervensi") {
        // PENYELARAS: Subject Details
        pageTitle.innerText = "Subject Details";
        pageDescription.innerText = "View, create, and manage all subjects. Click 'Create' to add a new subject or 'Edit' to modify existing ones.";
        console.log('✅ Title set for Penyelaras Intervensi');
    } else {
        // TEACHER: Subject Enrollment
        pageTitle.innerText = "Subject Enrollment";
        pageDescription.innerText = "Browse available subjects and enroll in the ones you wish to teach. Click 'Enroll' to register for a subject.";
        console.log('✅ Title set for Subject Teacher');
    }
    
    // Adjust UI based on role
    const btnCreate = document.getElementById('btnCreate');
    if (currentUserRole.trim() === "Penyelaras Intervensi") {
        btnCreate.style.display = 'block';
        console.log('✅ Role: Penyelaras Intervensi - Create button VISIBLE');
    } else {
        btnCreate.style.display = 'none';
        console.log('✅ Role: Subject Teacher - Create button HIDDEN');
    }

    // Load subjects
    loadSubjects();
});

/* ════════════════════════════════════════════════════════
   LOAD SUBJECTS (Hardcoded for Testing)
   ════════════════════════════════════════════════════════ */
function loadSubjects() {
    console.log('Loading subjects (hardcoded data)...');
    
    // Use hardcoded sample subjects
    subjects = SAMPLE_SUBJECTS;
    
    console.log('✅ Subjects loaded:', subjects.length, 'subjects');
    
    // Render table immediately
    renderTable();
}

/* ════════════════════════════════════════════════════════
   RENDER TABLE WITH SUBJECTS
   ════════════════════════════════════════════════════════ */
function renderTable() {
    console.log('Rendering table with', subjects.length, 'subjects');
    console.log('Current role for rendering:', currentUserRole);
    
    const body = document.getElementById('subjectTableBody');
    body.innerHTML = '';

    const myTId = parseInt(localStorage.getItem('active_tId')) || 1;
    const roleToCheck = currentUserRole.trim();

    subjects.forEach((s) => {
        let btns = '';

        if (roleToCheck === "Penyelaras Intervensi") {
            // ✅ PENYELARAS: Show Update button
            btns = `<button class="btn-update" onclick="showForm(${s.subId})">Update</button>`;
        } else if (roleToCheck === "Subject Teacher" || roleToCheck.includes("Teacher")) {
            // ✅ TEACHER: Show Enroll/Status buttons
            if (s.tId !== null && s.tId === myTId) {
                btns = `<button class="btn-secondary" disabled><i class="bi bi-check-circle"></i> Enrolled</button>`;
            } else if (s.tId === null) {
                btns = `<button class="btn-save" onclick="openEnroll(${s.subId})">Enroll</button>`;
            } else {
                btns = `<button class="btn-secondary" disabled>Assigned</button>`;
            }
        }

        const lecturer = s.tId === null ? '<span class="text-muted">Unassigned</span>' : s.teacherName;

        body.innerHTML += `<tr>
            <td>${s.subName}</td>
            <td>${s.creditHours}</td>
            <td>${lecturer}</td>
            <td>${btns}</td>
        </tr>`;
    });
    
    console.log('✅ Table rendered successfully');
}

/* ════════════════════════════════════════════════════════
   SHOW LIST PAGE
   ════════════════════════════════════════════════════════ */
function showList() {
    document.getElementById('subjectListPage').classList.remove('hidden');
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    loadSubjects();
}

/* ════════════════════════════════════════════════════════
   SHOW FORM PAGE (Create/Update)
   ════════════════════════════════════════════════════════ */
function showForm(subId) {
    document.getElementById('subjectForm').reset();
    document.getElementById('globalError').classList.add('hidden');

    if (subId !== undefined) {
        const s = subjects.find(sub => sub.subId === subId);
        document.getElementById('formTitle').innerText = "Update Subject Information";
        document.getElementById('subName').value = s.subName;
        document.getElementById('subCredit').value = s.creditHours;
        document.getElementById('editIdx').value = subId;
        console.log('Form opened for UPDATE:', s.subName);
    } else {
        document.getElementById('formTitle').innerText = "Create Subject";
        document.getElementById('editIdx').value = "";
        console.log('Form opened for CREATE');
    }

    document.getElementById('subjectListPage').classList.add('hidden');
    document.getElementById('formPage').classList.remove('hidden');
}

/* ════════════════════════════════════════════════════════
   SAVE SUBJECT (Create/Update)
   ════════════════════════════════════════════════════════ */
function saveData() {
    const name = document.getElementById('subName').value.trim();
    const credit = document.getElementById('subCredit').value.trim();
    const subId = document.getElementById('editIdx').value;

    document.getElementById('globalError').classList.add('hidden');

    if (!name || !credit) {
        document.getElementById('globalError').classList.remove('hidden');
        document.getElementById('globalError').innerText = "Please fill in all fields!";
        return;
    }

    // ✅ For localhost testing: Save to localStorage instead of database
    let successTitle, successMsg;

    if (subId === "") {
        // CREATE new subject
        const newSubject = {
            subId: Math.max(...subjects.map(s => s.subId), 0) + 1,
            subName: name,
            creditHours: parseInt(credit),
            tId: null,
            teacherName: 'Unassigned'
        };
        
        subjects.push(newSubject);
        successTitle = "Subject Created!";
        successMsg = name + " has been created successfully.";
        
        console.log('✅ Subject CREATED:', newSubject);
    } else {
        // UPDATE existing subject
        const subject = subjects.find(s => s.subId === parseInt(subId));
        if (subject) {
            subject.subName = name;
            subject.creditHours = parseInt(credit);
            
            successTitle = "Subject Updated!";
            successMsg = name + " has been updated successfully.";
            
            console.log('✅ Subject UPDATED:', subject);
        }
    }

    // Show success page
    document.getElementById('resTitle').innerText = successTitle;
    document.getElementById('resMsg').innerText = successMsg;
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
}

/* ════════════════════════════════════════════════════════
   OPEN ENROLLMENT MODAL
   ════════════════════════════════════════════════════════ */
function openEnroll(subId) {
    activeSubId = subId;
    const s = subjects.find(sub => sub.subId === subId);
    document.getElementById('targetSub').innerText = s.subName;
    new bootstrap.Modal(document.getElementById('enrollModal')).show();
    console.log('Enrollment modal opened for:', s.subName);
}

/* ════════════════════════════════════════════════════════
   EXECUTE ENROLLMENT
   ════════════════════════════════════════════════════════ */
function executeEnroll() {
    const tId = localStorage.getItem('active_tId') || 1;

    const subject = subjects.find(s => s.subId === activeSubId);
    if (subject) {
        subject.tId = parseInt(tId);
        subject.teacherName = localStorage.getItem('active_name'); 
        
        console.log('✅ Enrollment successful:', subject.subName);
        
        bootstrap.Modal.getInstance(document.getElementById('enrollModal')).hide();

        const s = subjects.find(sub => sub.subId === activeSubId);
        document.getElementById('successMsg').innerText = "You enrolled for " + s.subName;
        
        // ✅ Show success modal instead of success page
        new bootstrap.Modal(document.getElementById('successModal')).show();
    }
}

// ✅ NEW FUNCTION: Close modal and reload page
function closeSuccessModal() {
    bootstrap.Modal.getInstance(document.getElementById('successModal')).hide();
    renderTable();  // Reload table to show teacher name assigned
}

console.log('Subject.js loaded - Localhost testing mode');
console.log('Sample subjects available:', SAMPLE_SUBJECTS.length);