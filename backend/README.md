# Backend

Backend Flask para a API institucional futura.

## Requisitos

- Python 3.14+
- `venv`

## Instalação

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

## Execução

```powershell
cd backend
.\.venv\Scripts\python.exe run.py
```

A API sobe localmente em `http://127.0.0.1:5000`.

## Healthchecks

- `GET /api/v1/health`
- `GET /api/v1/health/db`
- `GET /api/v1/auth/me`

## Testes

```powershell
cd backend
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

## Admin

Criar o primeiro administrador:

```powershell
cd backend
.\.venv\Scripts\python.exe -m flask --app run.py create-admin
```

## Configuração

- `DATABASE_URL`: usa SQLite local em `backend/instance/app.sqlite3` quando vazio.
- `DATABASE_URL=postgresql://...`: suportado para o ambiente futuro de produção via `psycopg`.
- `CORS_ORIGINS`: lista separada por vírgula com as origens permitidas para `/api/*`.
- `SECRET_KEY`: obrigatória em produção. Em desenvolvimento existe apenas fallback local inseguro.
- Cookies de sessão: `HttpOnly=True`, `SameSite=Lax` por padrão e `Secure=True` em produção.
