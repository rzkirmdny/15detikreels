set -e
cd "$(dirname "$0")"
DUR=14.59125
NS=$(python3 -c "print(round(48000*$DUR))")
ffmpeg -v error -y -i vo_loop.wav -i sfx.wav -filter_complex "\
[0:a]aresample=48000,highpass=f=85,equalizer=f=3200:t=q:w=1:g=3.5,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=1.6,asplit=2[vo][sc];\
[1:a]aresample=48000,volume=0.42[sf];\
[sf][sc]sidechaincompress=threshold=0.05:ratio=6:attack=10:release=200[duck];\
[vo][duck]amix=inputs=2:duration=shortest:normalize=0,loudnorm=I=-14:TP=-1.5,apad=whole_len=$NS[a]" \
  -map "[a]" -t $DUR -ar 48000 mix.wav
printf "file 'partA.mp4'\nfile 'partB.mp4'\n" > parts.txt
ffmpeg -v error -y -f concat -safe 0 -i parts.txt -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 26 -maxrate 4.5M -bufsize 9M -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -t $DUR kalimat-kembar_loop.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 kalimat-kembar_loop.mp4
