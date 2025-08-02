import React, { useRef, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LatexPdfExport = () => {
  const [input, setInput] = useState("\\int_0^\\infty x^2 dx");
  const previewRef = useRef(null);

  const generatePDF = async () => {
    const inputElement = previewRef.current;
    if (!inputElement) return;

    const canvas = await html2canvas(inputElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // 幅に合わせて高さ自動調整
    pdf.save("latex-output.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>LaTeX式 入力:</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", height: "100px", fontSize: "16px" }}
      />

      <h3>KaTeXでの表示:</h3>
      <div ref={previewRef} style={{ padding: 10, background: "#f0f0f0" }}>
        <BlockMath math={input} />
      </div>

      <h3>MathJaxでの表示:</h3>
      <MathJaxContext>
        <MathJax>{`\\[ ${input} \\]`}</MathJax>
      </MathJaxContext>

      <br />
      <button onClick={generatePDF}>PDFを生成してダウンロード</button>
    </div>
  );
};

export default LatexPdfExport;
