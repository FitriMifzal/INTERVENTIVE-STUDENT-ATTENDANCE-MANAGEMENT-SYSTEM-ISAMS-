/* ============================================================
   CREATESTUDENT.JS — Page-specific logic
   User profile initialization handled by Sidebar.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    sessionStorage.setItem('profile_return_url', window.location.href);
    // Load classes into dropdown
    loadClassDropdown();
});

/* ────────────────────────────────────────────────────────
   LOAD CLASS DROPDOWN FROM LOCALSTORAGE
────────────────────────────────────────────────────────── */

function loadClassDropdown() {
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    const select = document.getElementById("cls");
    
    // Clear existing options (keep first default option)
    select.innerHTML = '<option value="">-- Select Class --</option>';
    
    if (classes.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No classes available. Create one first.";
        option.disabled = true;
        select.appendChild(option);
        return;
    }

    classes.forEach(cls => {
        const option = document.createElement("option");
        option.value = cls.classId;
        option.textContent = cls.classId + " - " + cls.className;
        select.appendChild(option);
    });
}

/* ────────────────────────────────────────────────────────
   HANDLE FORM SUBMISSION
────────────────────────────────────────────────────────── */

function handleForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const ic = document.getElementById("ic").value.trim();
    const cls = document.getElementById("cls").value;
    const address = document.getElementById("address").value.trim();
    const contactNo = document.getElementById("No").value.trim();

    // Validation - check if all fields filled
    if (!name || !ic || !cls || !contactNo) {
        alert("Please fill in all the information!");
        return;
    }

    // Validation - IC Number must be 12 digits
    if (ic.length !== 12 || isNaN(ic)) {
        alert("Error: IC Number must contain exactly 12 digits.");
        return;
    }

    // Validation - Contact No should be valid
    if (isNaN(contactNo) || contactNo.length < 10) {
        alert("Error: Contact number must contain at least 10 digits.");
        return;
    }

    // Get existing students array
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Check for duplicate IC
    if (students.some(s => s.ic === ic)) {
        alert("This IC Number already exists!");
        return;
    }

    // Create new student object
    const newStudent = {
        name: name,
        ic: ic,
        cls: cls,
        address: address || "Not provided",
        No: contactNo
    };

    // Add to array
    students.push(newStudent);

    // Save to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    alert("Student profile created successfully!");
    
    // Redirect to student list
    window.location.href = "../Student-List/StudentList.html";
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