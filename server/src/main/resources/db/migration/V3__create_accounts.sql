CREATE TABLE
    accounts (
        id UUID PRIMARY KEY DEFAULT uuidv7 (),
        icon VARCHAR(31) NOT NULL,
        name VARCHAR(255) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        initial_balance BIGINT NOT NULL DEFAULT 0,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_accounts_user_name_id ON accounts (user_id, LOWER(name), id);