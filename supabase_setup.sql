-- IllustDash Supabase Setup
-- SupabaseのSQL Editorで実行してください

-- プロジェクトテーブル作成
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'キャラデザ',
    price NUMERIC NOT NULL DEFAULT 0,
    hours NUMERIC NOT NULL DEFAULT 0,
    delivery_date DATE,
    status TEXT NOT NULL DEFAULT '制作中',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSを有効化（必要に応じて）
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み書き権限を付与（パブリックアクセス用）
DROP POLICY IF EXISTS "Allow all access" ON projects;
CREATE POLICY "Allow all access" ON projects FOR ALL USING (true) WITH CHECK (true);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
