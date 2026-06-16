/* ===== JAVASCRIPT FOR CREATE STUDENT ABSENT RECORD ===== */
/* global jspdf */

let currentStudentIndex = null;
let currentStudent = {};
let currentLetterType = "";
let currentFileUrl = null;
let statusEditingIndex = null;
let editingRecordIndex = null;

/* -------------------------------------------------------
   PAGE INITIALISATION
------------------------------------------------------- */
window.onload = function () {
    const role = localStorage.getItem('reg_role') || "Subject Teacher";
    const name = localStorage.getItem('reg_name') || "User";

    document.getElementById('display-role').innerText = role;
    document.getElementById('user-fullname').innerText = name;

    const initialElement = document.getElementById('user-initial');
    initialElement.innerText = (name && name !== "User") ? name.charAt(0).toUpperCase() : "?";

    const navAccount = document.getElementById('nav-account');
    if (navAccount) navAccount.style.display = (role === "Penyelaras Intervensi") ? "flex" : "none";

    const urlParams = new URLSearchParams(window.location.search);
    const studentId   = urlParams.get('student_id');
    const recordIndex = urlParams.get('record_index');

    if (studentId !== null) setupForm(parseInt(studentId), recordIndex);
    else document.getElementById('bktsForm').style.display = 'none';

    renderTable(role);
};

/* -------------------------------------------------------
   TABLE
------------------------------------------------------- */
function handleRowClick(row) {
    const allRows = document.querySelectorAll('#studentTableBody tr');
    allRows.forEach(r => { if (r !== row) r.classList.remove('selected'); });
    row.classList.toggle('selected');
    const isAnySelected = document.querySelector('tr.selected');
    document.getElementById('action-header').style.display = isAnySelected ? 'table-cell' : 'none';
}

function renderTable(role) {
    const records = JSON.parse(localStorage.getItem("absent_records")) || [];
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = "";

    records.forEach((r, index) => {
        let statusClass = "status-active";
        if (r.status === "Warning Sent")           statusClass = "status-warning";
        if (r.status === "Intervention Required")  statusClass = "status-intervention";
        if (r.status === "Under Monitoring")       statusClass = "status-monitoring";

        let actionButtons = `<button class="btn btn-update-registry" onclick="event.stopPropagation(); window.location.href='absent_record.html?student_id=${r.student_index}&record_index=${index}'">Update</button>`;

        if (role === "Subject Teacher") {
            actionButtons += `<button class="btn btn-letter" onclick="event.stopPropagation(); openLetterModal('${r.name}')">Upload Letter</button>`;
        } else {
            actionButtons += `
                <button class="btn btn-bkts-download" onclick="event.stopPropagation(); downloadBKTS(${index})">BKTS</button>
                <button class="btn btn-warning" onclick="event.stopPropagation(); openFormalLetter('warning', '${r.name}', '${r.id}', '${r.percent}')">Warning</button>
                <button class="btn btn-intervention" onclick="event.stopPropagation(); openFormalLetter('intervention', '${r.name}', '${r.id}', '${r.percent}')">Intervention</button>
                <button class="btn btn-status-update" onclick="event.stopPropagation(); openStatusModal(${index})">Update Status</button>`;
        }

        const tr = document.createElement('tr');
        tr.onclick = function () { handleRowClick(this); };
        tr.innerHTML = `
            <td>${r.name}</td>
            <td>${r.id}</td>
            <td style="font-weight: bold; color: #003366;">${r.courseCode}</td>
            <td class="student-percent">${r.percent}</td>
            <td><span class="status-badge ${statusClass}">${r.status || 'Normal'}</span></td>
            <td class="action-cell">${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterTable() {
    let input = document.getElementById("studentSearch").value.toUpperCase();
    let rows  = document.getElementById("studentTableBody").getElementsByTagName("tr");
    for (let row of rows) row.style.display = row.innerText.toUpperCase().includes(input) ? "" : "none";
}

/* -------------------------------------------------------
   FORM – SETUP, CALCULATE & SAVE
------------------------------------------------------- */
function setupForm(index, rIndex) {
    const students      = JSON.parse(localStorage.getItem("students"))       || [];
    const absentRecords = JSON.parse(localStorage.getItem("absent_records")) || [];

    if (students[index]) {
        currentStudentIndex = index;
        const s = students[index];
        document.getElementById('bktsForm').style.display = 'block';
        document.getElementById('target-student-info').innerText = "Student: " + s.name + " (" + (s.ic || s.id) + ")";

        if (rIndex !== null && absentRecords[rIndex]) {
            const r = absentRecords[rIndex];
            document.getElementById('course-code').value  = r.courseCode;
            document.getElementById('absent-hrs').value   = r.absentHrs;
            document.getElementById('total-hrs').value    = r.totalHrs;
            document.getElementById('percent-val').innerText = r.percent;
            document.getElementById('bkts-title').innerText  = "Update Student Absent Record";
            editingRecordIndex = rIndex;
        }
    }
}

function calculatePercentage() {
    const abs = parseFloat(document.getElementById('absent-hrs').value) || 0;
    const tot = parseFloat(document.getElementById('total-hrs').value)  || 0;
    const res = tot > 0 ? (abs / tot) * 100 : 0;
    document.getElementById('percent-val').innerText = res.toFixed(2) + "%";
}

function saveBKTS() {
    const code     = document.getElementById('course-code').value.trim().toUpperCase();
    const absInput = parseFloat(document.getElementById('absent-hrs').value) || 0;
    const totInput = parseFloat(document.getElementById('total-hrs').value)  || 0;

    if (!code || absInput <= 0 || totInput <= 0) {
        document.getElementById('error-msg').innerText = "Please complete all information correctly.";
        document.getElementById('errorModal').classList.add('show');
        return;
    }

    const students      = JSON.parse(localStorage.getItem("students"))       || [];
    let absentRecords   = JSON.parse(localStorage.getItem("absent_records")) || [];

    if (currentStudentIndex !== null && students[currentStudentIndex]) {
        const studentBase = students[currentStudentIndex];
        const studentID   = studentBase.ic || studentBase.id;
        const percentVal  = (absInput / totInput) * 100;
        let finalStatus   = percentVal > 10 ? "Under Monitoring" : "Normal";

        const recordData = {
            student_index: currentStudentIndex,
            name:          studentBase.name,
            id:            studentID,
            courseCode:    code,
            absentHrs:     absInput,
            totalHrs:      totInput,
            percent:       document.getElementById('percent-val').innerText,
            status:        finalStatus
        };

        if (editingRecordIndex !== null && editingRecordIndex !== undefined) {
            absentRecords[editingRecordIndex] = recordData;
            editingRecordIndex = null;
        } else {
            absentRecords.push(recordData);
        }

        localStorage.setItem("absent_records", JSON.stringify(absentRecords));
        document.getElementById('success-msg').innerText = "Record saved and updated successfully!";
        document.getElementById('successModal').classList.add('show');
        setTimeout(() => { window.location.href = "student-list.html"; }, 1200);
    }
}

/* -------------------------------------------------------
   PDF – BKTS DOWNLOAD
------------------------------------------------------- */
function downloadBKTS(index) {
    const records = JSON.parse(localStorage.getItem("absent_records")) || [];
    const r       = records[index];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BORANG PELAJAR TIDAK HADIR KE KULIAH TANPA SEBAB", 105, 15, { align: "center" });
    doc.text("LAMPIRAN 1", 200, 15, { align: "right" });
    doc.text("BKT-07/01", 200, 20, { align: "right" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("NAMA PELAJAR",       20, 35);
    doc.text(`: ${r.name.toUpperCase()}`,          70, 35);
    doc.text("NO. KAD PENGENALAN", 20, 42);
    doc.text(`: ${r.id}`,                          70, 42);
    doc.text("PROGRAM",            20, 49);
    doc.text(": DIPLOMA TEKNOLOGI MAKLUMAT",        70, 49);
    doc.text("KOD/KURSUS",         20, 56);
    doc.text(`: ${r.courseCode}`,                  70, 56);

    doc.autoTable({
        startY: 65,
        head: [[
            "BIL", "TARIKH", "JUMLAH JAM KULIAH\nTIDAK HADIR",
            "JUMLAH JAM\nPERTEMUAN\n(14 MINGGU)", "PERATUS\nKETIDAK\nHADIRAN", "CATATAN"
        ]],
        body: [
            ["1", "-", r.absentHrs, r.totalHrs, r.percent, "Tanpa Sebab"],
            [{ content: "JUMLAH", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, r.absentHrs, r.totalHrs, r.percent, ""]
        ],
        theme: 'grid',
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 8, halign: 'center' },
        styles:     { fontSize: 9, halign: 'center' }
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    doc.text("(                                                  )", 20,  finalY);
    doc.text("Disediakan oleh",                                      20,  finalY + 7);
    doc.text("Pensyarah",                                             20,  finalY + 12);
    doc.text("Tarikh:",                                               20,  finalY + 22);
    doc.text("(                                                  )", 120, finalY);
    doc.text("Disahkan oleh",                                        120, finalY + 7);
    doc.text("Ketua Jabatan / Ketua Program / Ketua Unit",           120, finalY + 12, { maxWidth: 70 });
    doc.text("Tarikh:",                                               120, finalY + 22);

    doc.setFontSize(8);
    doc.text("SK Fail Intervensi",      20, 280);
    doc.text("Unit Psikologi dan Kerjaya", 20, 285);
    doc.save(`BKT_07_01_${r.name}.pdf`);
}

/* -------------------------------------------------------
   STATUS UPDATE MODAL
------------------------------------------------------- */
function openStatusModal(index) {
    const records = JSON.parse(localStorage.getItem("absent_records")) || [];
    const r = records[index];
    statusEditingIndex = index;
    document.getElementById('status-student-info').innerText  = r.name + " (" + r.id + ")";
    document.getElementById('status-percent-display').innerText = r.percent;
    document.getElementById('new-status-select').value        = r.status || "Normal";
    document.getElementById('statusModal').classList.add('show');
}

function saveStatusUpdate() {
    let records = JSON.parse(localStorage.getItem("absent_records")) || [];
    if (statusEditingIndex !== null && records[statusEditingIndex]) {
        records[statusEditingIndex].status = document.getElementById('new-status-select').value;
        localStorage.setItem("absent_records", JSON.stringify(records));
        closeModal('statusModal');
        document.getElementById('success-msg').innerText = "Status updated successfully!";
        document.getElementById('successModal').classList.add('show');
        renderTable(localStorage.getItem('reg_role'));
    }
}

/* -------------------------------------------------------
   FORMAL LETTER MODAL
------------------------------------------------------- */
function openFormalLetter(type, name, id, percent) {
    const numPercent = parseFloat(percent);
    if (numPercent <= 10) {
        document.getElementById('error-msg').innerText = "Absence Percentage must exceed 10% for letters.";
        document.getElementById('errorModal').classList.add('show');
        return;
    }

    currentStudent     = { name, id, percent };
    currentLetterType  = type;

    const today      = new Date();
    const dateString = today.getDate() + " " + today.toLocaleString('default', { month: 'long' }).toUpperCase() + " " + today.getFullYear();

    let title  = (type === 'warning') ? "AMARAN PERTAMA" : "INTERVENSI KAUNSELING";
    let refNo  = "Ruj. Kami : KVDMZ/HEP/700-3/2 JLD 2( )";

    let content = `KOLEJ VOKASIONAL DATO SERI MD ZIN\nJALAN GANTUNG, 78000 ALOR GAJAH\nMELAKA\nTEL: 06-5561253  FAX: 06-5561021\n------------------------------------------------------------------------------------------\n`;
    content += `${refNo}\nTarikh : ${dateString}\n\n`;
    content += `Kepada:\nIBU BAPA / PENJAGA\n(Pelajar: ${name})\nID: ${id}\n\nTuan/Puan,\n\n`;
    content += `PEMBERITAHUAN KETIDAKHADIRAN KE KOLEJ : ${title}\n\n`;

    if (type === 'warning') {
        content += `Dimaklumkan bahawa anak/jagaan tuan ${name} dari program yang berkaitan, tidak hadir ke kolej sehingga mencapai peratus ketidakhadiran sebanyak ${percent}.\n\n`;
        content += `2.  Sila bawa surat tunjuk sebab dan datang sendiri ke kolej dalam tempoh 7 hari daripada tarikh surat ini untuk memberi penjelasan mengenai ketidakhadiran anak/jagaan tuan.\n\n`;
    } else {
        content += `Dimaklumkan bahawa rekod kehadiran anak/jagaan tuan ${name} berada pada tahap kritikal iaitu ${percent}. Pihak kolej memohon kerjasama tuan untuk hadir bersama anak jagaan bagi sesi intervensi.\n\n`;
        content += `2.  Sila hubungi Unit Psikologi dan Kerjaya dalam tempoh 3 hari bekerja untuk menetapkan slot pertemuan.\n\n`;
    }

    content += `Sekian, terima kasih.\n\n"BERKHIDMAT UNTUK NEGARA"\n\nSaya yang menurut perintah,\n\n\n..........................................\n(PENGARAH)\nKolej Vokasional Dato Seri Md Zin\n\ns.k.  Fail Ibu bapa\n      Fail Kolej\n      Koordinator Program`;

    document.getElementById('formal-letter-body').innerText = content;
    document.getElementById('letterEditorModal').classList.add('show');
}

function downloadFormalPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(document.getElementById('formal-letter-body').innerText, 10, 10);
    doc.save(`Letter_${currentStudent.id}.pdf`);
}

/* -------------------------------------------------------
   UPLOAD LETTER MODAL
------------------------------------------------------- */
function openLetterModal(name) {
    document.getElementById('letter-student-name').innerText = name;
    document.getElementById('letterModal').classList.add('show');
}

function handleFilePreview() {
    const fileInput = document.getElementById('absent-file');
    if (fileInput.files[0]) {
        currentFileUrl = URL.createObjectURL(fileInput.files[0]);
        document.getElementById('view-file-btn').style.display = 'block';
    }
}

function viewUploadedFile() { if (currentFileUrl) window.open(currentFileUrl, '_blank'); }

function checkDateValidity() {
    const dateInput = document.getElementById('absent-date');
    const diffDays  = (new Date() - new Date(dateInput.value)) / (1000 * 60 * 60 * 24);
    if (diffDays > 7 || diffDays < 0) {
        document.getElementById('error-msg').innerText = "Error: Invalid date or exceeds 7 days.";
        document.getElementById('errorModal').classList.add('show');
        dateInput.value = "";
    }
}

function processUpload() {
    closeModal('letterModal');
    document.getElementById('success-msg').innerText = "Letter uploaded successfully!";
    document.getElementById('successModal').classList.add('show');
}

/* -------------------------------------------------------
   UTILITY
------------------------------------------------------- */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function logoutUser() { if (confirm("Logout?")) window.location.href = "login.html"; }
