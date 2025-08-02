import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function LatexPdfExportWithMUI() {
  const [latexInput, setLatexInput] = useState("\\int_0^\\infty x^2 dx");
  const pdfTargetRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!pdfTargetRef.current) return;

    const canvas = await html2canvas(pdfTargetRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("latex-output.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        LaTeX PDF 出力デモ（MUI対応）
      </Typography>

      <TextField
        label="LaTeX式を入力"
        multiline
        fullWidth
        minRows={4}
        value={latexInput}
        onChange={(e) => setLatexInput(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
        <Button variant="contained" onClick={handleDownloadPDF}>
          PDFとしてダウンロード
        </Button>
      </Stack>

      <Paper ref={pdfTargetRef} sx={{ p: 3, backgroundColor: "#fafafa" }}>
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
      </Paper>
    </Box>
  );
}
