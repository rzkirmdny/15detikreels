# 15detikreels

Video psikologi vertikal 10-15 detik yang loop mulus untuk @rzkirmdny (gaya noir siluet potongan kertas, Canvas2D + post shader Three.js).

## Struktur
- `engine/render.cjs` · renderer Playwright: `stills` untuk cek frame, `frames a b out.mp4` untuk render (jalankan 2 worker paralel). Set `PW_CHROME` ke path chrome-headless-shell kalau versi Playwright tidak cocok dengan browser terpasang.
- `videos/NN-judul/` · satu folder per video: `index.html` (adegan), `words.json` (timing kata VO), `vo_loop.wav`, `sfx.py`, `mix.sh`, `NOTES.md` (naskah, storyboard, keputusan).
- `brand/` · foto profil (pfp_A/B/C.png, 1080x1080) dan banner YouTube (2560x1440), plus `pfp.html` + `make.cjs` untuk render ulang.

## Palet
BG `#1b1815` · ink `#0d0c0b` · cream `#efe6d2` · aksen merah `#d8352a`

## Aturan format (ringkas)
- ±33-38 kata, VO 14-14,5 detik, satu take ElevenLabs (Jefri untuk ID).
- Jembatan loop (mis. "Jadi kalau") direkam di AWAL kalimat hook, lalu dipotong dan dipindah ke ujung audio. Lihat `videos/03-kalimat-kembar/NOTES.md`.
- Frame terakhir = frame 0; caption per kata y ±1480; teks tidak di 15% atas layar.

## Daftar video
| No | Judul | Efek | Durasi |
|---|---|---|---|
| 03 | Kalimat Kembar | illusory truth effect (buzzer) | 14,59 s |

Video 01 (bystander effect) dan 02 (spotlight effect) belum dipindah ke sini; kodenya masih di dokumen Project `claude/loop-video-engine.md`.
