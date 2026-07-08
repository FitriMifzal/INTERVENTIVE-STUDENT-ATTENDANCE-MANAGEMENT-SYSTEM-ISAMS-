const params = new URLSearchParams(window.location.search);
const classIdFromURL = params.get("id");

// State variables
let classes = JSON.parse(localStorage.getItem("classes")) || [];
let selectedClass = null;

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);

    // Load class data for editing
    loadClassData();
});

function loadClassData() {
    // Find class by class_id, classCode, or classId
    if (classIdFromURL) {
        selectedClass = classes.find(c => 
            c.class_id == classIdFromURL || 
            c.classCode === classIdFromURL || 
            c.classId === classIdFromURL
        );
    }

    // Check if class exists
    if (!selectedClass) {
        alert("Class not found!");
        window.location.href = "../Student Class/StudentClass.html";
        return;
    }

    // Populate form with class data
    const classCodeDisplay = selectedClass.classCode || selectedClass.classId || 'N/A';
    const classNameDisplay = selectedClass.class_name || selectedClass.className || 'N/A';
    
    document.getElementById("classId").value = classCodeDisplay;
    document.getElementById("className").value = classNameDisplay;
}

function updateClass() {
    const updatedName = document.getElementById("className").value.trim();

    // Validation
    if (!updatedName) {
        alert("Please fill in the Class Name!");
        return;
    }

    if (selectedClass) {
        // Update class data - update both formats for consistency
        selectedClass.class_name = updatedName;
        selectedClass.className = updatedName;

        // Save to localStorage
        localStorage.setItem("classes", JSON.stringify(classes));

        alert("Classroom updated successfully!");

        // Redirect to class list
        window.location.href = "../Student Class/StudentClass.html";
    }
}

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