let selectedId = null;
const modal = document.getElementById('archiveModal');
const successMsg = document.getElementById('successMsg');

function showArchiveModal(id, name) {
    // Jangan buka modal jika akaun dah memang archived
    const element = document.getElementById('item-' + id);
    if(element.classList.contains('archived')) return;

    selectedId = id;
    document.getElementById('targetAccount').innerText = "ID: " + id + " | Name: " + name;
    modal.style.display = 'flex';
    successMsg.style.display = 'none';
}

function closeModal() {
    modal.style.display = 'none';
}

function executeArchive() {
    modal.style.display = 'none';
    successMsg.style.display = 'block';
    
    // Cari element mengikut ID dan tambah class 'archived'
    const item = document.getElementById('item-' + selectedId);
    if(item) {
        item.classList.add('archived');
        // Tukar icon kepada icon yang menunjukkan ia sudah disimpan
        const icon = item.querySelector('i');
        if (icon) {
            icon.classList.replace('fa-box-archive', 'fa-check-double');
            icon.style.color = 'var(--archive-grey)';
        }
    }

    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

// Menutup modal jika klik di luar kawasan modal-content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}