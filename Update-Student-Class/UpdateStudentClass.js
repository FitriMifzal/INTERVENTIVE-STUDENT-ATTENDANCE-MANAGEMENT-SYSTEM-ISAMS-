const params = new URLSearchParams(window.location.search);
const classIdFromURL = params.get("id");

// State variables
let classes = JSON.parse(localStorage.getItem("classes")) || [];
let selectedClass = classes.find(c => c.classId === classIdFromURL);

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);

    // Load class data for editing
    loadClassData();
});

function loadClassData() {
    // Check if class exists
    if (classIdFromURL && !selectedClass) {
        alert("Class not found!");
        window.location.href = "../Student Class/StudentClass.html";
        return;
    }

    // If class found, populate form
    if (selectedClass) {
        document.getElementById("classId").value = selectedClass.classId;
        document.getElementById("className").value = selectedClass.className;
    } else {
        alert("No class ID provided");
        window.location.href = "../Student Class/StudentClass.html";
    }
}


function updateClass() {
    const updatedName = document.getElementById("className").value.trim();

    // Validation
    if (!updatedName) {
        alert("Please fill in the Class Name!");
        return;
    }

    if (selectedClass) {
        // Update class data
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