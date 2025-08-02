import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Container,
} from '@mui/material';
import jsPDF from 'jspdf';
import {
  TitleForm,
  AuthorForm,
  AbstractForm,
  SectionsForm,
  FiguresForm,
  ReferenceForm,
} from './components/form';

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [abstract, setAbstract] = useState('');
  const [sections, setSections] = useState([{ title: '', text: '' }]);
  const [figures, setFigures] = useState([]);
  const [reference, setReference] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const doc = new jsPDF();
      let y = 10;

      if (title) {
        doc.setFontSize(16);
        doc.text(title, 10, y);
        y += 10;
      }
      if (author) {
        doc.setFontSize(12);
        doc.text(`著者: ${author}`, 10, y);
        y += 10;
      }
      if (abstract) {
        doc.text('概要', 10, y);
        y += 10;
        doc.text(abstract, 10, y);
        y += 10;
      }
      sections.forEach((s, idx) => {
        if (!s.title && !s.text) return;
        doc.text(`${idx + 1}. ${s.title}`, 10, y);
        y += 10;
        if (s.text) {
          doc.text(s.text, 10, y);
          y += 10;
        }
      });

      const blob = doc.output('blob');
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError('PDF生成に失敗しました');
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'paper.pdf';
    a.click();
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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <TitleForm title={title} onChangeTitle={setTitle} />
              <AuthorForm author={author} onChangeAuthor={setAuthor} />
              <AbstractForm abstract={abstract} onChangeAbstract={setAbstract} />
              <SectionsForm sections={sections} onChangeSections={setSections} />
              <FiguresForm figures={figures} onChangeFigures={setFigures} />
              <ReferenceForm reference={reference} onChangeReference={setReference} />
              <Button type="submit" variant="contained" fullWidth>
                pdf出力
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">pdf出力結果</Typography>
            <Box mt={1} sx={{ border: '1px solid #ccc', height: 560 }}>
              {pdfUrl ? (
                <iframe
                  title="pdf"
                  src={pdfUrl}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Typography color="text.secondary">出力結果がありません</Typography>
              )}
            </Box>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              fullWidth
              disabled={!pdfUrl}
              onClick={handleDownload}
            >
              ダウンロード
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;

