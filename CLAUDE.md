# CLAUDE.md

Repo video psikologi loop 15 detik untuk @rzkirmdny. Baca `docs/CONTEXT.md` dulu untuk peta lengkap, lalu `videos/03-kalimat-kembar/NOTES.md` untuk teknik terbaru.

## Cara bekerja
- Panggil pemilik "Iki". Bahasa Indonesia santai, pakai "aku".
- JANGAN pakai em-dash di jawaban, naskah, atau caption.
- Pakai penanda keyakinan di jawaban: 🟢 yakin, 🟡 perlu dicek, 🔴 hati-hati/keterbatasan, 🔵 informasi.
- Kalau ada langkah yang lambat buatmu tapi cepat buat Iki (cari/unduh aset, dan sejenisnya), serahkan ke Iki, kecuali Iki bilang mau otomatis penuh atau sedang pergi.
- Di notebook render Colab untuk video Three.js, jangan sertakan sel cek masalah frame (buang waktu runtime).
- Render panjang: jalankan di background dan kabari Iki, jangan diam.

## Membuat video baru
Ikuti "Langkah membuat video loop baru" di `docs/CONTEXT.md`:
1. Folder baru `videos/NN-judul/`, salin `engine/render.cjs`, `npm i three@0.169.0 playwright`.
2. Kerangka dari `videos/03-kalimat-kembar/` (utils, caption per kata, post shader, loop). Adegan selalu baru.
3. VO ElevenLabs Jefri (`1ijzBXcD3AIVH8RGMcQd`, eleven_v4), SATU take. Jembatan loop direkam di awal lalu dipindah ke ujung.
4. Frame terakhir = frame 0. Teks jangan di 15% atas layar.
5. Commit folder video tanpa MP4 ke `main`, tambah baris di tabel README.

## Lingkungan
- Playwright npm terbaru bisa tidak cocok dengan browser terpasang: set `PW_CHROME` ke chrome-headless-shell di `/opt/pw-browsers/`.
- Jaringan sandbox lewat allowlist. Unduhan dari situs lain bisa ditolak: minta Iki melampirkan file.
- Jangan commit MP4, node_modules, atau kunci API. Kunci ElevenLabs tidak boleh masuk repo.
- Pesan commit singkat, bahasa Indonesia atau Inggris, jelaskan apa yang berubah.
