# Kijk een reel na: tekent de zones waar TikTok knoppen en tekst over de foto legt (rood).
# Gebruik: python3 zones.py <map met foto's> <uit.jpg>
import sys, os, glob
from PIL import Image, ImageDraw
fotos = sorted(glob.glob(os.path.join(sys.argv[1], '*-foto-*.jpg')), key=lambda f: int(f.rsplit('-', 1)[1].split('.')[0]))
W, H, c = 300, 533, 6; rows = (len(fotos) + c - 1) // c
doek = Image.new('RGB', (c * W, rows * H), 'white'); d = ImageDraw.Draw(doek); f = W / 1080
for i, p in enumerate(fotos):
    x, y = (i % c) * W, (i // c) * H; doek.paste(Image.open(p).resize((W, H)), (x, y))
    d.rectangle([x, y, x + W, y + int(280 * f)], outline='red'); d.line([x, y + int(1560 * f), x + W, y + int(1560 * f)], fill='red')
    d.rectangle([x + int(920 * f), y + int(820 * f), x + W, y + int(1680 * f)], outline='red')
doek.save(sys.argv[2], quality=80); print(len(fotos), 'foto\'s')
