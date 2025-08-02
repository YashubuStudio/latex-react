import React from "react";
import { Button } from "@mui/material";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// デフォルトフォント
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// ⬇️⬇️⬇️ 日本語フォント(Base64)を設定してください ⬇️⬇️⬇️
const NotoSansJP_Base64 = "【ここにBase64データを貼り付け】";

// フォント初期化
pdfMake.vfs["NotoSansJP-Regular.ttf"] = NotoSansJP_Base64;
pdfMake.fonts = {
  NotoSansJP: { normal: "NotoSansJP-Regular.ttf" },
};

// メインコンポーネント
export default function PdfExporter({
  title,
  author,
  abstract,
  sections,
  figures,
  reference,
}) {
  // 画像をBase64に変換（Promise）
  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const generatePDF = async () => {
    // 図をBase64化
    const figurePromises = figures.map(async (fig) => ({
      caption: fig.caption,
      image: fig.file ? await fileToBase64(fig.file) : null,
    }));
    const figureResults = await Promise.all(figurePromises);

    // PDFドキュメント定義
    const docDefinition = {
      content: [
        { text: title, style: "title" },
        { text: `著者: ${author}`, style: "author", margin: [0, 10, 0, 10] },
        { text: "概要", style: "header" },
        { text: abstract, style: "text" },
        { text: "本文", style: "header", margin: [0, 10, 0, 5] },
        ...sections.flatMap((sec, idx) => [
          { text: `${idx + 1}. ${sec.title}`, style: "subheader" },
          { text: sec.text, style: "text" },
        ]),
        { text: "図", style: "header", margin: [0, 10, 0, 5] },
        ...figureResults.flatMap((fig, idx) =>
          fig.image
            ? [
                { image: fig.image, width: 300, margin: [0, 5, 0, 5] },
                { text: `図${idx + 1}: ${fig.caption}`, style: "figcaption" },
              ]
            : []
        ),
        { text: "参考文献", style: "header", margin: [0, 10, 0, 5] },
        { text: reference, style: "text" },
      ],
      defaultStyle: { font: "NotoSansJP" },
      styles: {
        title: { fontSize: 20, bold: true, alignment: "center" },
        author: { fontSize: 14, alignment: "center" },
        header: { fontSize: 16, bold: true, color: "#333" },
        subheader: { fontSize: 14, bold: true, margin: [0, 8, 0, 3] },
        text: { fontSize: 11, margin: [0, 0, 0, 8] },
        figcaption: {
          fontSize: 10,
          italics: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${title || "output"}.pdf`);
  };

  return (
    <Button variant="contained" color="primary" onClick={generatePDF}>
      PDFを生成してダウンロード
    </Button>
  );
}
