# --- Skree Glyph Map to HexaLang Opcode Snippets ---
import tkinter as tk
from tkinter import scrolledtext

# --- Skree Glyph Map to HexaLang Opcode Snippets ---
skree_to_hexalang = {
    "覗𓆣": "23 00",     # INP R0
    "彡𓆑": "01 01 02",   # SET R1 2
    "爬⟆": "04 00 01",   # MUL R0 R1
    "血⿻": "22 00",     # PRN R0
    "𓐍灬": "15",         # HLT
    "氷⟁": "01 00 00",   # SET R0 0
    "孓冂": "20 00",     # PUSH R0
    "牙彖": "05 00 01",   # DIV R0 R1
    "彁巛": "24 00 10",  # LD R0 @10
    "凵⿴": "25 00 11",  # ST R0 @11
    "幽𓏏": "00"          # NOP
}

# --- GUI Application ---
class SkreeLangGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("SkreeLang Visual Programmer")

        self.output_label = tk.Label(root, text="HexaLang Output:")
        self.output_label.pack()

        self.output_box = scrolledtext.ScrolledText(root, width=40, height=10, font=("Courier", 12))
        self.output_box.pack(pady=5)

        self.button_frame = tk.Frame(root)
        self.button_frame.pack()

        row, col = 0, 0
        for glyph in skree_to_hexalang:
            btn = tk.Button(self.button_frame, text=glyph, width=8, height=2, font=("Arial", 14),
                            command=lambda g=glyph: self.append_instruction(g))
            btn.grid(row=row, column=col, padx=3, pady=3)
            col += 1
            if col >= 4:
                col = 0
                row += 1

        self.clear_btn = tk.Button(root, text="Clear", command=self.clear_output)
        self.clear_btn.pack(pady=5)

    def append_instruction(self, glyph):
        if glyph in skree_to_hexalang:
            self.output_box.insert(tk.END, f"{skree_to_hexalang[glyph]}  # {glyph}\n")

    def clear_output(self):
        self.output_box.delete('1.0', tk.END)

# --- Run App ---
if __name__ == "__main__":
    root = tk.Tk()
    app = SkreeLangGUI(root)
    root.mainloop()
