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

document.addEventListener('DOMContentLoaded', function () {
    // Save current page URL for profile return
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Load all teachers (from localStorage + fallback to sample)
    loadAllTeachers();
});

/* ════════════════════════════════════════════════════════
   LOAD ALL TEACHERS (FROM LOCALSTORAGE + HARDCODED FALLBACK)
   ════════════════════════════════════════════════════════ */
function loadAllTeachers() {
    // Load from localStorage (data saved by CreateAccount.js)
    let localTeachers = JSON.parse(localStorage.getItem("teachers")) || [];
    
    if (localTeachers.length > 0) {
        // Use data from localStorage (newly created accounts)
        allTeachers = localTeachers;
    } else {
        // Fallback to sample data if localStorage is empty
        allTeachers = SAMPLE_TEACHERS;
    }
    
    // Generate table rows
    generateTableRows(allTeachers);
}

/* ════════════════════════════════════════════════════════
   GENERATE TABLE ROWS DYNAMICALLY
   Create rows from teacher data (handles both field name formats)
   ════════════════════════════════════════════════════════ */
function generateTableRows(teachers) {
    var tableBody = document.getElementById('tableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (teachers.length === 0) {
        // Show "no teachers" message
        var row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="no-results">No teachers found in the system.</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Create row for each teacher
    teachers.forEach((teacher, index) => {
        var row = document.createElement('tr');
        row.className = 'account-row';
        
        // Handle both field name formats (uppercase from sample data OR lowercase from CreateAccount)
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

/* ════════════════════════════════════════════════════════
   ESCAPE HTML (prevent XSS)
   ════════════════════════════════════════════════════════ */
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
   GO TO CREATE ACCOUNT PAGE
   Navigate to CreateAccount.html
────────────────────────────────────────────────────────── */
function goToCreateAccount() {
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

    // Hide success message after 3 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

/* ────────────────────────────────────────────────────────
   CLOSE MODAL ON OUTSIDE CLICK
────────────────────────────────────────────────────────── */
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}