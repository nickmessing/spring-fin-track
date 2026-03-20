CREATE TABLE
    transactions (
        id UUID PRIMARY KEY DEFAULT uuidv7 (),
        kind VARCHAR(8) NOT NULL CHECK (kind IN ('INCOME', 'EXPENSE', 'TRANSFER')),
        amount BIGINT NOT NULL,
        destination_amount BIGINT,
        description VARCHAR(1000),
        account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
        destination_account_id UUID REFERENCES accounts (id) ON DELETE SET NULL,
        category_id UUID REFERENCES categories (id) ON DELETE SET NULL,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_transactions_user_id ON transactions (user_id, id DESC);

CREATE INDEX idx_transactions_account_id ON transactions (account_id);

CREATE INDEX idx_transactions_destination_account_id ON transactions (destination_account_id);