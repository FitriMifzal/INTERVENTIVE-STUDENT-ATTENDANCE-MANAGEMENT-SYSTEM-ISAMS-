/* ============================================================
   CREATESTUDENTCLASS.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    sessionStorage.setItem('profile_return_url', window.location.href);
});

/* ────────────────────────────────────────────────────────
   HANDLE FORM SUBMISSION
────────────────────────────────────────────────────────── */

function handleForm(event) {
    event.preventDefault();

    const classId = document.getElementById("classId").value.trim();
    const className = document.getElementById("className").value.trim();

    // ✅ VALIDATION 1: Check if all fields are filled
    if (!classId || !className) {
        alert("Please fill in all the information!");
        return;
    }

    // ✅ VALIDATION 2: Class Code must be at least 3 characters
    if (classId.length < 3) {
        alert("Class Code must be at least 3 characters long!");
        return;
    }

    // ✅ VALIDATION 3: Class Code cannot contain special characters (only letters, numbers, spaces, hyphens, underscores)
    const classCodeRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!classCodeRegex.test(classId)) {
        alert("Class Code can only contain letters, numbers, spaces, hyphens (-), and underscores (_)!");
        return;
    }

    // ✅ VALIDATION 4: Class Name must be at least 3 characters
    if (className.length < 3) {
        alert("Class Name must be at least 3 characters long!");
        return;
    }

    // ✅ VALIDATION 5: Class Name cannot contain special characters (only letters, numbers, spaces, hyphens, underscores, apostrophes, periods)
    const classNameRegex = /^[a-zA-Z0-9\s\-_'.]+$/;
    if (!classNameRegex.test(className)) {
        alert("Class Name can only contain letters, numbers, spaces, hyphens (-), underscores (_), apostrophes ('), and periods (.)!");
        return;
    }

    // Get existing classes
    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    // ✅ VALIDATION 6: Check for duplicate Class Code (UNIQUE constraint)
    if (classes.some(c => c.classCode && c.classCode.toLowerCase() === classId.toLowerCase())) {
        alert("This Class Code already exists! Please enter a unique Class Code.");
        return;
    }

    // Generate new class_id (auto increment like NUMBER GENERATED ALWAYS AS IDENTITY)
    let nextId = 1;
    if (classes.length > 0) {
        // Find the highest class_id
        const maxId = Math.max(...classes.map(c => parseInt(c.class_id) || 0));
        nextId = maxId + 1;
    }

    // Create new class object - EXACT DATABASE SCHEMA + display format
    const newClass = {
        // Database schema format (for backend)
        class_id: nextId,        // NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
        classCode: classId,      // VARCHAR2(30) NOT NULL
        class_name: className,   // VARCHAR2(100) NOT NULL
        
        // Display format (for StudentClass.html table)
        classId: classId,        // For display in table
        className: className,    // For display in table
        
        isArchived: false
    };

    // Add to classes array
    classes.push(newClass);

    // Save to localStorage
    localStorage.setItem("classes", JSON.stringify(classes));

    alert("Classroom successfully registered!");

    // Redirect to student class list
    window.location.href = "../Student Class/StudentClass.html";
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