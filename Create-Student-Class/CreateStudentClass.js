window.onload = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = "login.html";
        return;
    }

    const storedName = localStorage.getItem('active_name') || "Guest User";
    const storedRole = localStorage.getItem('active_role') || "Subject Teacher";

    document.getElementById('user-fullname').innerText = storedName;
    document.getElementById('display-role').innerText = storedRole;
    document.getElementById('user-initial').innerText = storedName.charAt(0).toUpperCase();

    if (storedRole === "Penyelaras Intervensi") {
        const acc = document.getElementById('nav-account');
        if(acc) acc.style.display = 'flex';
    }
};

// Fungsi menguruskan penyerahan data borang pendaftaran kelas
function handleForm(event) {
    event.preventDefault(); 
    
    const cid = document.getElementById("classId").value.trim();
    const cname = document.getElementById("className").value.trim();

    if (!cid || !cname) {
        alert("Please fill in all the information!");
        return;
    }

    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    // Semakan untuk memastikan kod kelas tidak bertindih
    if (classes.some(c => c.classId.toLowerCase() === cid.toLowerCase())) {
        alert("This Class ID already exists!");
        return;
    }

    const newClass = {
        classId: cid,
        className: cname,
        isArchived: false 
    };

    classes.push(newClass);
    localStorage.setItem("classes", JSON.stringify(classes));

    alert("Class successfully registered!");
    window.location.href = "main.html";
}

// Fungsi interaksi sidebar toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

// Fungsi log keluar sistem
function logoutUser() {
    if(confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "login.html";
    }
}