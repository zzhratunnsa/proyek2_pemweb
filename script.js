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

// 4. FORM KIRIM LAGU
const form = document.querySelector('#song-form');
const daftarField = ['to', 'title', 'artist', 'message'];

// Menampilkan atau menghapus pesan error di bawah input
const tampilError = (nama, pesan) => {
  const input = document.getElementById(nama);
  document.querySelector('.err[data-for="' + nama + '"]').textContent = pesan;
  if (pesan !== '') {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
};

// Mengecek input
const cekField = (nama) => {
  const nilai = document.getElementById(nama).value.trim();
  let pesan = '';

  if (nama === 'to' && nilai === '') {
    pesan = 'Isi nama penerima.';
  }
  if (nama === 'title' && nilai === '') {
    pesan = 'Isi judul lagu.';
  }
  if (nama === 'artist' && nilai === '') {
    pesan = 'Isi nama artis.';
  }
  if (nama === 'message' && nilai.length < 10) {
    pesan = 'Pesan minimal 10 karakter.';
  }

  tampilError(nama, pesan);
  return pesan === '';
};

// Cek input saat pengguna selesai mengetik
daftarField.forEach((nama) => {
  document.getElementById(nama).addEventListener('blur', () => cekField(nama));
});

// Menghitung jumlah karakter pesan
document.getElementById('message').addEventListener('input', (e) => {
  document.querySelector('#counter').textContent = e.target.value.length + '/200';
});

// Saat form dikirim
form.addEventListener('submit', (e) => {
  e.preventDefault(); // cegah halaman reload

  let valid = true;
  for (const nama of daftarField) {
    if (cekField(nama) === false) {
      valid = false;
    }
  }
  if (valid === false) {
    toast('Lengkapi form dulu.');
    return;
  }

  // Buat object lagu baru lalu masukkan ke array
  const lagu = {
    id: 'u' + Date.now(),
    to: document.getElementById('to').value.trim(),
    title: document.getElementById('title').value.trim(),
    artist: document.getElementById('artist').value.trim(),
    message: document.getElementById('message').value.trim(),
    mood: document.getElementById('mood').value,
    plays: 0,
    createdAt: Date.now(),
  };
  songs.push(lagu);

  // Kembalikan pencarian dan urutan ke awal agar lagu baru langsung terlihat
  kataCari = '';
  urutan = 'new';
  document.querySelector('#search').value = '';
  document.querySelector('#sort').value = 'new';

  resetForm();
  tampilkanHalaman('jelajah');
  toast('Lagu berhasil dikirim.');
});

// Mengosongkan form
const resetForm = () => {
  form.reset();
  for (const nama of daftarField) {
    tampilError(nama, '');
  }
  document.querySelector('#counter').textContent = '0/200';
};

// 5. KARTU LAGU
// Membuat HTML sebuah kartu. Kalau withPlayer = true, kartu punya tombol play
const buatKartu = (lagu, withPlayer) => {
  let player = '';
  let jumlahPutar = '';

  if (withPlayer) {
    player = `
      <div class="player">
        <button class="play" data-play="${lagu.id}" aria-label="Putar lagu">&#9654;</button>
        <div class="track"><span class="fill"></span></div>
        <span class="time">0:00 / 0:30</span>
      </div>`;
    jumlahPutar = `<span class="plays">${lagu.plays}x diputar</span>`;
  }

  return `
    <article class="card" data-id="${lagu.id}">
      <span class="mood">${aman(lagu.mood)}</span>
      <h2>${aman(lagu.title)}</h2>
      <p class="artist">${aman(lagu.artist)}</p>
      <blockquote>${aman(lagu.message)}</blockquote>
      ${player}
      <footer>
        <span>Untuk ${aman(lagu.to)}</span>
        ${jumlahPutar}
      </footer>
    </article>`;
};

// 6. HALAMAN JELAJAHI
// Mengambil lagu yang namanya cocok dengan kolom pencarian
const ambilLagu = () => {
  const hasil = [];
  for (const lagu of songs) {
    if (lagu.to.toLowerCase().includes(kataCari.toLowerCase())) {
      hasil.push(lagu);
    }
  }

  hasil.sort((a, b) => {
    if (urutan === 'plays') {
      return b.plays - a.plays;  // paling sering diputar di atas
    }
    return b.createdAt - a.createdAt; // terbaru di atas
  });
  return hasil.slice(0, MAKS_KARTU); // ambil 4 pertama saja
};

// Menampilkan semua kartu ke halaman
const renderBrowse = () => {
  stopPlayback();
  const hasil = ambilLagu();
  let html = '';

  if (hasil.length === 0) {
    html = '<div class="empty">Tidak ada lagu untuk nama itu. Coba nama lain atau kirim lagu baru.</div>';
  } else {
    for (const lagu of hasil) {
      html += buatKartu(lagu, true);
    }
  }
  document.querySelector('#grid').innerHTML = html;

  // Pasang event klik pada setiap tombol play
  document.querySelectorAll('#grid .play').forEach((tombol) => {
    tombol.addEventListener('click', () => {
      const id = tombol.dataset.play;
      if (laguAktif === id) {
        stopPlayback();
      } else {
        startPlayback(id);
      }
    });
  });
};

document.querySelector('#search').addEventListener('input', (e) => {
  kataCari = e.target.value.trim();
  renderBrowse();
});

document.querySelector('#sort').addEventListener('change', (e) => {
  urutan = e.target.value;
  renderBrowse();
});

// 7. PEMUTAR (SIMULASI 30 DETIK, TANPA SUARA)
const DURASI = 30;
let laguAktif = null; // id lagu yang sedang diputar (null = tidak ada)
let timer = null;
let tick = 0;         // 1 tick = 0,1 detik

const cariKartu = (id) => document.querySelector('#grid [data-id="' + id + '"]');

// Mengubah angka detik menjadi tulisan, misalnya 7 menjadi "0:07"
const formatWaktu = (detik) => {
  const d = Math.floor(detik);
  if (d < 10) {
    return '0:0' + d;
  }
  return '0:' + d;
};

// Mengubah tampilan kartu
const gambarPlayer = (id, detik, sedangPutar) => {
  const kartu = cariKartu(id);
  if (!kartu) {
    return;
  }
  const tombol = kartu.querySelector('.play');

  if (sedangPutar) {
    kartu.classList.add('playing');
    tombol.innerHTML = '&#10074;&#10074;'; // ikon jeda
  } else {
    kartu.classList.remove('playing');
    tombol.innerHTML = '&#9654;';          // ikon play
  }
  kartu.querySelector('.fill').style.width = (detik / DURASI) * 100 + '%';
  kartu.querySelector('.time').textContent = formatWaktu(detik) + ' / ' + formatWaktu(DURASI);
};

const stopPlayback = () => {
  if (laguAktif === null) {
    return;
  }
  clearInterval(timer);
  gambarPlayer(laguAktif, 0, false);
  laguAktif = null;
};

const startPlayback = (id) => {
  stopPlayback(); // hentikan lagu lain dulu

  const lagu = songs.find((l) => l.id === id);
  lagu.plays = lagu.plays + 1;
  cariKartu(id).querySelector('.plays').textContent = lagu.plays + 'x diputar';

  laguAktif = id;
  tick = 0;
  gambarPlayer(id, 0, true);

  timer = setInterval(() => {
    tick = tick + 1;
    const detik = tick / 10;
    if (detik >= DURASI) {
      stopPlayback();
      return;
    }
    gambarPlayer(id, detik, true);
  }, 100);
};