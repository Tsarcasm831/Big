import tkinter as tk
from tkinter import scrolledtext, filedialog, messagebox
import json
import os
import platform
import webbrowser

# Load full glyph mapping
with open("skree_to_hexalang.json", "r", encoding="utf-8") as f:
    glyph_map = json.load(f)

glyph_to_opcode = glyph_map["glyph_to_opcode"]
modifiers = glyph_map["modifiers"]
augmenters = glyph_map["psychic_augmenters"]

REGISTERS = {0: "00", 1: "01", 2: "02", 3: "03", 4: "04", 5: "05"}
reg_queue = [0, 1, 0]

# Tokenize input into recognized tokens
def tokenize_skree(input_str):
    tokens = []
    glyphs = input_str.split()

    for g in glyphs:
        if g in glyph_to_opcode:
            tokens.append({
                "glyph": g,
                "type": "instruction",
                "name": glyph_to_opcode[g]["name"],
                "opcode": glyph_to_opcode[g]["opcode"],
                "description": glyph_to_opcode[g]["description"],
                "meaning": glyph_to_opcode[g]["meaning"]
            })
        elif g in modifiers:
            tokens.append({
                "glyph": g,
                "type": "modifier",
                "name": modifiers[g]["name"],
                "function": modifiers[g]["function"]
            })
        elif g in augmenters:
            tokens.append({
                "glyph": g,
                "type": "augmenter",
                "name": augmenters[g]["name"],
                "effect": augmenters[g]["effect"]
            })
        else:
            tokens.append({
                "glyph": g,
                "type": "unknown",
                "error": "Unrecognized glyph"
            })
    return tokens

# Generate opcodes based on instructions
def generate_hexalang(tokens):
    hex_output = []
    reg_ptr = 0

    for token in tokens:
        if token["type"] != "instruction":
            continue

        opcode = token["opcode"]

        if opcode == "23":
            r = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            hex_output.append(f"{opcode}{r}  # {token['glyph']}")
            reg_ptr += 1
        elif opcode == "01":
            r = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            val = REGISTERS[2]
            hex_output.append(f"{opcode}{r}{val}  # {token['glyph']}")
            reg_ptr += 1
        elif opcode in ["02", "03", "04", "05", "10", "11"]:
            r1 = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            r2 = REGISTERS[reg_queue[(reg_ptr+1) % len(reg_queue)]]
            hex_output.append(f"{opcode}{r1}{r2}  # {token['glyph']}")
            reg_ptr += 2
        elif opcode in ["13", "14"]:
            r1 = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            r2 = REGISTERS[reg_queue[(reg_ptr+1) % len(reg_queue)]]
            hex_output.append(f"{opcode}{r1}{r2}03  # {token['glyph']}")
            reg_ptr += 2
        elif opcode == "12":
            hex_output.append(f"{opcode}03  # {token['glyph']}")
        elif opcode in ["22", "20", "21", "24", "25"]:
            r = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            hex_output.append(f"{opcode}{r}  # {token['glyph']}")
            reg_ptr += 1
        elif opcode in ["00", "15"]:
            hex_output.append(f"{opcode}  # {token['glyph']}")
        else:
            hex_output.append(f"{opcode}??  # {token['glyph']}")

    return hex_output

# --- GUI Class ---
class SkreeLangGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("SkreeLang Editor — Shal'Rah Command Interface")

        self.instruction_label = tk.Label(root, text="SkreeLang Glyph Input:")
        self.instruction_label.pack()

        self.input_field = scrolledtext.ScrolledText(root, width=50, height=4, font=("Courier", 16))
        self.input_field.pack(pady=5)

        self.translate_btn = tk.Button(root, text="Translate to HexaLang", command=self.translate)
        self.translate_btn.pack(pady=5)

        self.output_label = tk.Label(root, text="HexaLang Output:")
        self.output_label.pack()

        self.output_box = scrolledtext.ScrolledText(root, width=50, height=10, font=("Courier", 12))
        self.output_box.pack(pady=5)

        self.english_label = tk.Label(root, text="English Translation:")
        self.english_label.pack()

        self.english_box = scrolledtext.ScrolledText(root, width=50, height=6, font=("Courier", 12))
        self.english_box.pack(pady=5)

        self.save_btn = tk.Button(root, text="Save to .sk6", command=self.save_to_file)
        self.save_btn.pack(pady=5)

        self.render_btn = tk.Button(root, text="Render SVG of Glyphs", command=self.render_svg)
        self.render_btn.pack(pady=5)

        self.clear_btn = tk.Button(root, text="Clear All", command=self.clear_all)
        self.clear_btn.pack(pady=5)

    def translate(self):
        input_text = self.input_field.get("1.0", tk.END).strip()
        tokens = tokenize_skree(input_text)
        hexalang = generate_hexalang(tokens)

        self.output_box.delete('1.0', tk.END)
        self.english_box.delete('1.0', tk.END)

        for token, line in zip(tokens, hexalang):
            self.output_box.insert(tk.END, line + "\n")
            if token["type"] == "instruction":
                self.english_box.insert(tk.END, f"{token['glyph']} → {token['meaning']}\n")
                self.play_sound(token['glyph'])
            elif token["type"] == "modifier":
                self.english_box.insert(tk.END, f"{token['glyph']} → MOD: {token['function']}\n")
            elif token["type"] == "augmenter":
                self.english_box.insert(tk.END, f"{token['glyph']} → AUG: {token['effect']}\n")

    def play_sound(self, glyph):
        if platform.system() == "Windows":
            import winsound
            freq = 400 + (hash(glyph) % 400)
            winsound.Beep(freq, 150)
        else:
            os.system('printf "\\a"')  # Simple bell on UNIX

    def render_svg(self):
        glyphs = self.input_field.get("1.0", tk.END).strip().split()
        svg_content = f"""
        <svg xmlns='http://www.w3.org/2000/svg' width='1000' height='200'>
            <style>.glyph {{ font-size: 32px; font-family: sans-serif; }}</style>
            {''.join([f"<text x='{i*60 + 10}' y='100' class='glyph'>{glyph}</text>" for i, glyph in enumerate(glyphs)])}
        </svg>
        """
        with open("glyph_render.svg", "w", encoding="utf-8") as f:
            f.write(svg_content)
        webbrowser.open("glyph_render.svg")

    def save_to_file(self):
        content = self.output_box.get("1.0", tk.END).strip()
        if not content:
            messagebox.showwarning("Empty", "Nothing to save.")
            return
        filepath = filedialog.asksaveasfilename(defaultextension=".sk6",
                                                filetypes=[("SkreeLang Crystal", "*.sk6")])
        if filepath:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            messagebox.showinfo("Saved", f"Saved to {filepath}")

    def clear_all(self):
        self.input_field.delete('1.0', tk.END)
        self.output_box.delete('1.0', tk.END)
        self.english_box.delete('1.0', tk.END)

# --- Launch App ---
if __name__ == "__main__":
    root = tk.Tk()
    app = SkreeLangGUI(root)
    root.mainloop()
