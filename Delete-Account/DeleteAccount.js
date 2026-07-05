/* ============================================================
   DELETEACCOUNT.JS — FOR DATABASE INTEGRATION
   ============================================================ */

let selectedId = null;
let allTeachers = [];
const modal = document.getElementById('archiveModal');
const successMsg = document.getElementById('successMsg');

document.addEventListener('DOMContentLoaded', function () {
    // Save current page URL for profile return
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Memastikan status login disemak tanpa gelung tersekat
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log("Session verified.");
    }
    
    // Load all teachers from database
    loadAllTeachers();
});

/* ════════════════════════════════════════════════════════
   LOAD ALL TEACHERS FROM DATABASE
   Fetch from TeacherController
   ════════════════════════════════════════════════════════ */
function loadAllTeachers() {
    // Fetch teachers from database
    fetch('../TeacherController?action=getAllTeachers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }
            return response.json();
        })
        .then(data => {
            // Store all teachers
            allTeachers = data.teachers || [];
            
            // Generate table rows
            generateTableRows(allTeachers);
        })
        .catch(error => {
            console.error('Error loading teachers:', error);
        });
}

/* ════════════════════════════════════════════════════════
   GENERATE TABLE ROWS DYNAMICALLY
   Create rows from teacher data
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
                    <button class="btn-table-action btn-view" onclick="viewAccount('${teacher.T_IC}')" title="View">View</button>
                    <button class="btn-table-action btn-archive-row" onclick="showArchiveModal('${teacher.T_ID}', '${escapeHtml(teacher.T_Name)}')" title="Archive">Archive</button>
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
   VIEW ACCOUNT — Navigate to ViewTeacher page with IC
   IC is unique identifier for each teacher
────────────────────────────────────────────────────────── */
function viewAccount(teacherIC) {
    // Navigate to ViewTeacher page with teacher IC parameter
    window.location.href = '../ViewTeacher/ViewTeacher.html?ic=' + encodeURIComponent(teacherIC);
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
        }
    }

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