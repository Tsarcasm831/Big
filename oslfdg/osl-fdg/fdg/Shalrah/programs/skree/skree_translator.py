# --- Skree Glyph Map to HexaLang Opcode Snippets ---
import json

# Load SkreeLang-to-HexaLang map
with open("skree_to_hexalang.json", "r", encoding="utf-8") as f:
    glyph_map = json.load(f)

glyph_to_opcode = glyph_map["glyph_to_opcode"]

# Example glyph-to-register mapping (you can improve this logic later)
REGISTERS = {
    0: "00",
    1: "01",
    2: "02",
    3: "03",
    4: "04",
    5: "05"
}

# Simple register assignment queue
reg_queue = [0, 1, 0]  # Example: INP to R0, SET R1 2, MUL R0 R1

def tokenize_skree(input_str):
    tokens = []
    glyphs = input_str.split()

    for g in glyphs:
        if g in glyph_to_opcode:
            tokens.append({
                "glyph": g,
                "type": "instruction",
                "name": glyph_to_opcode[g]["name"],
                "opcode": glyph_to_opcode[g]["opcode"]
            })
        else:
            tokens.append({
                "glyph": g,
                "type": "unknown",
                "error": "Unrecognized glyph"
            })
    return tokens

def generate_hexalang(tokens):
    hex_output = []
    reg_ptr = 0

    for i, token in enumerate(tokens):
        if token["type"] != "instruction":
            continue

        opcode = token["opcode"]

        # Handle specific opcodes with simulated arguments
        if opcode == "23":  # INP R0
            reg = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            hex_output.append(f"{opcode}{reg}")
            reg_ptr += 1

        elif opcode == "01":  # SET R1 2
            r = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            val = REGISTERS[2]  # Let’s say we always set to 2 for now
            hex_output.append(f"{opcode}{r}{val}")
            reg_ptr += 1

        elif opcode in ["02", "03", "04", "05", "10", "11"]:  # Two register ops
            r1 = REGISTERS[reg_queue[(reg_ptr) % len(reg_queue)]]
            r2 = REGISTERS[reg_queue[(reg_ptr+1) % len(reg_queue)]]
            hex_output.append(f"{opcode}{r1}{r2}")
            reg_ptr += 2

        elif opcode in ["13", "14"]:  # Conditional jump with 3 args
            r1 = REGISTERS[reg_queue[(reg_ptr) % len(reg_queue)]]
            r2 = REGISTERS[reg_queue[(reg_ptr+1) % len(reg_queue)]]
            addr = "03"  # Placeholder jump target
            hex_output.append(f"{opcode}{r1}{r2}{addr}")
            reg_ptr += 2

        elif opcode in ["12"]:  # Unconditional JMP
            hex_output.append(f"{opcode}03")  # placeholder addr

        elif opcode in ["22", "20", "21", "24", "25"]:  # Single-register ops
            r = REGISTERS[reg_queue[reg_ptr % len(reg_queue)]]
            hex_output.append(f"{opcode}{r}")
            reg_ptr += 1

        elif opcode == "15":  # HLT
            hex_output.append(opcode)

        elif opcode == "00":  # NOP
            hex_output.append(opcode)

        else:
            hex_output.append(opcode + "??")  # Unknown behavior

    return hex_output
