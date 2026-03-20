# Finance Tracker development task runner

# === Development ===

# Start all services in watch mode
dev:
    mprocs

# === Start ===

# Start services: `just start docker`, `just start dev`
[group('start')]
start target:
    just _start-{{target}}

[private]
_start-docker:
    cd server && docker compose up -d

[private]
_start-dev:
    cd server && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# === Database ===

# Database commands: `just db reset`
[group('database')]
db command:
    just _db-{{command}}

[private]
_db-reset:
    cd server && docker compose exec postgres psql -U myuser -d mydatabase -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
