import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

export const TitleForm = ({ title, onChangeTitle }) => (
  <Box mb={2}>
    <TextField label="タイトル" fullWidth value={title} onChange={(e)=>onChangeTitle(e.target.value)} />
  </Box>
);

export const AuthorForm = ({ author, onChangeAuthor }) => (
  <Box mb={2}>
    <TextField label="著者" fullWidth value={author} onChange={(e)=>onChangeAuthor(e.target.value)} />
  </Box>
);

export const AbstractForm = ({ abstract, onChangeAbstract }) => (
  <Box mb={2}>
    <TextField label="概要" multiline minRows={3} fullWidth value={abstract} onChange={(e)=>onChangeAbstract(e.target.value)} />
  </Box>
);

export const SectionsForm = ({ sections, onChangeSections }) => {
  const handleChange = (idx, field, value) => {
    const next = sections.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    onChangeSections(next);
  };
  const add = () => onChangeSections([...sections, { title: '', text: '' }]);
  const remove = (idx) => {
    const next = sections.filter((_, i) => i !== idx);
    onChangeSections(next);
  };
  return (
    <Box mb={2}>
      <Typography variant="h6">本文セクション</Typography>
      {sections.map((section, idx) => (
        <Box key={idx} mb={2}>
          <TextField label={`セクション${idx + 1} タイトル`} fullWidth value={section.title} onChange={(e)=>handleChange(idx,'title',e.target.value)} sx={{ mb: 1 }} />
          <TextField label="本文" multiline minRows={3} fullWidth value={section.text} onChange={(e)=>handleChange(idx,'text',e.target.value)} />
          <Button onClick={()=>remove(idx)} sx={{ mt: 1 }}>削除</Button>
        </Box>
      ))}
      <Button onClick={add}>セクション追加</Button>
    </Box>
  );
};

export const FiguresForm = ({ figures, onChangeFigures }) => {
  const handleChange = (idx, field, value) => {
    const next = figures.map((f, i) => i === idx ? { ...f, [field]: value } : f);
    onChangeFigures(next);
  };
  const add = () => onChangeFigures([...figures, { caption: '', file: undefined }]);
  const remove = (idx) => {
    const next = figures.filter((_, i) => i !== idx);
    onChangeFigures(next);
  };
  return (
    <Box mb={2}>
      <Typography variant="h6">図</Typography>
      {figures.map((fig, idx) => (
        <Box key={idx} mb={2}>
          <TextField label={`図${idx + 1} キャプション`} fullWidth value={fig.caption} onChange={(e)=>handleChange(idx,'caption',e.target.value)} sx={{ mb: 1 }} />
          <Button variant="outlined" component="label">
            画像を選択
            <input type="file" hidden onChange={(e)=>handleChange(idx,'file',e.target.files?.[0])} />
          </Button>
          {fig.file && <Typography variant="body2" sx={{ mt: 1 }}>{fig.file.name}</Typography>}
          <Button onClick={()=>remove(idx)} sx={{ mt: 1 }}>削除</Button>
        </Box>
      ))}
      <Button onClick={add}>図を追加</Button>
    </Box>
  );
};

export const ReferenceForm = ({ reference, onChangeReference }) => (
  <Box mb={2}>
    <TextField label="参考文献" multiline minRows={3} fullWidth value={reference} onChange={(e)=>onChangeReference(e.target.value)} />
  </Box>
);

