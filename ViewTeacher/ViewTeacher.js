/* ============================================================
   VIEWTEACHER.JS — IMPROVED
   - Load teacher by IC (T_IC) instead of ID
   - IC is unique identifier
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Save current page URL for profile return
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Get teacher IC from URL parameter (?ic=850324-14-5678)
    const urlParams = new URLSearchParams(window.location.search);
    const teacherIC = urlParams.get('ic');
    
    if (teacherIC) {
        loadTeacherDetails(teacherIC);
    } else {
        alert('Teacher IC not provided!');
        goBack();
    }
});

/* ──────────────────────────────────────────────────
   LOAD TEACHER DETAILS (by IC)
   Akan di-replace dengan database query oleh Harris & Mif
   ────────────────────────────────────────────────── */
function loadTeacherDetails(teacherIC) {
    // Mock teacher data - indexed by IC (T_IC)
    // Harris & Mif akan replace ini dengan actual database query
    const teacherDataByIC = {
        '850324-14-5678': {
            id: 'KVD001',
            ic: '850324-14-5678',
            name: 'Arissa Amiely binti Mohammad Syahir',
            email: 'arissa.amiely@kv.edu.my',
            phone: '+601234567890',
            role: 'Subject Teacher'
        },
        '880715-09-5432': {
            id: 'KVD002',
            ic: '880715-09-5432',
            name: 'Ahmad Zaki bin Md Nor',
            email: 'ahmad.zaki@kv.edu.my',
            phone: '+601234567891',
            role: 'Penyelaras Intervensi'
        },
        '900412-08-7654': {
            id: 'KVD003',
            ic: '900412-08-7654',
            name: 'Ainnur Mardiah binti Amiruddin',
            email: 'ainnur.mardiah@kv.edu.my',
            phone: '+601234567892',
            role: 'Subject Teacher'
        },
        '870608-12-4321': {
            id: 'KVD004',
            ic: '870608-12-4321',
            name: 'Muhammad Syamel bin Kamarulzaman',
            email: 'syamel.muhammad@kv.edu.my',
            phone: '+601234567893',
            role: 'Subject Teacher'
        },
        '910125-05-8765': {
            id: 'KVD005',
            ic: '910125-05-8765',
            name: 'Nur Syahirah binti Samsudin',
            email: 'syahirah.nur@kv.edu.my',
            phone: '+601234567894',
            role: 'Penyelaras Intervensi'
        },
        '860930-11-3210': {
            id: 'KVD006',
            ic: '860930-11-3210',
            name: 'Ahmad Amirulddin bin Khairulman',
            email: 'amirulddin.ahmad@kv.edu.my',
            phone: '+601234567895',
            role: 'Subject Teacher'
        }
    };

    // Get teacher data by IC (T_IC)
    const teacher = teacherDataByIC[teacherIC];
    
    if (teacher) {
        // Populate page with teacher details
        document.getElementById('teacherId').textContent = teacher.id;
        document.getElementById('teacherName').textContent = teacher.name;
        document.getElementById('teacherIC').textContent = teacher.ic;
        document.getElementById('teacherEmail').textContent = teacher.email;
        document.getElementById('teacherPhone').textContent = teacher.phone;
        document.getElementById('teacherRole').textContent = teacher.role;
    } else {
        // Teacher not found
        alert('Teacher with IC ' + teacherIC + ' not found!');
        goBack();
    }
}

/* ──────────────────────────────────────────────────
   GO BACK
   ────────────────────────────────────────────────── */
function goBack() {
    // Go back to DeleteAccount page
    window.location.href = '../delete-account/DeleteAccount.html';
}
