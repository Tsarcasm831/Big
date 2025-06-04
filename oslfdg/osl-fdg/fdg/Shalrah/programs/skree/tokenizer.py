import json

# Load your glyph-to-opcode map from previous step
with open("skree_to_hexalang.json", "r", encoding="utf-8") as f:
    glyph_map = json.load(f)

def tokenize_skree(input_str):
    tokens = []
    glyphs = input_str.split()
    glyph_to_opcode = glyph_map["glyph_to_opcode"]
    modifiers = glyph_map["modifiers"]
    augmenters = glyph_map["psychic_augmenters"]

    for g in glyphs:
        if g in glyph_to_opcode:
            token = {
                "glyph": g,
                "type": "instruction",
                "name": glyph_to_opcode[g]["name"],
                "opcode": glyph_to_opcode[g]["opcode"],
                "description": glyph_to_opcode[g]["description"]
            }
        elif g in modifiers:
            token = {
                "glyph": g,
                "type": "modifier",
                "name": modifiers[g]["name"],
                "function": modifiers[g]["function"]
            }
        elif g in augmenters:
            token = {
                "glyph": g,
                "type": "augmenter",
                "name": augmenters[g]["name"],
                "effect": augmenters[g]["effect"]
            }
        else:
            token = {
                "glyph": g,
                "type": "unknown",
                "error": "Unrecognized glyph"
            }

        tokens.append(token)

    return tokens
