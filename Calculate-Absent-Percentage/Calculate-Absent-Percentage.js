const students = [
    { name: "AUMAN BIN ABIDEN",              id: "2023122119", baseAttended: 42 },
    { name: "ARISHA REENA BINTI AZMAL RAHIM", id: "2023112805", baseAttended: 44 },
    { name: "ILYA SYAHIRAH BT HAIDI",         id: "2023112709", baseAttended: 34 }, // Lebih 20% tidak hadir jika total 45 Jam
    { name: "MUHAMMAD SYAZANI BIN AHMAD",     id: "2023126582", baseAttended: 45 },
    { name: "NUR AINA INSYIRAH BT ROSLAN",    id: "2023118834", baseAttended: 41 },
    { name: "NUR ALIYAH BINTI RAZALI",        id: "2023117621", baseAttended: 43 },
    { name: "NUR FARHANA BINTI ZULKIFLI",     id: "2023119045", baseAttended: 32 }, // Lebih 20% tidak hadir
    { name: "NURUL AIN BINTI HAMID",          id: "2023115503", baseAttended: 44 },
    { name: "SITI HAJAR BINTI MOHD NOOR",     id: "2023120167", baseAttended: 40 },
    { name: "WAN HAZIQ BIN WAN AZMAN",        id: "2023123412", baseAttended: 45 }
];

function triggerCalculation() {
    const contactHoursInput = document.getElementById("contactHours").value;
    const totalHours = parseInt(contactHoursInput);

    if (totalHours && totalHours > 0) {
        calculatePercentages(totalHours);
    } else {
        document.getElementById("calcBody").innerHTML = `
            <tr>
                <td colspan="7" style="color: #64748b; padding: 20px; text-align: center;">
                    Sila masukkan "Total Contact Hours Required" di atas untuk memulakan pengiraan.
                </td>
            </tr>`;
    }
}

function calculatePercentages(totalHours) {
    const tbody = document.getElementById("calcBody");
    tbody.innerHTML = "";
    const courseCode = document.getElementById("courseCode").value.trim() || "KURSUS MOCK";
    
    students.forEach(s => {
        let hoursAttended = s.baseAttended;
        if (hoursAttended > totalHours) {
            hoursAttended = Math.round(totalHours * (s.baseAttended / 45));
        }
        hoursAttended = Math.min(hoursAttended, totalHours);
        
        const absentHours = totalHours - hoursAttended;
        const percentage = ((hoursAttended / totalHours) * 100).toFixed(1);
        const absentPercentage = (100 - percentage).toFixed(1);
        
        // Aturan: Jika peratusan tidak hadir >= 20% (Peratus kehadiran < 80%)
        const isBarred = percentage < 80;
        const statusClass = isBarred ? "status-danger" : "status-safe";
        const statusText = isBarred ? "BARRED (Gagal Kehadiran)" : "ELIGIBLE (Layak Exam)";
        
        // Bina butang surat sekiranya absent mencapai 20% atau lebih
        let actionColumnHTML = "";
        if (isBarred) {
            actionColumnHTML = `
                <div class="letter-actions-container">
                    <button class="btn-letter btn-warning" onclick="downloadWarningLetter('${s.name}', '${s.id}', '${courseCode}', ${hoursAttended}, ${absentHours}, ${percentage}, ${absentPercentage})">⚠️ Amaran</button>
                    <button class="btn-letter btn-intervention" onclick="downloadInterventionLetter('${s.name}', '${s.id}', '${courseCode}', ${hoursAttended}, ${absentHours}, ${percentage}, ${absentPercentage})">📩 Intervensi</button>
                </div>`;
        } else {
            actionColumnHTML = `<span class="txt-disabled">No Action Needed</span>`;
        }

        const tr = document.createElement("tr");
        tr.dataset.name = s.name.toLowerCase();
        tr.dataset.id = s.id;
        
        tr.innerHTML = `
            <td style="font-weight: 600;">${s.name}</td>
            <td>${s.id}</td>
            <td>${hoursAttended} Jam</td>
            <td>${absentHours} Jam</td>
            <td class="percentage-text" style="color: ${isBarred ? 'var(--kv-danger)' : 'var(--kv-green)'}">${percentage}%</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td style="text-align: center;">${actionColumnHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ── FUNGSI DOWNLOAD SURAT AMARAN (WARNING LETTER) ──
function downloadWarningLetter(name, id, course, attended, absent, percent, absentPercent) {
    const text = `KOLEJ VOKASIONAL DATUK SERI MOHD ZIN
JALAN GETAH, 78000 ALOR GAJAH, MELAKA
----------------------------------------------------------------------
Ruj. Kami: KVDSMZ/AMS/2026/AMR
Tarikh: ${new Date().toLocaleDateString('ms-MY')}

Kepada,
Ibu bapa / Penjaga kepada Pelajar: ${name}

Tuan/Puan,

SURAT AMARAN KETIDAKHADIRAN KURSUS: ${course}

Dengan segala hormatnya, perkara di atas adalah dirujuk.

2.  Dukacita dimaklumkan bahawa anak/jagaan tuan/puan, ${name} (No. Pelajar: ${id}) yang mengikuti kursus ${course} didapati telah gagal memenuhi syarat kehadiran minimum kolej.

3.  Berikut adalah rekod analisis semasa ketidakhadiran anak/jagaan tuan/puan:
    - Jumlah Jam Kuliah yang Diikuti: ${attended} Jam
    - Jumlah Jam Tidak Hadir (Ponteng): ${absent} Jam
    - Peratusan Kehadiran Semasa: ${percent}%
    - Peratusan Ketidakhadiran (Absent): ${absentPercent}%

4.  Pihak pengurusan kolej ingin menegaskan bahawa kegagalan mengekalkan peratusan kehadiran di atas 80% boleh menyebabkan anak/jagaan tuan/puan DI-BARRED (Dihalang) daripada menduduki Peperiksaan Akhir/Penilaian Akhir bagi semester ini.

Sila hubungi pensyarah kursus dengan kadar segera untuk mengemukakan surat doktor (MC) atau alasan yang munasabah.

Sekian, terima kasih.

"MALAYSIA MADANI"

Yang menjalankan amanah,

.....................................
(PENSYARAH KURSUS ${course})
Kolej Vokasional Datuk Seri Mohd Zin`;

    saveFileBlob(`Surat_Amaran_${id}.txt`, text);
}

// ── FUNGSI DOWNLOAD SURAT INTERVENSI (INTERVENTION LETTER) ──
function downloadInterventionLetter(name, id, course, attended, absent, percent, absentPercent) {
    const text = `KOLEJ VOKASIONAL DATUK SERI MOHD ZIN
JALAN GETAH, 78000 ALOR GAJAH, MELAKA
----------------------------------------------------------------------
Ruj. Kami: KVDSMZ/AMS/2026/INT
Tarikh: ${new Date().toLocaleDateString('ms-MY')}

Kepada,
Ibu bapa / Penjaga kepada Pelajar: ${name}

Tuan/Puan,

JEMPUTAN MENGHADIRI SESI INTERVENSI KEHADIRAN PELAJAR

Merujuk kepada rekod sistem kehadiran, anak/jagaan tuan/puan, ${name} (No. Pelajar: ${id}) kini berisiko tinggi gagal dalam kursus ${course} disebabkan masalah kehadiran.

2.  Sehingga tarikh hari ini, rekod rasmi menunjukkan:
    - Ketidakhadiran: ${absent} Jam kuliah (Bersamaan ${absentPercent}% Absent)
    - Kehadiran Semasa: Hanya ${percent}% (Di bawah syarat wajib kementerian 80%)

3.  Sehubungan dengan itu, tuan/puan dengan segala hormatnya DIJEMPUT HADIR ke kolej bagi sesi Program Intervensi Akademik & Sahsiah untuk membincangkan jalan penyelesaian terbaik demi masa depan pelajar.

    Tarikh / Hari : (Sila rujuk Ketua Program)
    Masa          : 9:00 Pagi - 11:00 Pagi
    Tempat        : Bilik Intervensi / Bilik Pensyarah KVDSMZ

Kerjasama dan kehadiran pihak tuan/puan amat kami hargai bagi mengelakkan anak tuan/puan menerima status "BARRED PEPERIKSAAN".

Sekian, terima kasih.

Yang benar,

.....................................
(UNIT INTERVENSI & PENGURUSAN SMS)
Kolej Vokasional Datuk Seri Mohd Zin`;

    saveFileBlob(`Surat_Intervensi_${id}.txt`, text);
}

// Pembantu muat turun fail .txt
function saveFileBlob(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    let csv = 'Student Name,Student ID,Hours Attended,Absent Hours,Percentage,Exam Status\n';
    
    document.querySelectorAll('#calcBody tr').forEach(tr => {
        if (tr.style.display === 'none' || tr.cells.length < 6) return;
        const cells = tr.querySelectorAll('td');
        const name = cells[0].textContent.trim();
        const id = cells[1].textContent.trim();
        const attended = cells[2].textContent.trim();
        const absent = cells[3].textContent.trim();
        const percent = cells[4].textContent.trim();
        const status = tr.querySelector('.status-badge').textContent.trim();
        
        csv += `"${name}","${id}","${attended}","${absent}","${percent}","${status}"\n`;
    });
    
    const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const a = document.createElement('a');
    a.href = uri;
    a.download = `Attendance_Analysis_${code}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}