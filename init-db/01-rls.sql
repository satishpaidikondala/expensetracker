-- Shared schema RLS for multi-tenancy (cost-efficient, DB-level isolation)
-- Postgres init script executed on first volume creation

-- Ensure pgcrypto for future JWT/UUID if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Expense table will be created by JPA (ddl-auto=update), then we enforce RLS
-- This script is idempotent via DO block
DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(500),
    avatar_url VARCHAR(500),
    provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL',
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);

  -- Wait for table existence is handled at app startup; we pre-create minimal table to attach policy
  CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    amount NUMERIC(38,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    date DATE NOT NULL,
    user_id VARCHAR(255) NOT NULL DEFAULT 'default'
  );
  CREATE INDEX IF NOT EXISTS idx_category ON expenses(category);
  CREATE INDEX IF NOT EXISTS idx_date ON expenses(date);
  CREATE INDEX IF NOT EXISTS idx_user_id ON expenses(user_id);

  -- Enable RLS
  EXECUTE 'ALTER TABLE expenses ENABLE ROW LEVEL SECURITY';
  -- Drop old policies if re-run
  DROP POLICY IF EXISTS tenant_isolation ON expenses;
  -- Policy: row is visible only when current_setting user_id matches row's user_id
  -- Fallback to 'default' for local-dev without JWT, or bypass for app user via BYPASSRLS (postgres superuser)
  CREATE POLICY tenant_isolation ON expenses
    USING (user_id = current_setting('app.current_user_id', true) OR current_setting('app.current_user_id', true) IS NULL OR current_setting('app.current_user_id', true) = 'default')
    WITH CHECK (user_id = current_setting('app.current_user_id', true) OR current_setting('app.current_user_id', true) IS NULL);

  -- Force RLS for table owner as well (so even app superuser is filtered)
  EXECUTE 'ALTER TABLE expenses FORCE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RLS setup skipped: %', SQLERRM;
END $$;
