// SUBJECT.JS
// User profile init handled by Sidebar.js

let subjects = [];
let currentUserRole = "";
let activeSubId = null;

document.addEventListener('DOMContentLoaded', function () {
    // Update sessionStorage dengan URL page ni (untuk profile return)
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = "../Create-Account/CreateAccount.html";
        return;
    }

    currentUserRole = localStorage.getItem('active_role') || 'Teacher';

    // adjust UI based on user role
    const btnCreate = document.getElementById('btnCreate');
    if (currentUserRole === "Penyelaras Intervensi") {
        btnCreate.style.display = 'block';
    } else {
        btnCreate.style.display = 'none';
    }

    loadSubjects();
});

// load subjects from localStorage
function loadSubjects() {
    subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    renderTable();
}

// render subject table based on user role
function renderTable() {
    const body = document.getElementById('subjectTableBody');
    body.innerHTML = '';

    const myTId = localStorage.getItem('active_tId');

    if (subjects.length === 0) {
        body.innerHTML = `<tr><td colspan="4" style="color: #9ca3af; font-style: italic; padding: 20px 12px; text-align: center;">No subjects found. Create one.</td></tr>`;
        return;
    }

    subjects.forEach((s, index) => {
        let btns = '';

        if (currentUserRole === "Penyelaras Intervensi") {
            // UPDATE button sahaja untuk Penyelaras Intervensi
            btns += `<button class="btn-table-action btn-update" onclick="showForm(${index})">Update</button>`;
        } else if (currentUserRole === "Subject Teacher") {
            if (s.tId !== null && s.tId === myTId) {
                btns += `<button class="btn-table-action btn-enrolled" disabled>Enrolled</button>`;
            } else if (s.tId === null || s.tId === "") {
                btns += `<button class="btn-table-action btn-enroll" onclick="openEnroll(${index})">Enroll</button>`;
            } else {
                btns += `<button class="btn-table-action btn-assigned" disabled>Assigned</button>`;
            }
        }

        const lecturer = (s.tId === null || s.tId === "") ? '<span style="color: #94a3b8;">Unassigned</span>' : (s.teacherName || 'Assigned');

        body.innerHTML += `<tr>
            <td>${s.subName}</td>
            <td>${s.creditHours}</td>
            <td>${lecturer}</td>
            <td><div class="action-buttons">${btns}</div></td>
        </tr>`;
    });
}

// show subject list page
function showList() {
    document.getElementById('subjectListPage').classList.remove('hidden');
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    loadSubjects();
}

// show form page for create/update
function showForm(index) {
    document.getElementById('subjectForm').reset();
    document.getElementById('globalError').classList.add('hidden');

    if (index !== undefined && index !== null && index !== "") {
        const s = subjects[index];
        document.getElementById('formTitle').innerText = "Update Subject";
        document.getElementById('subName').value = s.subName;
        document.getElementById('subCredit').value = s.creditHours;
        document.getElementById('editIdx').value = index;
    } else {
        document.getElementById('formTitle').innerText = "Create Subject";
        document.getElementById('editIdx').value = "";
    }

    document.getElementById('subjectListPage').classList.add('hidden');
    document.getElementById('formPage').classList.remove('hidden');
}

// save subject - create or update
function saveData() {
    const name = document.getElementById('subName').value.trim();
    const credit = document.getElementById('subCredit').value.trim();
    const index = document.getElementById('editIdx').value;

    document.getElementById('globalError').classList.add('hidden');

    if (!name || !credit) {
        document.getElementById('globalError').classList.remove('hidden');
        document.getElementById('globalError').innerText = "Please fill in all fields!";
        return;
    }

    let successTitle, successMsg;

    if (index === "") {
        // Create new subject
        const newSubject = {
            subName: name,
            creditHours: credit,
            tId: null,
            teacherName: null
        };
        subjects.push(newSubject);
        successTitle = "Registration Successful!";
        successMsg = "New subject has been added successfully.";
    } else {
        // Update existing subject - pastikan index adalah number
        const idx = parseInt(index);
        if (!isNaN(idx) && idx >= 0 && idx < subjects.length) {
            subjects[idx].subName = name;
            subjects[idx].creditHours = credit;
            successTitle = "Update Successful!";
            successMsg = "Subject has been updated successfully.";
        } else {
            document.getElementById('globalError').classList.remove('hidden');
            document.getElementById('globalError').innerText = "Invalid subject index!";
            return;
        }
    }

    // Save to localStorage
    localStorage.setItem("subjects", JSON.stringify(subjects));

    document.getElementById('resTitle').innerText = successTitle;
    document.getElementById('resMsg').innerText = successMsg;
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
}

// open enrollment confirmation modal
function openEnroll(index) {
    activeSubId = index;
    const s = subjects[index];
    document.getElementById('targetSub').innerText = s.subName;
    new bootstrap.Modal(document.getElementById('enrollModal')).show();
}

// execute enrollment - claims the subject for the logged-in teacher
function executeEnroll() {
    const tId = localStorage.getItem('active_tId');
    const teacherName = localStorage.getItem('active_name') || 'Teacher';

    if (activeSubId !== null && activeSubId !== undefined) {
        const idx = parseInt(activeSubId);
        if (!isNaN(idx) && idx >= 0 && idx < subjects.length) {
            subjects[idx].tId = tId;
            subjects[idx].teacherName = teacherName;

            // Save to localStorage
            localStorage.setItem("subjects", JSON.stringify(subjects));

            bootstrap.Modal.getInstance(document.getElementById('enrollModal')).hide();

            const s = subjects[idx];
            document.getElementById('resTitle').innerText = "Enrollment Successful!";
            document.getElementById('resMsg').innerText = "You have successfully enrolled in " + s.subName;
            document.getElementById('subjectListPage').classList.add('hidden');
            document.getElementById('successPage').classList.remove('hidden');
        }
    }
}