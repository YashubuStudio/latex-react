import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Button, Snackbar, Alert } from '@mui/material';
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

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(16);
      doc.text(title || '', 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(author || '', 10, y);
      y += 10;
      const abs = doc.splitTextToSize(abstract || '', 180);
      doc.text(abs, 10, y);
      y += abs.length * 7 + 5;

      for (const section of sections) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.text(section.title || '', 10, y);
        y += 8;
        doc.setFontSize(12);
        const split = doc.splitTextToSize(section.text || '', 180);
        doc.text(split, 10, y);
        y += split.length * 7 + 5;
      }

      for (const fig of figures) {
        if (fig.file) {
          const dataUrl = await readFile(fig.file);
          const imgProps = doc.getImageProperties(dataUrl);
          const pdfWidth = 180;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          if (y + pdfHeight > 280) {
            doc.addPage();
            y = 20;
          }
          doc.addImage(dataUrl, 'PNG', 10, y, pdfWidth, pdfHeight);
          y += pdfHeight + 5;
          doc.text(fig.caption || '', 10, y);
          y += 10;
        }
      }

      if (reference) {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.text('References', 10, y);
        y += 8;
        doc.setFontSize(12);
        const refs = doc.splitTextToSize(reference, 180);
        doc.text(refs, 10, y);
      }

      const blob = doc.output('blob');
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError('PDF生成に失敗しました');
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

      <Grid container spacing={2} sx={{ p: 2 }}>
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
        </Grid>
      </Grid>
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

