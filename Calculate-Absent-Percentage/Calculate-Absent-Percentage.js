// Database Induk Pelajar KVDSMZ
const studentDatabase = [
    { name: "AUMAN BIN ABIDEN",              id: "2023122119" },
    { name: "ARISHA REENA BINTI AZMAL RAHIM", id: "2023112805" },
    { name: "ILYA SYAHIRAH BT HAIDI",         id: "2023112709" },
    { name: "MUHAMMAD SYAZANI BIN AHMAD",     id: "2023126582" },
    { name: "NUR AINA INSYIRAH BT ROSLAN",    id: "2023118834" },
    { name: "NUR ALIYAH BINTI RAZALI",        id: "2023117621" },
    { name: "NUR FARHANA BINTI ZULKIFLI",     id: "2023119045" },
    { name: "NURUL AIN BINTI HAMID",          id: "2023115503" },
    { name: "SITI HAJAR BINTI MOHD NOOR",     id: "2023120167" },
    { name: "WAN HAZIQ BIN WAN AZMAN",        id: "2023123412" }
];

let selectedStudent = null; // Menyimpan data pelajar yang berjaya dicari

// ── FUNGSI 1: CARI STUDENT BERDASARKAN ID ──
function searchStudent() {
    const inputID = document.getElementById("searchStudentID").value.trim();
    const msgElement = document.getElementById("searchMessage");
    const inputSection = document.getElementById("inputSection");
    
    // Cari matching ID dalam pangkalan data
    selectedStudent = studentDatabase.find(s => s.id === inputID);

    if (selectedStudent) {
        msgElement.style.color = "var(--kv-green)";
        msgElement.innerHTML = `✅ Pelajar Ditemui: ${selectedStudent.name}`;
        
        // Paparkan ruangan input borang data
        document.getElementById("targetStudentName").textContent = selectedStudent.name;
        inputSection.style.display = "block";
        
        // Reset input borang sebelum ini untuk kemudahan
        document.getElementById("hoursAbsent").value = "";
        document.getElementById("totalContactHours").value = "";
    } else {
        msgElement.style.color = "var(--kv-danger)";
        msgElement.innerHTML = "❌ Ralat: No. Pelajar tidak wujud dalam sistem. Sila cuba lagi.";
        inputSection.style.display = "none";
    }
}

// ── FUNGSI 2: KIRA PERATUS & CETAK DI JADUAL BAWAH ──
function processSelectedCalculation() {
    if (!selectedStudent) return;

    const courseCode = document.getElementById("courseCode").value.trim() || "TRC501";
    const hoursAbsentInput = document.getElementById("hoursAbsent").value;
    const totalContactInput = document.getElementById("totalContactHours").value;

    const absentHours = parseInt(hoursAbsentInput);
    const totalHours = parseInt(totalContactInput);

    // Validasi data input angka
    if (isNaN(absentHours) || isNaN(totalHours) || totalHours <= 0 || absentHours < 0) {
        alert("Sila pastikan nilai 'Hours Absent' dan 'Total Contact Hours' diisi dengan angka yang betul.");
        return;
    }

    if (absentHours > totalHours) {
        alert("Ralat: Jam tidak hadir tidak boleh melebihi jumlah keseluruhan jam kuliah!");
        return;
    }

    const attendedHours = totalHours - absentHours;
    
    // Mengira peratus kadar kehadiran (E.g., 15/20 = 75.0%)
    const attendancePercentage = ((attendedHours / totalHours) * 100).toFixed(1);
    
    // Status sekatan rasmi KVDSMZ (Sekatan Barred teraktif jika ketidakhadiran >= 20%, bermakna kehadiran < 80%)
    const absentRate = (absentHours / totalHours) * 100;
    const isBarred = absentRate >= 20.0;

    const statusClass = isBarred ? "badge-absent" : "badge-present";
    const statusText = isBarred ? "BARRED (Gagal Kehadiran)" : "ELIGIBLE (Layak Exam)";

    let actionHTML = "";
    if (isBarred) {
        actionHTML = `
            <div class="letter-actions">
                <button class="btn-letter btn-warning" onclick="generateLetterPDF('amaran', '${selectedStudent.name}', '${selectedStudent.id}', '${courseCode}', ${attendedHours}, ${absentHours}, ${attendancePercentage})">⚠️ Amaran</button>
                <button class="btn-letter btn-intervention" onclick="generateLetterPDF('intervensi', '${selectedStudent.name}', '${selectedStudent.id}', '${courseCode}', ${attendedHours}, ${absentHours}, ${attendancePercentage})">📩 Intervensi</button>
            </div>`;
    } else {
        actionHTML = `<span class="txt-disabled">No Action Needed</span>`;
    }

    // Suntat baris data pelajar ke dalam jadual keputusan di bawah
    const tbody = document.getElementById("calcBody");
    tbody.innerHTML = `
        <tr>
            <td style="font-weight: 600;">${selectedStudent.name}</td>
            <td>${selectedStudent.id}</td>
            <td>${attendedHours} Jam</td>
            <td>${absentHours} Jam</td>
            <td style="font-weight: 700; color: ${isBarred ? 'var(--kv-danger)' : 'var(--kv-green)'}">${attendancePercentage}%</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${actionHTML}</td>
        </tr>
    `;
}

// ── FUNGSI 3: JANA PDF WINDOW CETAKAN SURAT RASMI (A4) ──
function generateLetterPDF(type, name, id, course, attended, absent, displayPercent) {
    const todayDate = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    let letterTitle = "";
    let letterBody = "";
    
    if (type === "amaran") {
        letterTitle = `SURAT AMARAN KETIDAKHADIRAN KURSUS: ${course}`;
        letterBody = `
            <p>Dengan segala hormatnya, perkara di atas adalah dirujuk.</p>
            <p>2.&nbsp;&nbsp;Dukacita dimaklumkan bahawa anak/jagaan tuan/puan, <strong>${name}</strong> (No. Pelajar: <strong>${id}</strong>) yang mengikuti kursus <strong>${course}</strong> didapati gagal memenuhi syarat kehadiran minimum 80%.</p>
            <p>3.&nbsp;&nbsp;Berikut merupakan rekod analisis sistem kehadiran semasa:</p>
            <ul>
                <li>Jumlah Keseluruhan Kuliah: <strong>${attended + absent} Jam</strong></li>
                <li>Jumlah Jam Hadir: <strong>${attended} Jam</strong></li>
                <li>Jumlah Jam Tidak Hadir: <strong style="color:red;">${absent} Jam</strong></li>
                <li>Peratusan Kehadiran Semasa: <strong>${displayPercent}%</strong></li>
            </ul>
            <p>4.&nbsp;&nbsp;Sehubungan dengan itu, status anak jagaan tuan/puan kini bertukar kepada <strong>BARRED</strong>. Sila hadir ke kolej bersama pelajar untuk memberikan surat tunjuk sebab rasmi bagi mengelakkan tindakan lanjut.</p>
        `;
    } else {
        letterTitle = `SURAT JEMPUTAN PROGRAM INTERVENSI AKADEMIK`;
        letterBody = `
            <p>Merujuk kepada ketidakhadiran kritikal bagi kursus <strong>${course}</strong>, anak jagaan tuan/puan <strong>${name}</strong> (${id}) diwajibkan untuk melalui proses intervensi.</p>
            <p>2.&nbsp;&nbsp;Tuan/puan dengan ini diminta hadir ke kolej bagi membincangkan pemulihan prestasi kehadiran anak jagaan tuan/puan:</p>
            <table style="width:100%; border:none; margin: 15px 0;">
                <tr><td style="width:140px; border:none; padding:4px 0;"><strong>Tempat Sesi</strong></td><td style="border:none; padding:4px 0;">: Bilik Intervensi Kaunseling, KVDSMZ</td></tr>
                <tr><td style="border:none; padding:4px 0;"><strong>Tindakan</strong></td><td style="border:none; padding:4px 0;">: Sila bawa bersama dokumen sokongan (MC / Surat Rasmi)</td></tr>
            </table>
        `;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    printWindow.document.write(`
        <html>
        <head>
            <title>Cetak_Surat_${id}</title>
            <style>
                @page { size: A4; margin: 2.5cm; }
                body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #000; padding: 20px; }
                .letter-head { text-align: center; font-weight: bold; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 25px; }
                .meta-table { width: 100%; margin-bottom: 20px; }
                .meta-table td { vertical-align: top; }
                .title { font-weight: bold; text-transform: uppercase; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 2px; }
                .footer { margin-top: 50px; }
            </style>
        </head>
        <body>
            <div class="letter-head">
                KOLEJ VOKASIONAL DATUK SERI MOHD ZIN<br>
                <span style="font-size:10pt; font-weight:normal;">JALAN GETAH, 78000 ALOR GAJAH, MELAKA</span>
            </div>
            <table class="meta-table">
                <tr>
                    <td><strong>Kepada:</strong><br>Ibu bapa / Penjaga<br>Pelajar: ${name} (${id})</td>
                    <td style="text-align: right;"><strong>Ruj:</strong> KVDSMZ/INT/${id}<br><strong>Tarikh:</strong> ${todayDate}</td>
                </tr>
            </table>
            <div class="title">${letterTitle}</div>
            <div>${letterBody}</div>
            <div class="footer">
                <p>Yang menjalankan amanah,</p><br><br>
                <strong>.....................................</strong><br>
                b.p. Pengarah Kolej Vokasional Datuk Seri Mohd Zin
            </div>
            <script>
                window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}