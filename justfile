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
