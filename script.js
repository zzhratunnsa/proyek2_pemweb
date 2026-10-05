const form = document.querySelector('#song-form');
const daftarField = ['to', 'title', 'artist', 'message'];

const tampilError = (nama, pesan) => {
  const input = document.getElementById(nama);

  document.querySelector(
    '.err[data-for="' + nama + '"]'
  ).textContent = pesan;

  if (pesan !== '') {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
};

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

daftarField.forEach((nama) => {
  document.getElementById(nama).addEventListener('blur', () => cekField(nama));
});

document.getElementById('message').addEventListener('input', (e) => {
  document.querySelector('#counter').textContent =
    e.target.value.length + '/200';
});


form.addEventListener('submit', (e) => {
  e.preventDefault();

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