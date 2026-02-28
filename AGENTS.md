# AGENTS.md (IllustDash)

## 目的
このリポジトリは Vite + React のフロントエンドです。
Supabase 接続できない場合はローカルストレージで動作します。

## 開発コマンド
- npm run dev
- npm run build
- npm run preview

## 環境変数（Vercel/Supabase）
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## 作業ルール
- 変更は小さく（1 PR = 1目的）
- UI崩れがないか必ず確認
- 変更後は必ず `npm run build` が通ること
- 機能追加より先に、入力バリデーション/エラー表示など“事故りにくさ”を優先
