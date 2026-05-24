# Donnees locales

Ce dossier est reserve a la base SQLite locale generee par l'application.

Les fichiers `*.sqlite`, `*.sqlite-wal` et `*.sqlite-shm` ne sont pas versionnes parce qu'ils changent a l'execution et peuvent contenir des donnees de test ou de clients.

Au lancement, l'application recree la base locale depuis `src/lib/db/diagauto.ts`.
