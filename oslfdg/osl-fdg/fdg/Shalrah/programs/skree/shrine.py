import tkinter as tk
from tkinter import messagebox
import random
import math

# Expanded Skree glyph command system with visual oddities
skree_controls = [
    {"glyph": "覗𓆣", "label": "Input", "hex": "2300", "meaning": "Input to Register 0"},
    {"glyph": "彡𓆑", "label": "Set R1", "hex": "010102", "meaning": "Set R1 = 2"},
    {"glyph": "爬⟆", "label": "Multiply", "hex": "040001", "meaning": "Multiply R0 * R1"},
    {"glyph": "血⿻", "label": "Print", "hex": "2200", "meaning": "Print R0"},
    {"glyph": "𓐍灬", "label": "Halt", "hex": "15", "meaning": "Halt program"},
    {"glyph": "亘𓊽", "label": "Jump", "hex": "1203", "meaning": "Jump to addr 03"},
    {"glyph": "叱𓃠", "label": "Modulo", "hex": "100001", "meaning": "MOD R0 R1"},
    {"glyph": "𓇳氐", "label": "JNE", "hex": "14000103", "meaning": "Jump if not equal"},
    {"glyph": "丂⻗", "label": "POP", "hex": "2100", "meaning": "POP to Register 0"},
    {"glyph": "⿷𓊃", "label": "Spirit", "hex": "0000", "meaning": "NOP / Spiritual Sync"}
]

class ShrineTerminalGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Shrine Terminal — Skree Control Core")
        self.root.configure(bg="black")
        self.output = []

        self.flux_color = "lime"
        self.dynamic_tick = 0

        # Terminal display
        self.terminal_display = tk.Text(root, height=8, width=60, bg="black", fg=self.flux_color,
                                        font=("Courier", 12), insertbackground=self.flux_color)
        self.terminal_display.pack(pady=10)

        # Control grid
        control_frame = tk.Frame(root, bg="black")
        control_frame.pack()

        for i, ctrl in enumerate(skree_controls):
            b = tk.Button(control_frame, text=ctrl["glyph"], width=6, height=2,
                          font=("Courier", 16), bg="black", fg=self.flux_color,
                          activebackground="darkgreen", activeforeground="lime",
                          command=lambda c=ctrl: self.activate_control(c))
            b.grid(row=i // 4, column=i % 4, padx=8, pady=8)

        # Dials and switches
        oddity_frame = tk.Frame(root, bg="black")
        oddity_frame.pack(pady=10)

        tk.Label(oddity_frame, text="ψ Frequency Dial", fg=self.flux_color, bg="black", font=("Courier", 12)).pack()
        self.dial = tk.Scale(oddity_frame, from_=100, to=1000, orient="horizontal",
                             bg="black", fg=self.flux_color, troughcolor="gray",
                             highlightthickness=0, font=("Courier", 10))
        self.dial.set(440)
        self.dial.pack()

        # Chaos switch
        self.switch_state = tk.BooleanVar()
        self.switch = tk.Checkbutton(oddity_frame, text="🔀 Glyph Inversion", variable=self.switch_state,
                                     bg="black", fg=self.flux_color, selectcolor="black", font=("Courier", 12))
        self.switch.pack()

        # Anomaly toggle
        self.anomaly_state = tk.BooleanVar()
        self.anomaly_switch = tk.Checkbutton(oddity_frame, text="✴ Psionic Anomaly", variable=self.anomaly_state,
                                             bg="black", fg="red", selectcolor="black", font=("Courier", 12))
        self.anomaly_switch.pack(pady=5)

        # Execute and clear
        bottom = tk.Frame(root, bg="black")
        bottom.pack(pady=10)

        tk.Button(bottom, text="▶ Execute", bg="black", fg="lime", font=("Courier", 12), command=self.run_program).pack(side="left", padx=10)
        tk.Button(bottom, text="✖ Clear", bg="black", fg="lime", font=("Courier", 12), command=self.clear_terminal).pack(side="left", padx=10)

        self.update_flux()

    def activate_control(self, ctrl):
        glyph = ctrl["glyph"]
        if self.switch_state.get():
            glyph = glyph[::-1]
        line = f"{ctrl['hex']}  // {glyph} — {ctrl['meaning']}"
        self.terminal_display.insert(tk.END, line + "\n")
        self.beep(glyph)
        if self.anomaly_state.get() and random.random() < 0.2:
            glitch = f"!!! Skree Cascade: {glyph} destabilized."
            self.terminal_display.insert(tk.END, glitch + "\n")

    def beep(self, glyph):
        try:
            import winsound
            freq = self.dial.get() + (hash(glyph) % 50)
            winsound.Beep(freq, 120)
        except:
            pass

    def run_program(self):
        messagebox.showinfo("Execution", "Psionic signal broadcast complete.")

    def clear_terminal(self):
        self.terminal_display.delete("1.0", tk.END)

    def update_flux(self):
        # Animate terminal color for a breathing effect
        self.dynamic_tick += 1
        brightness = int(100 + 155 * (0.5 + 0.5 * math.sin(self.dynamic_tick * 0.1)))
        self.flux_color = f"#{brightness:02x}ff{brightness:02x}"
        self.terminal_display.config(fg=self.flux_color, insertbackground=self.flux_color)
        self.root.after(100, self.update_flux)


if __name__ == "__main__":
    root = tk.Tk()
    app = ShrineTerminalGUI(root)
    root.mainloop()