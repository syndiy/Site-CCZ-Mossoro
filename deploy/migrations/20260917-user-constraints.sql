-- Para banco criado pela versão anterior. Não remove linhas ou dados.
-- Email/CPF continuam únicos; nomes, telefones e hashes não são identificadores únicos.
DO $$
DECLARE item record;
BEGIN
  FOR item IN
    SELECT c.conrelid::regclass AS tabela, c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND c.conkey = ARRAY[a.attnum]::smallint[]
    WHERE c.contype = 'u'
      AND ((c.conrelid = 'allowed_employees'::regclass AND a.attname = 'name')
        OR (c.conrelid = 'users'::regclass AND a.attname IN ('username', 'phone', 'password')))
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', item.tabela, item.conname);
  END LOOP;
END $$;
