CREATE TABLE
    categories (
        id UUID PRIMARY KEY DEFAULT uuidv7 (),
        kind VARCHAR(7) NOT NULL CHECK (kind IN ('INCOME', 'EXPENSE')),
        icon VARCHAR(31) NOT NULL,
        name VARCHAR(255) NOT NULL,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_categories_user_name_id ON categories (user_id, LOWER(name), id);