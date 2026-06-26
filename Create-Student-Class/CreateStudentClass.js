/* ============================================================
   CREATESTUDENTCLASS.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = "../login.html";
        return;
    }
});

/* ────────────────────────────────────────────────────────
   HANDLE FORM SUBMISSION
────────────────────────────────────────────────────────── */

function handleForm(event) {
    event.preventDefault();

    const classId = document.getElementById("classId").value.trim();
    const className = document.getElementById("className").value.trim();

    // Validation - check if all fields filled
    if (!classId || !className) {
        alert("Please fill in all the information!");
        return;
    }

    // Get existing classes
    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    // Check for duplicate Class ID
    if (classes.some(c => c.classId.toLowerCase() === classId.toLowerCase())) {
        alert("This Class ID already exists!");
        return;
    }

    // Create new class object
    const newClass = {
        classId: classId,
        className: className,
        isArchived: false
    };

    // Add to classes array
    classes.push(newClass);

    // Save to localStorage
    localStorage.setItem("classes", JSON.stringify(classes));

    alert("Class successfully registered!");

    // Redirect to student class list
    window.location.href = "../Student-Class/StudentClass.html";
}

/* ────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
────────────────────────────────────────────────────────── */

function toggleProfile() {
    var profileSection = document.getElementById('profile-section');
    var welcomeCard = document.getElementById('welcome-card');

    if (profileSection) {
        var isHidden = profileSection.style.display === 'none' || profileSection.style.display === '';
        profileSection.style.display = isHidden ? 'block' : 'none';
    }
    if (welcomeCard) {
        var isHidden = welcomeCard.style.display === 'none' || welcomeCard.style.display === '';
        welcomeCard.style.display = isHidden ? 'none' : 'block';
    }
}