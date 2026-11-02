# CONTEXT: peta proyek @rzkirmdny (untuk sesi/akun Claude baru)

Dokumen ini dibuat supaya pekerjaan bisa dilanjutkan dari akun Claude lain tanpa Project lama. Repo ini adalah sumber kebenaran untuk video loop 15 detik. Format cerita panjang (video cerita + psikologi) kodenya masih di laptop, tapi aturannya diringkas di bagian 6.

## 1. Gambaran singkat
- Akun: @rzkirmdny (Instagram Reels, TikTok, YouTube Shorts). Konten: psikologi populer, gaya noir siluet potongan kertas.
- Pemilik: Iki (nama formal Rizki), mahasiswa psikologi. Sapa "Iki".
- Dua format:
  1. **Loop 15 detik** (repo ini): 10-15 detik, mulus berulang, satu efek psikologi per video.
  2. **Cerita + psikologi** (±100 detik): cerita kejadian disamarkan, lalu eksperimen dan nama fenomena. Lihat bagian 6.
- Bahasa: Indonesia (VO Jefri) dan English (kalau dipakai, lihat bagian 7).

## 2. Isi repo
- `engine/render.cjs`: renderer Playwright. `stills` untuk cek frame, `frames a b out.mp4` untuk render. Jalankan 2 worker paralel.
- `videos/NN-judul/`: satu folder per video: `index.html` (adegan), `words.json` (timing kata), `vo_loop.wav`, `sfx.py`, `mix.sh`, `NOTES.md` (naskah, storyboard, keputusan).
- `brand/`: foto profil (pfp_A/B/C), banner YouTube, `pfp.html` + `make.cjs` untuk render ulang.
- `videos/03-kalimat-kembar/` adalah versi terbaru dan jadi kerangka untuk video baru.

MP4, node_modules, dan stills tidak di-commit (lihat `.gitignore`).

## 3. Langkah membuat video loop baru
1. Buat `videos/NN-judul/`, salin `engine/render.cjs` ke dalamnya, lalu `npm i three@0.169.0 playwright`.
2. Salin `index.html`, `sfx.py`, `mix.sh` dari `videos/03-kalimat-kembar/` sebagai kerangka (utils, caption per kata, post shader, loop). Semua adegan diganti baru, jangan daur ulang adegan lama.
3. Tulis naskah (±33-38 kata). VO 14-14,5 detik, satu take ElevenLabs (Jefri untuk Indonesia, `1ijzBXcD3AIVH8RGMcQd`, model eleven_v4, generations_count = 1).
4. Rekam kata jembatan loop (mis. "Jadi kalau") di AWAL kalimat hook, potong sebelum kata hook berikutnya, pindahkan ke ujung audio plus jeda 0,3 s. Detail di `videos/03-kalimat-kembar/NOTES.md`.
5. Timing kata lewat transkripsi (ElevenLabs scribe) jadi `words.json`.
6. Render: `node render.cjs stills ...` untuk cek frame, lalu `frames` dengan 2 worker, gabung, mix audio.
7. Commit folder video (tanpa MP4) ke `main`, tambah baris di tabel README.

Kalau Playwright protes browser tidak ada: set env `PW_CHROME=/opt/pw-browsers/chromium_headless_shell-<versi>/chrome-headless-shell-linux64/chrome-headless-shell`.

## 4. Aturan format loop
- Frame terakhir = frame 0 (loop mulus). Hook muncul lagi di ±0,2 detik terakhir.
- Caption per kata (kata aktif merah), y ±1480, maksimal 2 baris. Teks JANGAN di 15% atas layar (ketutup kamera/logo).
- Hook: konflik di kalimat pertama. Psikologi di akhir. Ada satu bagian yang bikin orang save (checklist atau cara mematahkan).
- Framing netral untuk topik sensitif (mis. "buzzer" tanpa menyebut pihak).
- Bahasa: "aku", tanpa em-dash.
- Render ±1,2 detik/frame per worker. Jalankan di background dan kabari Iki, jangan diam.

## 5. Visual dan audio
- Palet: BG `#1b1815`, ink `#0d0c0b`, cream `#efe6d2`, merah `#d8352a` (satu-satunya aksen).
- Gaya: figur siluet hitam dengan outline krem (potongan kertas). Semua digambar di Canvas2D, lalu jadi CanvasTexture untuk post shader Three.js r169 (grain, vignette, sepia/flicker).
- SFX dibuat lewat kode (`sfx.py`): detak jantung, dentum, kertas, cap, retak, klik, buzz, jam, pop, chime hangat, dan lainnya.
- Mix: VO diproses (highpass 85 Hz, +3,5 dB di 3,2 kHz, kompresor, loudnorm) ×1,6; SFX ×0,42 dengan ducking (sidechaincompress dari VO); loudnorm akhir -14 LUFS.
- Ganti audio saja = `ffmpeg -c:v copy` (cepat, tanpa render ulang).
- Versi kirim: crf 26, maxrate 4,5M. crf 24 dengan maxrate 14M membengkak karena grain.

## 6. Format cerita + psikologi (ringkas, kode di laptop)
- Cerita kejadian nyata/populer Indonesia, DISAMARKAN (tanpa nama, tanggal, tempat, institusi, angka vonis) atau komposit dari pola kasus.
- Struktur: hook (konflik di kalimat pertama) → cerita padat (±40 kata) → pertanyaan jembatan → transisi "Psikologi punya jawabannya." → eksperimen (jelaskan tiap kondisi dulu baru angka) → nama fenomena + definisi singkat → "cara mematahkan" → punchline → outro "Aku Iki, mahasiswa psikologi yang suka bahas otak manusia. Simpan video ini..." (intro DI AKHIR).
- Target ±180 kata (230 kata dengan tag v4 jadi ±106 detik).
- Sudah ada: Disuruh Atasan (Milgram), Dua Puluh Ribu (foot-in-the-door), Sedikit Lagi (near-miss effect).
- Kirim file ke laptop: potongan maks 20 MB, potongan pertama MP4 rusak saat commit jadi gzip dulu, cocokkan md5.

## 7. Eksperimen bahasa (data 2 Nov 2026)
- Reel Indonesia (bystander): 89 like, 10 save, 98,3% audiens Indonesia.
- Reel English (spotlight): 19 like, 3 save, 97,9% non-followers. Negara: India 27,2%, US 21,7%, Filipina 14,6%, Kanada 5,5%, Indonesia 5,3%.
- Belum adil dibandingkan: topik beda, views belum dicatat, dan akun selama ini isinya Indonesia (cold start untuk English).
- Rencana tes: 5-7 video English dalam 1-2 minggu (sekitar 1/hari, jangan borongan sehari). Catat per video: views, like rate, save rate, persen US+Kanada.
- Keputusan: kalau US+Kanada konsisten di atas 20% dan like rate sama atau lebih baik, baru pertimbangkan akun English terpisah. Sampai itu, tetap satu akun.
- Catatan RPM: yang bernilai tinggi hanya US dan Kanada. India, Filipina, Indonesia sama-sama rendah. Instagram tidak membayar per view, jadi RPM relevan kalau diunggah juga ke YouTube Shorts.

## 8. Daftar video
| No | Judul | Efek | Bahasa |
|---|---|---|---|
| 01 | Bystander | bystander effect | ID |
| 02 | Spotlight | spotlight effect | EN |
| 03 | Kalimat Kembar | illusory truth effect (buzzer) | ID |
