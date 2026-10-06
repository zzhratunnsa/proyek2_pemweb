// ===== 1. DATA: Array of Objects =====
// Setiap lagu adalah satu object. Semua lagu disimpan di array "songs".
let songs = [
  { id: 'a1', to: 'Rani', title: 'Heal the World', artist: 'Michael Jackson', message: 'Semoga harimu lebih ringan hari ini.', mood: 'Semangat', plays: 4, createdAt: 1 },
  { id: 'a2', to: 'Ibu', title: 'Bunda', artist: 'Melly Goeslaw', message: 'Terima kasih sudah selalu ada.', mood: 'Terima kasih', plays: 9, createdAt: 2 },
  { id: 'a3', to: 'Sinta', title: 'Akad', artist: 'Payung Teduh', message: 'Aku serius sama kamu.', mood: 'Cinta', plays: 6, createdAt: 3 },
  { id: 'a4', to: 'Bima', title: 'Sampai Jadi Debu', artist: 'Banda Neira', message: 'Kapan kita ngopi lagi?', mood: 'Rindu', plays: 2, createdAt: 4 },
  { id: 'a5', to: 'Tara', title: 'Maafkan Aku', artist: 'Nidji', message: 'Maaf ya kemarin aku telat bales.', mood: 'Maaf', plays: 1, createdAt: 5 },
];

let kataCari = '';   // untuk isi kolom pencarian
let urutan = 'new';  // pilihan urutan: 'new' atau 'plays'
const MAKS_KARTU = 4; // jumlah kartu maksimal di halaman Jelajahi

// ===== 2. FUNGSI BANTU =====
// Menampilkan pesan kecil di bawah layar selama 2 detik
const toast = (pesan) => {
  const t = document.querySelector('#toast');
  t.textContent = pesan;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
};

// Mengubah teks agar aman dimasukkan ke innerHTML
const aman = (teks) => {
  const div = document.createElement('div');
  div.textContent = teks;
  return div.innerHTML;
};

// ===== 3. NAVIGASI 3 HALAMAN =====
// Menampilkan satu halaman dan menyembunyikan yang lain
const tampilkanHalaman = (nama) => {
  stopPlayback();

  document.querySelectorAll('.view').forEach((halaman) => {
    if (halaman.id === 'view-' + nama) {
      halaman.classList.add('active');
    } else {
      halaman.classList.remove('active');
    }
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    if (tab.dataset.nav === nama) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  if (nama === 'jelajah') {
    renderBrowse();
  }
  window.scrollTo(0, 0);
};

// Semua tombol yang punya atribut data-nav bisa pindah halaman
document.querySelectorAll('[data-nav]').forEach((tombol) => {
  tombol.addEventListener('click', (e) => {
    e.preventDefault();
    if (tombol.dataset.nav === 'kirim') {
      resetForm();
    }
    tampilkanHalaman(tombol.dataset.nav);
  });
});