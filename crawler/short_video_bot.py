"""
Short-form Video Bot v2.0 - NEXT GEN EDITION
- Strategy: Modern Apple-style / FinTech Visuals
- Effects: Ken Burns (Zoom), Glassmorphism, Neon Strokes
- UI: Minimalist, Bold Typography, High-end Branding
"""

import json
import os
import time
from datetime import datetime
from gtts import gTTS
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, vfx, CompositeVideoClip
import PIL.Image as Image
import PIL.ImageDraw as ImageDraw
import PIL.ImageFont as ImageFont
import PIL.ImageFilter as ImageFilter

# Compatibility fix for Pillow 10
if not hasattr(Image, 'ANTIALIAS'):
    Image.ANTIALIAS = Image.LANCZOS

class ShortVideoBot:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.signal_path = os.path.join(self.base_dir, 'web', 'public', 'alpha-signals.json')
        self.output_dir = os.path.join(self.base_dir, 'web', 'public', 'videos')
        self.bg_image_path = os.path.join(self.base_dir, 'crawler', 'assets', 'video_bg.png')
        self.font_path = "C:\\Windows\\Fonts\\malgunbd.ttf"
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def create_glass_panel(self, draw, x, y, w, h, radius=30):
        """Draws a modern glassmorphism-style panel"""
        # This is a simplified version using rectangle with outline and slight color
        draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=(255, 255, 255, 15), outline=(255, 255, 255, 40), width=2)

    def draw_modern_text(self, draw, text, pos, font, fill=(255, 255, 255, 255), shadow=True):
        """Draws text with subtle shadow for premium look"""
        if shadow:
            draw.text((pos[0]+2, pos[1]+2), text, font=font, fill=(0, 0, 0, 100))
        draw.text(pos, text, font=font, fill=fill)

    def create_frame(self, scene_item, output_path):
        """Creates a high-end 9:16 frame with glassmorphism"""
        base = Image.open(self.bg_image_path).convert("RGBA").resize((1080, 1920))
        overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        w, h = base.size
        
        # 1. Subtle Dark Gradient Overlay for readability
        gradient = Image.new('L', (1, h), color=0)
        for y in range(h):
            alpha = int(255 * (y / h) * 0.8) # Darker at bottom
            draw.line([(0, y), (w, y)], fill=(0, 0, 0, alpha))

        # Fonts
        f_hero = ImageFont.truetype(self.font_path, 130)
        f_sub = ImageFont.truetype(self.font_path, 60)
        f_tag = ImageFont.truetype(self.font_path, 40)
        f_price = ImageFont.truetype(self.font_path, 180)

        # Content Layout
        if scene_item['type'] == 'HOOK':
            # Glass Tag
            self.create_glass_panel(draw, 100, 400, 380, 70)
            draw.text((140, 415), "URGENT SIGNAL", font=f_tag, fill=(0, 200, 255))
            
            # Massive Ticker
            self.draw_modern_text(draw, scene_item['ticker'], (100, 500), f_hero)
            
            # Indicator line
            draw.rectangle([100, 680, 350, 685], fill=(0, 200, 255))
            
            self.draw_modern_text(draw, "2026 ALPHA DETECTED", (100, 720), f_sub, fill=(200, 200, 200))

        elif scene_item['type'] == 'DATA':
            # Price Focus
            self.create_glass_panel(draw, 100, 400, 300, 70)
            draw.text((140, 415), "LIVE PRICE", font=f_tag, fill=(50, 255, 100))
            
            self.draw_modern_text(draw, f"${scene_item['price']}", (100, 480), f_price, fill=(255, 255, 255))
            
            # Strategy Badge
            self.create_glass_panel(draw, 100, 720, 500, 80)
            draw.text((140, 735), f"STRATEGY: {scene_item['strategy']}", font=f_tag, fill=(255, 255, 0))

        elif scene_item['type'] == 'REASON':
            # AI Insight
            draw.text((100, 400), "AI INSIGHT REPORT", font=f_tag, fill=(180, 180, 180))
            draw.rectangle([100, 460, 200, 465], fill=(255, 255, 255))
            
            # Wrap Reason text
            text = scene_item['reason']
            y_curr = 520
            lines = [text[i:i+12] for i in range(0, len(text), 12)]
            for line in lines[:5]:
                self.draw_modern_text(draw, line, (100, y_curr), f_sub)
                y_curr += 100

        elif scene_item['type'] == 'TARGET':
            # Split View
            # Target
            self.create_glass_panel(draw, 80, 450, 920, 180, radius=40)
            draw.text((130, 480), "TARGET PROFIT", font=f_tag, fill=(0, 255, 100))
            draw.text((130, 530), f"${scene_item['target']}", font=f_hero, fill=(255,255,255))
            
            # Stop
            self.create_glass_panel(draw, 80, 680, 920, 180, radius=40)
            draw.text((130, 710), "STOP LOSS", font=f_tag, fill=(255, 50, 50))
            draw.text((130, 760), f"${scene_item['stop']}", font=f_hero, fill=(255,255,255))

        elif scene_item['type'] == 'CTA':
            # Final Branding
            self.create_glass_panel(draw, 200, 800, 680, 300)
            draw.text((320, 850), "STOCK", font=f_sub, fill=(150, 150, 150))
            draw.text((320, 920), "EMPIRE", font=f_hero, fill=(255, 255, 255))
            
            self.draw_modern_text(draw, "LINK IN BIO", (w/2 - 120, h*0.75), f_tag, fill=(50, 255, 255))

        # Merge with base and export
        final = Image.alpha_composite(base, overlay)
        final.convert("RGB").save(output_path)

    def generate_video(self):
        print("[AI] Initializing Next-Gen Video Render Pipeline...")
        try:
            with open(self.signal_path, 'r', encoding='utf-8') as f:
                signals = json.load(f)
            
            if not signals: return None
            
            stock = signals[0]
            ticker = stock['ticker']
            
            scenes = [
                {'type': 'HOOK', 'ticker': ticker, 'script': f"긴급 알파 시그널 탐지. {ticker}, 지금이 기회입니다."},
                {'type': 'DATA', 'strategy': stock['strategy'], 'price': stock['price'], 'script': f"포착된 전략은 {stock['strategy']}입니다. 현재 가격은 {stock['price']}달러."},
                {'type': 'REASON', 'reason': stock['ai_reason'], 'script': f"AI 분석 결과, {stock['ai_reason']}"},
                {'type': 'TARGET', 'target': stock['target_price'], 'stop': stock['stop_loss'], 'script': f"타겟가는 {stock['target_price']}달러, 손절가는 {stock['stop_loss']}달러입니다."},
                {'type': 'CTA', 'script': "상위 1퍼센트의 정보. 지금 프로필 링크에서 스톡엠파이어를 경험하세요."}
            ]
            
            final_clips = []
            
            for i, scene in enumerate(scenes):
                # 1. Audio
                a_path = f"v2_a_{i}.mp3"
                gTTS(text=scene['script'], lang='ko').save(a_path)
                a_clip = AudioFileClip(a_path)
                
                # 2. Image Frame
                f_path = f"v2_f_{i}.png"
                self.create_frame(scene, f_path)
                
                # 3. Apply Cinematic Motion (Slow Zoom)
                img_clip = ImageClip(f_path).set_duration(a_clip.duration + 0.4)
                
                # Manual Zoom Effect using resize and cropping simulation
                # MoviePy zoom is heavy, so we use a simpler 'resize' animation if possible
                # Or just keep it high-res for TikTok
                img_clip = img_clip.resize(lambda t: 1 + 0.05 * (t / img_clip.duration)) # 5% zoom over duration
                
                img_clip = img_clip.set_audio(a_clip)
                final_clips.append(img_clip)
                
            # Combine with Crossfades
            combined = concatenate_videoclips(final_clips, method="compose")
            
            out_file = f"NexGen_{ticker}_{datetime.now().strftime('%H%M')}.mp4"
            out_path = os.path.join(self.output_dir, out_file)
            
            combined.write_videofile(out_path, fps=30, codec="libx264", bitrate="5000k")
            print(f"[RENDER SUCCESS] {out_path}")
            
            # Cleanup
            for i in range(len(scenes)):
                try: os.remove(f"v2_a_{i}.mp3"); os.remove(f"v2_f_{i}.png")
                except: pass
                
            return out_file

        except Exception as e:
            print(f"[RENDER ERROR] {e}")
            return None

if __name__ == "__main__":
    bot = ShortVideoBot()
    bot.generate_video()
