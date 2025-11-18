
    // Countdown
    let detik = 24 * 60 * 60;
    setInterval(() => {
      detik--;
      const h = String(Math.floor(detik / 3600)).padStart(2, '0');
      const m = String(Math.floor((detik % 3600) / 60)).padStart(2, '0');
      const s = String(detik % 60).padStart(2, '0');
      document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
    }, 1000);

    // Pilih metode
    function pilihMetode(metode) {
      document.querySelectorAll('#detail-bca, #detail-qris').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('#check-bca, #check-qris').forEach(el => el.classList.add('hidden'));
      if (metode === 'bca') {
        document.getElementById('detail-bca').classList.remove('hidden');
        document.getElementById('check-bca').classList.remove('hidden');
      } else {
        document.getElementById('detail-qris').classList.remove('hidden');
        document.getElementById('check-qris').classList.remove('hidden');
      }
    }

    function copy(text) {
      navigator.clipboard.writeText(text);
      alert('Disalin: ' + text);
    }

    // Modal — TIDAK MENGUNCI SCROLL
    function openModal() {
      document.getElementById('modal').classList.remove('hidden');
    }
    function closeModal() {
      document.getElementById('modal').classList.add('hidden');
      document.getElementById('preview').classList.add('hidden');
      document.getElementById('file-input').value = '';
      document.getElementById('btn-kirim').disabled = true;
      document.getElementById('btn-kirim').classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Klik di luar modal = tutup
    document.getElementById('modal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    // Upload & Preview
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const preview = document.getElementById('preview');
    const previewImg = document.getElementById('preview-img');
    const btnKirim = document.getElementById('btn-kirim');

    dropArea.addEventListener('click', () => fileInput.click());
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
      dropArea.addEventListener(e, ev => ev.preventDefault());
    });
    dropArea.addEventListener('drop', e => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleFile({target: {files: [file]}});
    });
    fileInput.addEventListener('change', handleFile);

    function handleFile(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
          preview.classList.remove('hidden');
          btnKirim.disabled = false;
          btnKirim.classList.remove('opacity-50', 'cursor-not-allowed');
        };
        reader.readAsDataURL(file);
      }
    }

    function kirimBukti() {
      closeModal();
      document.getElementById('notif').classList.remove('hidden');

      setTimeout(() => {
        document.getElementById('notif').classList.add('hidden');

        // Redirect ke halaman home
        window.location.href = "index.html"; 
      }, 4000);
    }
