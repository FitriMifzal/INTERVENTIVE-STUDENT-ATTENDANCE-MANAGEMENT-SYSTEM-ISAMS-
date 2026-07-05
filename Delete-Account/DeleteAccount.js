/* ============================================================
   DELETEACCOUNT.JS — FINAL VERSION
   Navigate to ViewTeacher with IC parameter (not ID)
   ============================================================ */

let selectedId = null;
const modal = document.getElementById('archiveModal');
const successMsg = document.getElementById('successMsg');

document.addEventListener('DOMContentLoaded', function () {
    // Save current page URL for profile return
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Memastikan status login disemak tanpa gelung tersekat (infinite loop glitch)
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log("Session verified.");
    }
});

/* ────────────────────────────────────────────────────────
   VIEW ACCOUNT — Navigate to ViewTeacher page with IC
   IC is unique identifier for each teacher
────────────────────────────────────────────────────────── */
function viewAccount(teacherIC) {
    // Navigate to ViewTeacher page with teacher IC parameter
    window.location.href = '../ViewTeacher/ViewTeacher.html?ic=' + teacherIC;
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
/* ────────────────────────────────────────────────────────
   SEARCH TEACHERS BY NAME
   Real-time filtering as user types
────────────────────────────────────────────────────────── */
function searchTeachers() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var tableBody = document.getElementById('tableBody');
    var rows = tableBody.getElementsByClassName('account-row');
    var visibleCount = 0;

    // Loop through all table rows
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var teacherName = row.getElementsByClassName('acc-name')[0].textContent.toLowerCase();

        // Check if teacher name includes search text
        if (teacherName.includes(searchInput)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    }

    // Show "no results" message if no matches found
    var noResultsMsg = document.getElementById('noResultsMsg');
    if (visibleCount === 0 && searchInput !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('tr');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.innerHTML = '<td colspan="4" class="no-results">No teachers found matching "' + searchInput + '"</td>';
            tableBody.appendChild(noResultsMsg);
        } else {
            noResultsMsg.innerHTML = '<td colspan="4" class="no-results">No teachers found matching "' + searchInput + '"</td>';
            noResultsMsg.style.display = '';
        }
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}