import sys
from PIL import Image, ImageDraw
files=sys.argv[2:]; out=sys.argv[1]
ims=[Image.open(f) for f in files]
w,h=ims[0].size; cols=3; rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(cols*w+(cols+1)*8, rows*(h+30)+8),'#888')
d=ImageDraw.Draw(S)
for i,(f,im) in enumerate(zip(files,ims)):
    x=8+(i%cols)*(w+8); y=8+(i//cols)*(h+30)
    S.paste(im,(x,y+22)); d.text((x,y+4),f.split('/')[-1],fill='white')
S.save(out)
