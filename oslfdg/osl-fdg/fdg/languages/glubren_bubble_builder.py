import tkinter as tk
from PIL import Image, ImageDraw, ImageFont
from tkinter import filedialog

# Sample glyphs from Glub'ren
core_glyphs = ["𓆉", "𓆡", "𓆛", "𓆞", "𓇼", "𓈗", "𓆟", "𓆢", "𓋹", "𓆝", "𓇢"]
modifiers = ["○", "◍", "◎", "◉", "◐", "◓", "◑"]
sacred = ["𓇣", "𓇌", "𓇤", "𓆱", "𓍑"]

# UI Setup
app = tk.Tk()
app.title("Glub'ren Bubble Builder")

selected_glyphs = []

def add_glyph(glyph):
    selected_glyphs.append(glyph)
    update_preview()

def clear_stack():
    selected_glyphs.clear()
    update_preview()

def update_preview():
    preview.delete("1.0", tk.END)
    for glyph in reversed(selected_glyphs):
        preview.insert(tk.END, glyph + "\n")

def export_stack():
    if not selected_glyphs:
        return
    img = Image.new("RGB", (200, 40 * len(selected_glyphs)), "white")
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("arial.ttf", 36)

    for i, glyph in enumerate(reversed(selected_glyphs)):
        draw.text((50, i * 40), glyph, font=font, fill="black")

    filepath = filedialog.asksaveasfilename(defaultextension=".png")
    if filepath:
        img.save(filepath)

# Glyph Buttons
frame = tk.Frame(app)
frame.pack(side=tk.LEFT, padx=10)

tk.Label(frame, text="Core Glyphs").pack()
for g in core_glyphs:
    tk.Button(frame, text=g, command=lambda g=g: add_glyph(g), width=4).pack()

tk.Label(frame, text="Modifiers").pack()
for g in modifiers:
    tk.Button(frame, text=g, command=lambda g=g: add_glyph(g), width=4).pack()

tk.Label(frame, text="Sacred Pearls").pack()
for g in sacred:
    tk.Button(frame, text=g, command=lambda g=g: add_glyph(g), width=4).pack()

tk.Button(frame, text="Clear", command=clear_stack, bg="red").pack(pady=10)
tk.Button(frame, text="Export Image", command=export_stack, bg="green").pack()

# Preview Area
preview = tk.Text(app, height=25, width=10, font=("Arial", 24))
preview.pack(side=tk.RIGHT, padx=10)

app.mainloop()
