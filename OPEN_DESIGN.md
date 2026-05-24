# Open Design local

Open Design a ete installe localement dans ce workspace pour travailler avec Codex, mais il n'est pas embarque dans ce depot DiagAutoSN.

Raison: le dossier extrait pese plusieurs Go avec `node_modules`, `.pnpm-store`, caches Electron/Next et chemins Windows trop longs. Le pousser dans ce repo rendrait le depot lourd, fragile et parfois impossible a cloner.

Pour le recuperer localement:

```powershell
git clone https://github.com/nexu-io/open-design.git open-design
```

Le produit DiagAutoSN versionne dans ce repo se trouve dans `src/`, avec ses routes API, son cockpit garage, le portail client, et la base SQLite locale regeneree au demarrage.
