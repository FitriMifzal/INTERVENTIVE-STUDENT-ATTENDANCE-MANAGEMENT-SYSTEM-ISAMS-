// Data pelajar simulasi mengikut sistem asal
const students = [
    { name: "AUMAN BIN ABIDEN",              id: "2023122119", baseAbsent: 1 },
    { name: "ARISHA REENA BINTI AZMAL RAHIM", id: "2023112805", baseAbsent: 0 },
    { name: "ILYA SYAHIRAH BT HAIDI",         id: "2023112709", baseAbsent: 5 },
    { name: "MUHAMMAD SYAZANI BIN AHMAD",     id: "2023126582", baseAbsent: 0 },
    { name: "NUR AINA INSYIRAH BT ROSLAN",    id: "2023118834", baseAbsent: 2 },
    { name: "NUR ALIYAH BINTI RAZALI",        id: "2023117621", baseAbsent: 1 },
    { name: "NUR FARHANA BINTI ZULKIFLI",     id: "2023119045", baseAbsent: 6 },
    { name: "NURUL AIN BINTI HAMID",          id: "2023115503", baseAbsent: 1 },
    { name: "SITI HAJAR BINTI MOHD NOOR",     id: "2023120167", baseAbsent: 3 },
    { name: "WAN HAZIQ BIN WAN AZMAN",        id: "2023123412", baseAbsent: 0 }
];

// Dipanggil HANYA apabila butang "Calculate Analytics" diklik
function triggerCalculation() {
    const totalHoursInput = document.getElementById("contactHours").value;
    const totalHours = parseInt(totalHoursInput);

    if (totalHours && totalHours > 0) {
        calculatePercentages(totalHours);
    } else {
        alert("Sila masukkan 'Jumlah Keseluruhan Jam Kuliah' yang sah terlebih dahulu.");
    }
}

function calculatePercentages(totalHours) {
    const tbody = document.getElementById("calcBody");
    tbody.innerHTML = "";
    const courseCode = document.getElementById("courseCode").value.trim() || "TRC501";
    
    students.forEach(s => {
        const absentHours = Math.min(s.baseAbsent, totalHours);
        const attendedHours = totalHours - absentHours;
        
        // Mengikut imej paparan sebenar user: Peratus dipaparkan sebagai kadar KEHADIRAN (Contoh: 19/20 = 95%)
        const attendancePercentage = ((attendedHours / totalHours) * 100).toFixed(1);
        
        // Kira peratus ketidakhadiran tulen untuk semakan sekatan bar (Ketidakhadiran >= 20% bermakna Kehadiran <= 80%)
        const absentRate = (absentHours / totalHours) * 100;
        const isBarred = absentRate >= 20.0;
        
        const statusClass = isBarred ? "badge-absent" : "badge-present";
        const statusText = isBarred ? "BARRED (Gagal Kehadiran)" : "ELIGIBLE (Layak Exam)";
        
        let actionHTML = "";
        if (isBarred) {
            actionHTML = `
                <div class="letter-actions">
                    <button class="btn-letter btn-warning" onclick="generateLetterPDF('amaran', '${s.name}', '${s.id}', '${courseCode}', ${attendedHours}, ${absentHours}, ${attendancePercentage})">⚠️ Amaran</button>
                    <button class="btn-letter btn-intervention" onclick="generateLetterPDF('intervensi', '${s.name}', '${s.id}', '${courseCode}', ${attendedHours}, ${absentHours}, ${attendancePercentage})">📩 Intervensi</button>
                </div>`;
        } else {
            actionHTML = `<span class="txt-disabled">No Action Needed</span>`;
        }

        const tr = document.createElement("tr");
        tr.dataset.name = s.name.toLowerCase();
        tr.dataset.id = s.id;
        
        tr.innerHTML = `
            <td style="font-weight: 600;">${s.name}</td>
            <td>${s.id}</td>
            <td>${attendedHours} Jam</td>
            <td>${absentHours} Jam</td>
            <td style="font-weight: 700; color: ${isBarred ? 'var(--kv-danger)' : 'var(--kv-green)'}">${attendancePercentage}%</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${actionHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Penjanaan Fail Cetakan PDF Berformat A4 Rasmi
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
                body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #000; }
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

function filterCalcGrid() {
    const q = document.getElementById('calcSearch').value.toLowerCase();
    document.querySelectorAll('#calcBody tr').forEach(tr => {
        if(tr.cells.length > 1) {
            const match = tr.dataset.name.includes(q) || tr.dataset.id.includes(q);
            tr.style.display = match ? '' : 'none';
        }
    });
}

function exportAnalysisCSV() {
    const code = document.getElementById("courseCode").value.trim() || "Course";
    let csv = 'Student Name,Student ID,Hours Attended,Absent Hours,Percentage (%),Status\n';
    document.querySelectorAll('#calcBody tr').forEach(tr => {
        if (tr.style.display === 'none' || tr.cells.length < 6) return;
        const cells = tr.querySelectorAll('td');
        csv += `"${cells[0].textContent.trim()}","${cells[1].textContent.trim()}","${cells[2].textContent.trim()}","${cells[3].textContent.trim()}","${cells[4].textContent.trim()}","${cells[5].textContent.trim()}"\n`;
    });
    const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const a = document.createElement('a');
    a.href = uri;
    a.download = `Attendance_Analysis_${code}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}