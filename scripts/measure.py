"""Measure label widths with HarfBuzz so morphing pills fit their text exactly.
Writes src/lib/widths.json: { "<font>|<weight>|<size>|<text>": width_px }."""
import json, sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import io

FONTS = {"Geist": "public/fonts/geist.woff2", "Amiri400": "public/fonts/amiri-400.woff2",
         "Amiri700": "public/fonts/amiri-700.woff2", "GeistMono": "public/fonts/geist-mono.woff2"}

def blob_for(name, weight):
    f = TTFont(FONTS[name])
    if "fvar" in f:
        f = instantiateVariableFont(f, {"wght": weight})
    f.flavor = None
    buf = io.BytesIO(); f.save(buf)
    return buf.getvalue()

cache = {}
def width(font, weight, size, text):
    key = (font, weight)
    if key not in cache:
        face = hb.Face(blob_for(font, weight)); cache[key] = (hb.Font(face), face.upem)
    fnt, upem = cache[key]
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(fnt, buf, {"kern": True, "liga": True})
    return sum(p.x_advance for p in buf.glyph_positions) * size / upem

spec = json.load(open("scripts/labels.json"))
out = {}
for font, weight, size, text in spec:
    fam = font if font in ("Geist", "GeistMono") else f"Amiri{weight}"
    out[f"{font}|{weight}|{size}|{text}"] = round(width(fam, weight, size, text), 1)
json.dump(out, open("src/lib/widths.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "labels measured")
