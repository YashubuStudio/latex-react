# Frontend Design and Required Code

## 概要
- React + TypeScript + Vite で構築。
- UI コンポーネントは Material UI を使用。
- エントリポイントは `src/main.tsx`、メイン画面は `src/App.tsx`。

## 画面構成
- 上部に `Bar` コンポーネント(AppBar)を表示し、サイト名・説明のトグル・公式サイトへのリンクを提供。
- 画面は左右2カラム構成。
  - 左カラム: 入力フォーム群。
  - 右カラム: PDF プレビュー用 iframe。
- `Snackbar` + `Alert` によりエラーを通知。

### フォームコンポーネント
各フォームは `src/components/form.tsx` に定義。
- `TitleForm` / `AuthorForm` : タイトル・著者のテキスト入力。
- `TeaserForm` : ティザー画像のキャプションとファイルを入力。追加・削除可能。
- `AbstractForm` : 概要のテキスト入力。
- `SectionsForm` : 本文セクションを複数管理。追加・削除可能。
- `FiguresForm` : 図を複数管理。キャプションと画像ファイルを指定し、順番どおりに送信。
- `ReferenceFrom` : 参考文献を複数行テキストで入力。

## データ処理
- `src/core/form.ts` でフォーム入力型を定義。
- `src/core/pdf.ts` で API へ送る JSON 構造を定義。
- `App.tsx` 内の `CreateFormData` がフォームデータを組み立て、画像ファイルを添付。
- `Submit` 関数が `fetch` により `http://{VITE_HOSTNAME}:8000/v1/pdf/create` へ POST。
- レスポンスの Blob を `pdfUrl` として `iframe` に表示。
- `ConvertReference` / `ConvertTeaser` / `ConvertSection` / `ConvertFigure` が UI 型を API 型へ変換。

## 主な機能
- タイトル・著者・概要・本文・参考文献の入力。
- ティザー画像と複数図の追加/削除。
- API から生成された PDF をリアルタイムでプレビュー。
- エラー発生時のメッセージ表示。

## 今後の拡張案
- 型定義ファイルの未使用警告解消。
- フォーム入力のバリデーションや保存機能の追加。
- サーバーを用いない PDF 生成ライブラリへの置き換え検討。
