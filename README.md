# DiagAutoSN

Plateforme web Next.js pour la gestion d'un garage automobile, avec cockpit atelier, portail client, alertes vehicule, diagnostics, capteurs IoT simules et stockage local SQLite.

## Ce qui est versionne

- `src/` : application Next.js, composants, routes API et logique SQLite.
- `package.json` et `package-lock.json` : dependances reproductibles.
- `data/README.md` : dossier reserve a la base locale.
- `OPEN_DESIGN.md` : notes pour relancer Open Design localement.

## Ce qui n'est pas versionne

Ces dossiers/fichiers sont regeneres localement et ne doivent pas etre pousses :

- `node_modules/`
- `.next/`
- `data/*.sqlite`
- logs `*.log`, `*.err`
- captures `*.png`
- `.playwright-mcp/`
- `.claude/`
- `open-design/`, `open-design-main/`, `open-design-main.zip`

## Prerequis

Node.js 24 ou plus recent est recommande, car l'application utilise `node:sqlite`.

```powershell
node --version
npm --version
```

## Installation

```powershell
git clone https://github.com/diagautosn221/diagautoo.git
cd diagautoo
npm install
```

## Lancer en local

```powershell
npm run dev
```

Puis ouvrir :

- `http://127.0.0.1:3000` : cockpit principal
- `http://127.0.0.1:3000/atelier` : vue atelier
- `http://127.0.0.1:3000/carnet?clientId=c-001` : portail client

## Base SQLite locale

La base est creee automatiquement dans `data/diagauto.sqlite` au premier appel serveur. Elle est seedee depuis :

```text
src/lib/db/diagauto.ts
```

Pour repartir sur une base propre, arreter le serveur puis supprimer les fichiers locaux :

```powershell
Remove-Item data\diagauto.sqlite* -Force
```

Relancer ensuite :

```powershell
npm run dev
```

## Verification avant push

```powershell
npm run typecheck
npm run build
git status
```

## Workflow Git

```powershell
git pull
# modifier le code
npm run typecheck
git add .
git commit -m "Votre message"
git push
```

Ne pas forcer le push sans coordination avec les autres personnes qui travaillent sur le projet.

## Open Design

Open Design est un outil externe utilise localement pendant le travail de design. Il n'est pas embarque dans ce depot pour eviter de pousser plusieurs Go de dependances.

Voir `OPEN_DESIGN.md`.
