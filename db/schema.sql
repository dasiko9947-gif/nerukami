-- AI-Академия «Не руками» — схема базы данных
-- PostgreSQL 16+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name          TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Сессии (вместо JWT — проще отзывать)
CREATE TABLE IF NOT EXISTS sessions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Подписки / доступ
CREATE TABLE IF NOT EXISTS subscriptions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier       SMALLINT NOT NULL CHECK (tier IN (1, 2, 3)),
    paid_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    payment_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- Прогресс уроков
CREATE TABLE IF NOT EXISTS progress (
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_slug   TEXT NOT NULL,
    completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, lesson_slug)
);

-- Заметки к урокам
CREATE TABLE IF NOT EXISTS notes (
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_slug  TEXT NOT NULL,
    body         TEXT NOT NULL DEFAULT '',
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, lesson_slug)
);

-- Одноразовые коды привязки Telegram
CREATE TABLE IF NOT EXISTS telegram_links (
    code       TEXT PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tg_links_expires ON telegram_links(expires_at);

-- Привязанные Telegram-аккаунты
CREATE TABLE IF NOT EXISTS telegram_users (
    telegram_id  BIGINT PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name   TEXT NOT NULL DEFAULT '',
    coach_hour   SMALLINT NOT NULL DEFAULT 10 CHECK (coach_hour BETWEEN 0 AND 23),
    last_nudge   DATE,
    linked_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tg_users_user ON telegram_users(user_id);

-- Лимит ИИ (генератор идей + мастер промптов)
CREATE TABLE IF NOT EXISTS ai_usage (
    telegram_id  BIGINT NOT NULL REFERENCES telegram_users(telegram_id) ON DELETE CASCADE,
    day          DATE NOT NULL,
    count        SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (telegram_id, day)
);

-- Платежи
CREATE TABLE IF NOT EXISTS payments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    yookassa_id  TEXT UNIQUE,
    tier         SMALLINT NOT NULL,
    amount       INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);