
    window.onload = function() {
        const storedName = localStorage.getItem('reg_name') || "Guest User";
        const storedRole = localStorage.getItem('reg_role') || "Staff";

        document.getElementById('user-fullname').innerText = storedName;
        document.getElementById('display-role').innerText = storedRole;
        document.getElementById('user-initial').innerText = storedName.charAt(0).toUpperCase();

        if (storedRole === "Penyelaras Intervensi") {
            const acc = document.getElementById('nav-account');
            if(acc) acc.style.display = 'flex';
        }
    };

    // Function to handle form submission
    function handleForm(event) {
        event.preventDefault(); // Prevents the page from refreshing
        
        const cid = document.getElementById("classId").value.trim();
        const cname = document.getElementById("className").value.trim();

        if (!cid || !cname) {
            alert("Please fill in all the information!");
            return;
        }

        let classes = JSON.parse(localStorage.getItem("classes")) || [];

        // Check if Class ID already exists
        if (classes.some(c => c.classId.toLowerCase() === cid.toLowerCase())) {
            alert("This Class ID already exists!");
            return;
        }

        // Save data (isArchived: false so it appears in main.html table)
        const newClass = {
            classId: cid,
            className: cname,
            isArchived: false 
        };

        classes.push(newClass);
        localStorage.setItem("classes", JSON.stringify(classes));

        alert("Class successfully registered!");
        
        // Redirect to the student class list page
        window.location.href = "../Student-Class/StudentClass.html";
    }

    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.getElementById('main-wrapper').classList.toggle('expanded');
    }

    function logoutUser() {
        if(confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = "../create-account/CreateAccount.html";
        }
    }

