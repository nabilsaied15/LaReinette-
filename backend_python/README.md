# Backend Python - Generation DOCX

## 1) Installation

```bash
cd backend_python
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

## 2) Lancement

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API disponible sur `http://127.0.0.1:8000`.

## 3) Endpoint utilise par le front

- `POST /generate-docx` : recoit les donnees d'inscription et retourne un fichier `.docx`.
- `GET /health` : test rapide.

## 4) Configuration front (optionnel)

Par defaut, le front appelle `http://127.0.0.1:8000`.

Pour changer l'URL, ajouter dans `.env` (racine frontend):

```env
VITE_DOCX_API_URL=http://127.0.0.1:8000
```
