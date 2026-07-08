/* ============================================================
   CREATEACCOUNT.JS — Create Teacher Account Logic
   Handles form submission and validation (SAME PATTERN AS CREATESTUDENT)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    sessionStorage.setItem('profile_return_url', window.location.href);
});

/* ────────────────────────────────────────────────────────
   TOGGLE PROFILE - Navigate to profile page or back
────────────────────────────────────────────────────────── */
function toggleProfile(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Store current page URL before navigating
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Navigate to profile page
    window.location.href = '../Profile-Details/Profile-Details.html';
}

/* ────────────────────────────────────────────────────────
   HANDLE FORM SUBMISSION
────────────────────────────────────────────────────────── */

function handleForm(event) {
    event.preventDefault();

    const t_name = document.getElementById("t_name").value.trim();
    const t_ic = document.getElementById("t_ic").value.trim();
    const t_email = document.getElementById("t_email").value.trim();
    const t_phonenum = document.getElementById("t_phonenum").value.trim();
    const t_pass = document.getElementById("t_pass").value.trim();

    // VALIDATION - Check each required field specifically
    if (!t_name) {
        alert("Please fill in the Full Name field!");
        return;
    }
    if (!t_ic) {
        alert("Please fill in the IC Number field!");
        return;
    }
    if (!t_email) {
        alert("Please fill in the Email Address field!");
        return;
    }
    if (!t_pass) {
        alert("Please fill in the Password field!");
        return;
    }

    // VALIDATION - IC Number must be numeric only and 10-20 digits
    if (isNaN(t_ic) || t_ic.length < 10 || t_ic.length > 20) {
        alert("Error: IC Number must contain only numbers, between 10-20 digits.");
        return;
    }

    // VALIDATION - Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(t_email)) {
        alert("Error: Please enter a valid email address.");
        return;
    }

    // VALIDATION - Phone number (if provided) must be numeric
    if (t_phonenum && (isNaN(t_phonenum) || t_phonenum.length < 10)) {
        alert("Error: Contact number must contain only numbers, minimum 10 digits.");
        return;
    }

    // VALIDATION - Password minimum 6 characters
    if (t_pass.length < 6) {
        alert("Error: Password must be at least 6 characters long.");
        return;
    }

    // Get existing teachers array
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    // VALIDATION - Check for duplicate IC
    if (teachers.some(t => t.t_ic === t_ic)) {
        alert("This IC Number already exists!");
        return;
    }

    // Create new teacher object
    const newTeacher = {
        t_id: 'T' + (teachers.length + 1).toString().padStart(3, '0'),
        t_name: t_name,
        t_ic: t_ic,
        t_email: t_email,
        t_phonenum: t_phonenum || "Not provided",
        t_pass: t_pass,
        pi_id: null
    };

    // Add to array
    teachers.push(newTeacher);

    // Save to localStorage
    localStorage.setItem("teachers", JSON.stringify(teachers));

    // Success message
    alert("Teacher account created successfully!");
    
    // Redirect to teacher accounts page
    window.location.href = "../delete-account/DeleteAccount.html";
}