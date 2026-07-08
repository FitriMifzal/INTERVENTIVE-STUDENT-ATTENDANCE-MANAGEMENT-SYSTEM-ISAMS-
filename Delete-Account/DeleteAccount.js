/* ============================================================
   DELETEACCOUNT.JS 
   Reads from localStorage to display newly created teacher accounts
   ============================================================ */

let selectedId = null;
let allTeachers = [];
const modal = document.getElementById('archiveModal');
const successMsg = document.getElementById('successMsg');

// ════════════════════════════════════════════════════════
// HARDCODED SAMPLE TEACHERS FOR TESTING (fallback only)
// ════════════════════════════════════════════════════════
const SAMPLE_TEACHERS = [
    {
        T_ID: 'T001',
        T_Name: 'Ahmad Mohamed',
        T_IC: '900101011234',
        T_Email: 'ahmad@school.edu',
        T_Phone: '0123456789'
    },
    {
        T_ID: 'T002',
        T_Name: 'Siti Nur Aminah',
        T_IC: '920315045678',
        T_Email: 'siti@school.edu',
        T_Phone: '0187654321'
    },
    {
        T_ID: 'T003',
        T_Name: 'Rajesh Kumar',
        T_IC: '880920078901',
        T_Email: 'rajesh@school.edu',
        T_Phone: '0145678901'
    },
    {
        T_ID: 'T004',
        T_Name: 'Nurul Hidayah',
        T_IC: '950612012345',
        T_Email: 'nurul@school.edu',
        T_Phone: '0156789012'
    },
    {
        T_ID: 'T005',
        T_Name: 'Muhammad Azlan',
        T_IC: '870823045678',
        T_Email: 'azlan@school.edu',
        T_Phone: '0167890123'
    },
    {
        T_ID: 'T006',
        T_Name: 'Lee Wei Ming',
        T_IC: '920305089012',
        T_Email: 'wming@school.edu',
        T_Phone: '0178901234'
    },
    {
        T_ID: 'T007',
        T_Name: 'Amirul Aiman',
        T_IC: '960711056789',
        T_Email: 'amirul@school.edu',
        T_Phone: '0189012345'
    }
];

// Store reference to current page URL for profile navigation
const CURRENT_PAGE_URL = window.location.href;

document.addEventListener('DOMContentLoaded', function () {
    // Store current page URL for profile return
    sessionStorage.setItem('profile_return_url', CURRENT_PAGE_URL);
    
    // Load all teachers (from localStorage + fallback to sample)
    loadAllTeachers();
    
    // Handle profile toggle from header
    setupProfileToggle();
});

/* ════════════════════════════════════════════════════════
   SETUP PROFILE TOGGLE
   ════════════════════════════════════════════════════════ */
function setupProfileToggle() {
    // Remove any existing click listeners to prevent duplicates
    const profileElement = document.querySelector('.user-profile');
    if (profileElement) {
        // Replace the onclick attribute with our custom handler
        profileElement.removeAttribute('onclick');
        profileElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleProfile(e);
        });
    }
}

/* ════════════════════════════════════════════════════════
   TOGGLE PROFILE - Custom implementation
   ════════════════════════════════════════════════════════ */
function toggleProfile(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Store current page URL before navigating
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Navigate to profile page
    window.location.href = '../Profile/Profile.html';
}

/* ════════════════════════════════════════════════════════
   LOAD ALL TEACHERS (FROM LOCALSTORAGE + HARDCODED FALLBACK)
   ════════════════════════════════════════════════════════ */
function loadAllTeachers() {
    let localTeachers = JSON.parse(localStorage.getItem("teachers")) || [];
    
    if (localTeachers.length > 0) {
        allTeachers = localTeachers;
    } else {
        allTeachers = SAMPLE_TEACHERS;
    }
    
    generateTableRows(allTeachers);
}

/* ════════════════════════════════════════════════════════
   GENERATE TABLE ROWS DYNAMICALLY
   ════════════════════════════════════════════════════════ */
function generateTableRows(teachers) {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (teachers.length === 0) {
        var row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="no-results">No teachers found in the system.</td>';
        tableBody.appendChild(row);
        return;
    }
    
    teachers.forEach((teacher, index) => {
        var row = document.createElement('tr');
        row.className = 'account-row';
        
        const teacherId = teacher.T_ID || teacher.t_id || 'N/A';
        const teacherName = teacher.T_Name || teacher.t_name || 'Unknown';
        
        row.id = 'row-' + teacherId;
        
        row.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td>
                <div class="acc-name">${escapeHtml(teacherName)}</div>
            </td>
            <td class="text-center acc-id">${teacherId}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-table-action btn-archive-row" onclick="showArchiveModal('${teacherId}', '${escapeHtml(teacherName)}')" title="Archive">Archive</button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/* ────────────────────────────────────────────────────────
   GO TO CREATE ACCOUNT PAGE - FIXED
────────────────────────────────────────────────────────── */
function goToCreateAccount() {
    // Navigate to Create Account page
    window.location.href = '../Create-Account/CreateAccount.html';
}

/* ────────────────────────────────────────────────────────
   SHOW ARCHIVE MODAL
────────────────────────────────────────────────────────── */
function showArchiveModal(id, name) {
    const targetRow = document.getElementById('row-' + id);
    
    if (targetRow && targetRow.classList.contains('archived')) {
        return;
    }

    selectedId = id;
    document.getElementById('targetAccount').innerText = "ID: " + id + " | Name: " + name;
    modal.classList.add('show');
    successMsg.style.display = 'none';
}

/* ────────────────────────────────────────────────────────
   CLOSE MODAL
────────────────────────────────────────────────────────── */
function closeModal() {
    modal.classList.remove('show');
}

/* ────────────────────────────────────────────────────────
   EXECUTE ARCHIVE
────────────────────────────────────────────────────────── */
function executeArchive() {
    modal.classList.remove('show');
    successMsg.style.display = 'block';
    
    const targetRow = document.getElementById('row-' + selectedId);
    if (targetRow) {
        targetRow.classList.add('archived');
        
        const archiveBtn = targetRow.querySelector('.btn-archive-row');
        if (archiveBtn) {
            archiveBtn.innerText = 'Archived';
            archiveBtn.disabled = true;
        }
    }

    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

// Click outside modal to close
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Prevent any accidental navigation or refresh
window.addEventListener('beforeunload', function(e) {
    // Store current URL before leaving
    sessionStorage.setItem('last_page_url', window.location.href);
});