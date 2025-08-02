import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Button, Snackbar, Alert, Container } from '@mui/material';
import { TitleForm, AuthorForm, AbstractForm, SectionsForm, FiguresForm, ReferenceForm } from './components/form';

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [abstract, setAbstract] = useState('');
  const [sections, setSections] = useState([{ title: '', text: '' }]);
  const [figures, setFigures] = useState([]);
  const [reference, setReference] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  const createFormData = () => {
    const formData = new FormData();
    const json = {
      title,
      author,
      abstract,
      body: sections.map((s) => ({ title: s.title, text: s.text })),
      teaser: undefined,
      figure: figures.map((f, idx) => ({
        section_index: idx + 1,
        caption: f.caption,
      })),
      reference: reference
        ? reference.split('\n').map((ref) => ({ value: ref }))
        : [],
    };
    formData.append('data', JSON.stringify(json));
    figures.forEach((f) => {
      formData.append('files', f.file ? f.file : new Blob());
    });
    if (!figures.length) {
      formData.append('files', new Blob());
    }
    formData.append('teaser', new Blob());
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = createFormData();
      const response = await fetch('http://localhost:8000/v1/pdf/create', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('response was not ok');
      }
      const blob = await response.blob();
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
            <Box mt={1} sx={{ border: '1px solid #ccc', minHeight: 800 }}>
              {pdfUrl ? (
                <iframe title="pdf" src={pdfUrl} style={{ width: '100%', height: '100%' }} />
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

