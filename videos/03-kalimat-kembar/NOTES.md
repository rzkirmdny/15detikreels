# 03 · Kalimat Kembar (buzzer / illusory truth effect)

Video loop ke-3 (2 Nov 2026), @rzkirmdny, Indonesia, 14,59 detik. File final: kalimat-kembar_loop.mp4 (6,9 MB).

## Konsep
- Efek: illusory truth effect. Studi: Fazio, Brashier, Payne & Marsh (2015), JEP: General 144(5), 993-1002: pengulangan tetap menaikkan kesan benar walau peserta tahu faktanya.
- Framing NETRAL: menyebut "buzzer" tapi tidak menyebut pihak/pemerintah/tokoh. Ciri buzzer = perilaku akun, bukan siapa yang dibela. Isi gelembung generik: "Udah, percaya aja. Ini yang terbaik."
- Checklist 3 tanda (bagian yang bikin orang save): kalimat kembar; akun tanpa kehidupan (tanpa foto pribadi, cuma repost); muncul pas isu panas (lama sepi lalu serentak). Footer: "Satu tanda belum tentu buzzer. Lihat kombinasinya."

## Naskah VO (Jefri, eleven_v4, 1 take)
`[urgently] Jadi kalau seratus akun nulis kalimat yang sama persis? Itu bukan suara rakyat, itu buzzer. [curious] Otak menganggap yang sering diulang itu benar: illusory truth effect. [firmly] Cek tiga tanda: kalimat kembar, akun tanpa kehidupan, muncul cuma pas isu panas.`

## TEKNIK BARU: jembatan loop direkam di AWAL (ide Iki)
- Jangan rekam "Jadi kalau..." di ujung (intonasinya menggantung dan patah). Rekam di awal kalimat pertama dalam satu napas, lalu potong tepat sebelum kata kedua kalimat hook (di sini sebelum bunyi "s" pada "seratus", lembah energi ±0,49 s, geser ke zero crossing) dan pindahkan potongan itu ke ujung.
- Susunan: rekaman[potong : akhir "panas."] + jeda 0,3 s + rekaman[0 : potong]. Titik loop = sambungan asli rekaman, jadi mulus.
- Atur tempo dulu (atempo 1.03) baru potong. Geser waktu kata: kata setelah potongan dikurangi titik potong; "Jadi", "kalau" ditambah (panjang bagian1 + jeda).
- Kirim preview loop 2x ke Iki untuk cek sambungan, dan jelaskan bahwa file x2 cuma preview (Iki sempat mengira VO jadi 29 detik).

## Timing kata (detik, setelah susun ulang)
Seratus 0.06 · akun 0.49 · nulis 0.72 · kalimat 0.99 · yang 1.30 · sama 1.46 · persis? 1.73 · Itu 2.47 · bukan 2.62 · suara 2.85 · rakyat, 3.13 · itu 3.94 · buzzer. 4.25 · Otak 5.15 · menganggap 5.31 · yang 5.81 · sering 5.92 · diulang 6.12 · itu 6.47 · benar: 6.70 · illusory 7.44 · truth 7.83 · effect. 8.14 · Cek 8.82 · tiga 8.99 · tanda: 9.22 · kalimat 9.81 · kembar, 10.13 · akun 10.78 · tanpa 11.16 · kehidupan, 11.40 · muncul 12.21 · cuma 12.64 · pas 12.95 · isu 13.22 · panas. 13.42 · Jadi 14.18 · kalau 14.46

## Storyboard final
| Waktu | Adegan |
|---|---|
| 0-2,45 | Feed HP: gelembung identik dari @warga_xxxx scroll terus (scroll = 300 px/s × t, dan × (t-DUR) di akhir supaya frame akhir = frame 0). Hook "100 akun. / 1 kalimat." Semua gelembung merah saat "persis?" |
| 2,45-5,05 | Dinding 28 bust, tali merah ke satu tangan dalang dengan palang; gerak kepala dari acak jadi serempak; cap BUZZER |
| 5,05-7,35 | Kepala profil, gelembung masuk 3x (1x 2x 3x), meter "TERASA BENAR" 18→42→66→90%; panel studi Fazio dkk. |
| 7,35-8,8 | Kartu istilah ILLUSORY TRUTH EFFECT + "efek kebenaran semu", caption disembunyikan |
| 8,8-13,95 | Kartu checklist 3 TANDA BUZZER, item muncul tepat saat diucapkan, centang merah, footer peringatan |
| 13,95-14,59 | Rewind shader, kartu menyusut, kembali ke feed, hook fade-in di 0,2 s terakhir |

## Catatan teknis sesi ini
- playwright npm terbaru (1.64) tidak cocok dengan browser terpasang. Pakai `executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'` di chromium.launch.
- Render ±1,2 s/frame per worker (438 frame, 2 worker ≈ 4,5 menit). Jalankan render dengan run_in_background supaya Iki tidak menunggu tanpa kabar.
- Mix: I = -15 LUFS terukur setelah loudnorm -14 (cukup).

## Render ulang
```bash
cd videos/03-kalimat-kembar
npm i three@0.169.0 playwright
cp ../../engine/render.cjs .
node render.cjs stills 0,2,4.5,6,8,10,12,14.55   # cek frame
node render.cjs frames 0 219 partA.mp4 & node render.cjs frames 219 438 partB.mp4 & wait
python3 sfx.py && bash mix.sh                     # -> kalimat-kembar_loop.mp4
```
