"""Download the Mixkit foley this film uses (Mixkit Sound Effects Free License: free for commercial use,
no attribution required, but the raw files may not be redistributed — so they are git-ignored).

python3 scripts/fetch_sfx.py  → sfx/mixkit/<id>.wav (48 kHz stereo float)
Every take was screened as non-tonal (narrow spectral peak prominence ≤ 12 dB; tones score > 14).
"""
import os
import subprocess

import sys

import imageio_ffmpeg

sys.path.insert(0, os.path.dirname(__file__))
from sfx_library import ALL_IDS  # noqa: E402

FF = imageio_ffmpeg.get_ffmpeg_exe()
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.makedirs("sfx/mixkit", exist_ok=True)
for i in ALL_IDS:
    wav = f"sfx/mixkit/{i}.wav"
    if os.path.exists(wav):
        continue
    mp3 = f"sfx/mixkit/{i}.mp3"
    subprocess.run(["curl", "-sfL", "-m", "60", "-o", mp3, f"https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3"], check=True)
    subprocess.run([FF, "-v", "error", "-y", "-i", mp3, "-ar", "48000", "-ac", "2", "-c:a", "pcm_f32le", wav], check=True)
    os.remove(mp3)
    print("fetched", i)
print(len(ALL_IDS), "takes in sfx/mixkit/")
