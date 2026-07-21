from PIL import Image
import math
import sys

def process_asset(path):
    try:
        img = Image.open(path).convert("RGBA")
        width, height = img.size
        
        # We will make white/light pixels transparent
        newData = []
        for y in range(height):
            for x in range(width):
                r, g, b, a = img.getpixel((x, y))
                dist = math.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
                if dist < 30: # very white
                    newData.append((r, g, b, 0))
                elif dist < 80: # smooth alpha
                    alpha = int((dist - 30) / 50 * 255)
                    newData.append((r, g, b, alpha))
                else:
                    newData.append((r, g, b, a))
        
        img.putdata(newData)
        
        # Crop to bounding box
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(path, "PNG")
        print(f"Processed {path}")
    except Exception as e:
        print(f"Error processing {path}: {e}")

process_asset("public/mole_mine.png")
process_asset("public/farm_sign.png")
process_asset("public/carrot_bg.png")
