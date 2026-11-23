# zoals scripts/reels/prep.py, maar met losse bronbestanden: python3 -I prep2.py bron1 bron2 ...
from PIL import Image, ImageFilter, ImageOps, ImageChops
import sys
for i,src in enumerate(sys.argv[1:]):
    im=Image.open(src).convert('RGB')
    bg=Image.new('RGB',im.size,(255,255,255)); diff=ImageChops.difference(im,bg).convert('L').point(lambda v:255 if v>18 else 0)
    bb=diff.getbbox() or (0,0)+im.size; im=im.crop(bb)
    W,H=(920,680) if i==0 else (920,760)
    W2,H2=W*2,H*2
    back=ImageOps.fit(im,(W2,H2)).filter(ImageFilter.GaussianBlur(40))
    back=Image.blend(back,Image.new('RGB',back.size,(255,255,255)),0.25)
    r=min(W2/im.width,H2/im.height); fg=im.resize((round(im.width*r),round(im.height*r)),Image.LANCZOS)
    back.paste(fg,((W2-fg.width)//2,(H2-fg.height)//2))
    back.save(f'c{i}.jpg',quality=92); print(i,src,im.size,'->',fg.size)
