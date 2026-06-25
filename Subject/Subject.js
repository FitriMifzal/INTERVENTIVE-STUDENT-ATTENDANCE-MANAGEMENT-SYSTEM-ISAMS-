let subjects = [
    { id: "SSD3013", name: "System Analysis & Design", credit: 3, teacher: "En. Azman", enrolled: false },
    { id: "SSD3023", name: "Database Management", credit: 3, teacher: "Pn. Maria", enrolled: false },
    { id: "SSD3033", name: "Web Development", credit: 3, teacher: "Cik Sarah", enrolled: false },
    { id: "SSD3042", name: "Computer Networking", credit: 2, teacher: "En. Zaki", enrolled: false },
    { id: "SSD4013", name: "Mobile App Development", credit: 3, teacher: "Pn. Hajar", enrolled: false },
    { id: "SSD4022", name: "Cyber Security Basics", credit: 2, teacher: "En. Firdaus", enrolled: false },
    { id: "SSD4033", name: "Final Year Project I", credit: 3, teacher: "Dr. Khairul", enrolled: false },
    { id: "SSD4042", name: "Entrepreneurship", credit: 2, teacher: "Pn. Aishah", enrolled: false }
];

let currentUserRole = ""; 
let activeIdx = null;

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "../create-account/CreateAccount.html";
    }
}

function renderTable() {
    const body = document.getElementById('subjectTableBody');
    body.innerHTML = '';
    
    subjects.forEach((s, i) => {
        let btns = `<button class="btn btn-view btn-sm" onclick="viewSub(${i})">View</button>`;
        
        if (currentUserRole === "Penyelaras Intervensi") {
            btns += `<button class="btn btn-update btn-sm" onclick="showForm(${i})">Update</button>`;
        } 
        else if (currentUserRole === "Subject Teacher") {
            btns += s.enrolled 
                ? `<button class="btn btn-secondary btn-sm disabled"><i class="bi bi-check-circle"></i> Enrolled</button>` 
                : `<button class="btn btn-save btn-sm" onclick="openEnroll(${i})">Enroll</button>`;
        }

        body.innerHTML += `<tr>
            <td><strong>${s.id}</strong></td>
            <td>${s.name}</td>
            <td>${s.credit}</td>
            <td>${s.teacher}</td>
            <td><div class="action-gap">${btns}</div></td>
        </tr>`;
    });
}

function showList() {
    document.getElementById('subjectListPage').classList.remove('hidden');
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    renderTable();
}

function showForm(i = null) {
    document.getElementById('subjectForm').reset();
    document.getElementById('globalError').classList.add('hidden');
    document.getElementById('idError').classList.add('hidden');
    
    if (i !== null) {
        const s = subjects[i];
        document.getElementById('formTitle').innerText = "Update Subject Information";
        document.getElementById('subId').value = s.id;
        document.getElementById('subId').readOnly = true;
        document.getElementById('subName').value = s.name;
        document.getElementById('subCredit').value = s.credit;
        document.getElementById('subTeacher').value = s.teacher;
        document.getElementById('editIdx').value = i;
    } else {
        document.getElementById('formTitle').innerText = "Subject Registration Form";
        document.getElementById('subId').readOnly = false;
        document.getElementById('editIdx').value = "";
    }
    document.getElementById('subjectListPage').classList.add('hidden');
    document.getElementById('formPage').classList.remove('hidden');
}

function saveData() {
    const id = document.getElementById('subId').value.trim();
    const name = document.getElementById('subName').value.trim();
    const credit = document.getElementById('subCredit').value.trim();
    const teacher = document.getElementById('subTeacher').value.trim();
    const idx = document.getElementById('editIdx').value;

    document.getElementById('globalError').classList.add('hidden');
    document.getElementById('idError').classList.add('hidden');

    if (!id || !name || !credit || !teacher) {
        document.getElementById('globalError').classList.remove('hidden');
        document.getElementById('globalError').innerText = "Please fill in all text fields!";
        return;
    }

    if (idx === "") {
        const isDuplicate = subjects.some(s => s.id.toUpperCase() === id.toUpperCase());
        if (isDuplicate) {
            document.getElementById('globalError').classList.remove('hidden');
            document.getElementById('globalError').innerText = "Error: Subject Code '" + id + "' already exists!";
            return;
        }

        if (!id.toUpperCase().startsWith("SSD")) {
            document.getElementById('idError').classList.remove('hidden');
            return;
        }
        subjects.push({ id, name, credit, teacher, enrolled: false });
        document.getElementById('resTitle').innerText = "Registration Successful!";
        document.getElementById('resMsg').innerText = "New subject added.";
    } else {
        subjects[idx].name = name;
        subjects[idx].credit = credit;
        subjects[idx].teacher = teacher;
        document.getElementById('resTitle').innerText = "Update Successful!";
        document.getElementById('resMsg').innerText = "Subject updated.";
    }
    
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
}

function viewSub(i) {
    const s = subjects[i];
    document.getElementById('viewDetailBody').innerHTML = `
        <div class="mb-2"><strong>Subject ID:</strong> ${s.id}</div>
        <div class="mb-2"><strong>Subject Name:</strong> ${s.name}</div>
        <div class="mb-2"><strong>Credit Hours:</strong> ${s.credit}</div>
        <div class="mb-2"><strong>Lecturer:</strong> ${s.teacher}</div>
        <div><strong>Enrollment Status:</strong> ${s.enrolled ? '<span class="text-success fw-bold">Enrolled</span>' : '<span class="text-muted">Not Enrolled</span>'}</div>
    `;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

function openEnroll(i) {
    activeIdx = i;
    document.getElementById('targetSub').innerText = subjects[i].name;
    new bootstrap.Modal(document.getElementById('enrollModal')).show();
}

function executeEnroll() {
    subjects[activeIdx].enrolled = true;
    bootstrap.Modal.getInstance(document.getElementById('enrollModal')).hide();
    document.getElementById('resTitle').innerText = "Enrollment Successful!";
    document.getElementById('resMsg').innerText = "You registered for " + subjects[activeIdx].name;
    document.getElementById('subjectListPage').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
}

window.onload = function() {
    const savedName = localStorage.getItem('reg_name') || "Muhammad Amin bin Abdullah";
    const savedRole = localStorage.getItem('reg_role') || "Subject Teacher";

    currentUserRole = savedRole; 

    document.getElementById('user-fullname').innerText = savedName;
    document.getElementById('display-role').innerText = savedRole;

    // Update Initial
    document.getElementById("user-initial").innerText = savedName.trim().charAt(0).toUpperCase();

    if (savedRole === "Penyelaras Intervensi") {
        document.getElementById('nav-account').style.display = 'flex';
        document.getElementById('btnCreate').style.display = 'block';
    } else {
        document.getElementById('nav-account').style.display = 'none';
        document.getElementById('btnCreate').style.display = 'none';
    }

    renderTable();
};