import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// 日本語フォントを手動で追加
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const loadJapaneseFont = async () => {
  const fontUrl = "/fonts/NotoSansJP-Regular.ttf";
  const response = await fetch(fontUrl);
  const fontData = await response.arrayBuffer();
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(fontData))
  );
  pdfMake.vfs["NotoSansJP-Regular.ttf"] = base64String;
  pdfMake.fonts = {
    NotoSansJP: {
      normal: "NotoSansJP-Regular.ttf",
    },
  };
};

// フォント初期化（初回のみ）
loadJapaneseFont();

export default function LatexPdfExportWithMUI() {
  const [latexInput, setLatexInput] = useState(
    "\\int_0^\\infty x^2 dx\nこれは日本語のテストです"
  );

  const handleDownloadPDF = () => {
    const docDefinition = {
      content: [
        { text: "LaTeX PDF 出力デモ（日本語 & 数式対応）", style: "header" },
        { text: "\n入力内容：", style: "subheader" },
        { text: latexInput, style: "content" },
        { text: "\n（数式部分はLaTeX表記のまま表示されます）", style: "note" },
      ],
      defaultStyle: {
        font: "NotoSansJP",
      },
      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 13, bold: true },
        content: { fontSize: 12, margin: [0, 5, 0, 5] },
        note: { fontSize: 10, italics: true, color: "gray" },
      },
    };
    pdfMake.createPdf(docDefinition).download("latex-japanese-output.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        LaTeX PDF 出力デモ（日本語 & 数式対応）
      </Typography>

      <TextField
        label="LaTeX + 日本語入力"
        multiline
        fullWidth
        minRows={5}
        value={latexInput}
        onChange={(e) => setLatexInput(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
        <Button variant="contained" onClick={handleDownloadPDF}>
          PDFとしてダウンロード
        </Button>
      </Stack>

      <Paper
        sx={{
          p: 3,
          backgroundColor: "#fafafa",
          fontFamily: `"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif`,
        }}
      >
        <Typography variant="h6" gutterBottom>
          📘 KaTeX での表示
        </Typography>
        <BlockMath math={latexInput} />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          📗 MathJax での表示
        </Typography>
        <MathJaxContext>
          <MathJax>{`\\[ ${latexInput} \\]`}</MathJax>
        </MathJaxContext>

        <Typography variant="body1" sx={{ mt: 3 }}>
          {latexInput}
        </Typography>
      </Paper>
    </Box>
  );
}
