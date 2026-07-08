/* ============================================================
   DELETEACCOUNT.JS — HARDCODED FOR LOCALHOST TESTING
   Shows sample teachers immediately when page loads
   ONLY Archive button (View button removed)
   ============================================================ */

let selectedId = null;
let allTeachers = [];
const modal = document.getElementById('archiveModal');
const successMsg = document.getElementById('successMsg');

// ════════════════════════════════════════════════════════
// ✅ HARDCODED SAMPLE TEACHERS FOR TESTING
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
    console.log('DeleteAccount page loaded - Localhost testing mode');
    
    // Save current page URL for profile return
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Load all teachers from HARDCODED data
    loadAllTeachers();
});

/* ════════════════════════════════════════════════════════
   LOAD ALL TEACHERS (Hardcoded for Testing)
   ════════════════════════════════════════════════════════ */
function loadAllTeachers() {
    console.log('Loading teachers (hardcoded data)...');
    
    // Use hardcoded sample teachers
    allTeachers = SAMPLE_TEACHERS;
    
    console.log('✅ Teachers loaded:', allTeachers.length, 'teachers');
    
    // Generate table rows
    generateTableRows(allTeachers);
}

/* ════════════════════════════════════════════════════════
   GENERATE TABLE ROWS DYNAMICALLY
   Create rows from teacher data (NO View button - only Archive)
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
        row.id = 'row-' + teacher.T_ID;
        
        row.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td>
                <div class="acc-name">${escapeHtml(teacher.T_Name)}</div>
            </td>
            <td class="text-center acc-id">${teacher.T_ID}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-table-action btn-archive-row" onclick="showArchiveModal('${teacher.T_ID}', '${escapeHtml(teacher.T_Name)}')" title="Archive">Archive</button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    console.log('✅ Table rows generated successfully');
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
    console.log('Create button clicked - navigating to CreateAccount');
    window.location.href = '../Create-Account/CreateAccount.html';
}

/* ────────────────────────────────────────────────────────
   SHOW ARCHIVE MODAL
────────────────────────────────────────────────────────── */
function showArchiveModal(id, name) {
    console.log('Archive button clicked for ID:', id, 'Name:', name);
    
    const targetRow = document.getElementById('row-' + id);
    
    if (targetRow && targetRow.classList.contains('archived')) {
        console.log('Already archived - cannot archive again');
        return;
    }

    selectedId = id;
    document.getElementById('targetAccount').innerText = "ID: " + id + " | Name: " + name;
    modal.classList.add('show');
    successMsg.style.display = 'none';
    
    console.log('✅ Archive modal opened');
}

/* ────────────────────────────────────────────────────────
   CLOSE MODAL
────────────────────────────────────────────────────────── */
function closeModal() {
    console.log('Closing modal');
    modal.classList.remove('show');
}

/* ────────────────────────────────────────────────────────
   EXECUTE ARCHIVE
────────────────────────────────────────────────────────── */
function executeArchive() {
    console.log('Confirming archive for ID:', selectedId);
    
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
        
        console.log('✅ Teacher archived successfully');
    }

    // Hide success message after 3 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
        console.log('Success message hidden');
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

console.log('DeleteAccount.js loaded - Localhost testing mode');
console.log('Sample teachers available:', SAMPLE_TEACHERS.length);