import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const skreeMap = {
  "覗𓆣": { hex: "2300", meaning: "Input to Register 0" },
  "彡𓆑": { hex: "010102", meaning: "Set R1 = 2" },
  "爬⟆": { hex: "040001", meaning: "Multiply R0 * R1" },
  "血⿻": { hex: "2200", meaning: "Print R0" },
  "𓐍灬": { hex: "15", meaning: "Halt" }
};

export default function ShrineTerminal() {
  const [input, setInput] = useState("");
  const [hexLines, setHexLines] = useState([]);
  const [meaningLines, setMeaningLines] = useState([]);

  const translate = () => {
    const glyphs = input.trim().split(/\s+/);
    const hex = [];
    const meanings = [];
    glyphs.forEach((glyph) => {
      const item = skreeMap[glyph];
      if (item) {
        hex.push(`${item.hex}  // ${glyph}`);
        meanings.push(`${glyph} → ${item.meaning}`);
      } else {
        hex.push(`??    // ${glyph}`);
        meanings.push(`${glyph} → Unknown`);
      }
    });
    setHexLines(hex);
    setMeaningLines(meanings);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-black text-green-500 font-mono rounded-2xl shadow-xl">
      <Card className="bg-zinc-900 border border-green-700">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xl font-bold">Skree Input Terminal</h2>
          <Textarea
            className="w-full bg-black border border-green-700 text-green-400"
            placeholder="Enter Skree glyphs like 覗𓆣 彡𓆑 血⿻..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
          />
          <Button onClick={translate} className="bg-green-800 hover:bg-green-600">
            Translate
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border border-green-700">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">HexaLang Output</h2>
          <ScrollArea className="h-32">
            {hexLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {line}
              </div>
            ))}
          </ScrollArea>
          <h2 className="text-xl font-bold mt-4 mb-2">English Translation</h2>
          <ScrollArea className="h-32">
            {meaningLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {line}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}