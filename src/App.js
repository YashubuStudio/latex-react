import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Box, Grid, Button,
  Snackbar, Alert, Container
} from "@mui/material";
import {
  TitleForm, AuthorForm, AbstractForm,
  SectionsForm, FiguresForm, ReferenceForm,
} from "./components/form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PaperPDF from "./components/PaperPDF";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [abstract, setAbstract] = useState("");
  const [sections, setSections] = useState([{ title: "", text: "" }]);
  const [figures, setFigures] = useState([]);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [pdfFigures, setPdfFigures] = useState([]);
  const [pdfReady, setPdfReady] = useState(false);

  // DataURL化
  const convertFigures = async (figs) => {
    const promises = figs.map(async (f) => {
      if (!f.file) return { ...f, dataUrl: null };
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f.file);
      });
      return { ...f, dataUrl };
    });
    return Promise.all(promises);
  };

  const handlePreparePdf = async () => {
    try {
      const figData = await convertFigures(figures);
      setPdfFigures(figData);
      setPdfReady(true);
    } catch (e) {
      setError("画像の変換に失敗しました");
    }
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            バーチャル学会向け 要旨作成フォーム
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TitleForm title={title} onChangeTitle={setTitle} />
            <AuthorForm author={author} onChangeAuthor={setAuthor} />
            <AbstractForm abstract={abstract} onChangeAbstract={setAbstract} />
            <SectionsForm sections={sections} onChangeSections={setSections} />
            <FiguresForm figures={figures} onChangeFigures={setFigures} />
            <ReferenceForm reference={reference} onChangeReference={setReference} />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePreparePdf}
            >
              PDFダウンロード準備
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">PDFダウンロード</Typography>
            <Box mt={1}>
              {pdfReady && (
                <PDFDownloadLink
                  document={
                    <PaperPDF
                      title={title}
                      author={author}
                      abstract={abstract}
                      sections={sections}
                      figures={pdfFigures}
                      reference={reference}
                    />
                  }
                  fileName="paper.pdf"
                  style={{ marginTop: 16, display: "block" }}
                >
                  {({ loading }) =>
                    loading ? "PDF作成中..." : "PDFをダウンロード"
                  }
                </PDFDownloadLink>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
