<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **adin dgap** (3827 symbols, 9591 relationships, 296 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/adin dgap/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/adin dgap/context` | Codebase overview, check index freshness |
| `gitnexus://repo/adin dgap/clusters` | All functional areas |
| `gitnexus://repo/adin dgap/processes` | All execution flows |
| `gitnexus://repo/adin dgap/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Codex users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.Codex/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.Codex/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.Codex/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.Codex/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.Codex/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.Codex/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
utilise tout les skills necesaires de Codex pour menr a bien la mission 
si tu le fais pas bien en tant que expert je vais le donner a codex 
# AGENTS.md — Instructions Codex · admin ta-quota

> **Lire ce fichier en entier au démarrage de chaque session.**
> Règle absolue : **toujours lire le SKILL.md avant de commencer une tâche couverte par un skill.**
> Ne jamais improviser quand un skill existe — il contient les pratiques validées.

---

## SOMMAIRE RAPIDE

| Besoin | Section |
|--------|---------|
| Fichier Word / PDF / Excel / PowerPoint | [§1 Documents](#1-documents--fichiers) |
| Interface web, composant React, design | [§2 Design & Frontend](#2-design--frontend) |
| Planifier une feature, écrire un PRD | [§3 Planning & Architecture](#3-planning--architecture) |
| Coder, tester, déboguer, refactorer | [§4 Engineering & Code Quality](#4-engineering--code-quality) |
| Sécurité git, hooks, dépendances | [§5 Tooling & Sécurité](#5-tooling--sécurité) |
| Agents, automatisation, orchestration | [§6 Agents & Automatisation](#6-agents--automatisation) |
| Rédaction, docs, API, contenu | [§7 Writing & Knowledge](#7-writing--knowledge) |
| Branding, thèmes, art génératif | [§8 Visuel & Branding](#8-visuel--branding) |
| Créer / améliorer un skill | [§9 Meta-Skills](#9-meta-skills) |
| Auto-amélioration continue (self-evolution) | [§10 Self-Evolution System](#10-self-evolution-system) |
| Analyser l'impact du code (GitNexus) | [§11 GitNexus — Intelligence Code](#11-gitnexus--intelligence-code) |

---

## 1. Documents & Fichiers

### Fichiers uploadés (lecture)
**Déclencheur :** un bloc `<uploaded_files>` est présent dans le contexte.
→ Toujours commencer par `file-reading` avant d'ouvrir quoi que ce soit.

```
SKILL : /mnt/skills/public/file-reading/SKILL.md
```

| Extension | Premier geste | Skill dédié |
|-----------|--------------|-------------|
| `.pdf` | `pdfinfo` + peek | pdf-reading |
| `.docx` | `extract-text` | docx |
| `.xlsx / .xlsm` | `extract-text` | xlsx |
| `.pptx` | `extract-text` | pptx |
| `.csv` | `pandas nrows=5` | — |
| `.json` | `jq type` | — |
| Image | déjà dans le contexte (vision) | — |
| Archive | `unzip -l` / `tar -tf`, jamais extraire | — |

### Lire un PDF en profondeur
**Déclencheur :** extraire tableaux, figures, formulaires, PDF scanné, stratégie de lecture.
```
SKILL : /mnt/skills/public/pdf-reading/SKILL.md
```

### Créer / éditer un Word (.docx)
**Déclencheur :** "rapport Word", "mémo", "lettre", "contrat", ".docx", changements suivis.
```
SKILL : /mnt/skills/public/docx/SKILL.md
```

### Créer / manipuler un PDF
**Déclencheur :** fusionner, watermark, signer, remplir formulaire, créer depuis zéro.
```
SKILL : /mnt/skills/public/pdf/SKILL.md
```

### Créer / éditer un Excel (.xlsx)
**Déclencheur :** "tableau Excel", formules, pivot, graphique, nettoyage de données.
```
SKILL : /mnt/skills/public/xlsx/SKILL.md
```

### Créer / éditer une présentation (.pptx)
**Déclencheur :** "deck", "slides", "présentation", "PowerPoint".
```
SKILL : /mnt/skills/public/pptx/SKILL.md
```

### Co-rédaction de documentation
**Déclencheur :** rédiger des docs techniques, specs, proposals, decision docs en collaboration.
```
SKILL : /mnt/skills/examples/doc-coauthoring/SKILL.md
```

### Communications internes
**Déclencheur :** rapports de statut, updates leadership, newsletters, incident reports, FAQs projet.
```
SKILL : /mnt/skills/examples/internal-comms/SKILL.md
```

---

## 2. Design & Frontend

### Interfaces web modernes (React, HTML, dashboards)
**Déclencheur :** composant React, page web, landing page, dashboard, formulaire UI.
```
SKILL : /mnt/skills/public/frontend-design/SKILL.md
```
> ⚠️ Lire ce skill avant d'écrire la moindre ligne de CSS ou JSX.

### Web Artifacts Builder (multi-composants complexes)
**Déclencheur :** artifact HTML/React complexe avec state management, routing, shadcn/ui.
```
SKILL : /mnt/skills/examples/web-artifacts-builder/SKILL.md
```

### Thèmes & palettes de couleurs
**Déclencheur :** "génère un thème", "palette de couleurs", "applique un style à cet artifact".
10 thèmes pré-définis + génération à la demande.
```
SKILL : /mnt/skills/examples/theme-factory/SKILL.md
```

### Brand Guidelines
**Déclencheur :** "applique les couleurs de la marque", "respecte la charte graphique", tout nouveau composant dans un projet brandé.
```
SKILL : /mnt/skills/examples/brand-guidelines/SKILL.md
```

### Canvas Design (posters, visuels statiques)
**Déclencheur :** "crée un poster", "visuel pour les réseaux", "design statique", sortie `.png` ou `.pdf`.
```
SKILL : /mnt/skills/examples/canvas-design/SKILL.md
```

### Art algorithmique / génératif
**Déclencheur :** "art génératif", "p5.js", "flow field", "particle system", "art avec du code".
```
SKILL : /mnt/skills/examples/algorithmic-art/SKILL.md
```

### GIFs animés pour Slack
**Déclencheur :** "crée un GIF pour Slack", animation optimisée Slack.
```
SKILL : /mnt/skills/examples/slack-gif-creator/SKILL.md
```

---

## 3. Planning & Architecture

> Ces skills préviennent 80% des retours arrière. Les utiliser **avant** d'écrire du code.

### Grill Me — Clarification avant toute feature
**Déclencheur :** nouvelle feature, refactor risqué, migration. Codex pose des questions jusqu'à épuiser tous les cas.
```
npx skills@latest add mattpocock/skills/grill-me
```

### Write a PRD
**Déclencheur :** "rédige un PRD", "besoin d'une spec", "définis les exigences de cette feature".
Interview interactif → exploration codebase → PRD → GitHub issue.
```
npx skills@latest add mattpocock/skills/write-a-prd
```

### PRD to Plan
**Déclencheur :** PRD existant → plan d'implémentation multi-phases par vertical slices.
```
npx skills@latest add mattpocock/skills/prd-to-plan
```

### PRD to Issues
**Déclencheur :** PRD existant → GitHub issues indépendants avec relations de blocage.
```
npx skills@latest add mattpocock/skills/prd-to-issues
```

### Design an Interface
**Déclencheur :** "propose plusieurs designs pour ce module" → 3 à 5 designs radicalement différents en parallèle.
```
npx skills@latest add mattpocock/skills/design-an-interface
```

### Request Refactor Plan
**Déclencheur :** "planifie ce refactor" → plan détaillé en petits commits → GitHub issue.
```
npx skills@latest add mattpocock/skills/request-refactor-plan
```

### Ubiquitous Language (DDD)
**Déclencheur :** "définis notre vocabulaire", termes métier ambigus dans l'équipe. Glossaire de domaine extrait de la conversation.
```
npx skills@latest add mattpocock/skills/ubiquitous-language
```

### Spec-Driven Development
**Déclencheur :** développement piloté par une spec avant l'implémentation (projet n8n).
```
Skill local : n8n-conventions / spec-driven-development
```

---

## 4. Engineering & Code Quality

### TDD — Test Driven Development
**Déclencheur :** implémenter une feature ou corriger un bug → boucle rouge-vert-refactor stricte.
```
npx skills@latest add mattpocock/skills/tdd
```

### Triage Issue — Débogage structuré
**Déclencheur :** "je ne sais pas pourquoi c'est cassé" → exploration codebase + root cause + plan de fix TDD.
```
npx skills@latest add mattpocock/skills/triage-issue
```

### QA — Assurance qualité
**Déclencheur :** avant chaque PR → passe QA complète, issues avec relations de blocage.
```
npx skills@latest add mattpocock/skills/qa
```

### Systematic Debugging
**Déclencheur :** bug dont la cause n'est pas évidente. Interdit le "juste essayer des changements".
Flux : reproduire → test minimal → isoler la cause → correction unique → vérifier.
```
github.com/obra/superpowers/tree/main/skills/systematic-debugging
```

### Simplify — Nettoyage post-implémentation
**Déclencheur :** après avoir implémenté, "nettoie ce code", fonctions trop longues, logique imbriquée.
```
Skill local : simplify
```

### Improve Codebase Architecture
**Déclencheur :** "améliore l'architecture", hotspots, modules peu profonds, testabilité faible.
```
npx skills@latest add mattpocock/skills/improve-codebase-architecture
```

### Code Review
**Déclencheur :** "review ce PR", vérification sécurité / perf / error handling / architecture.
```
github.com/anthropics/skills  (Code Review)
```

### Auto-Commit Messages
**Déclencheur :** après un `git add`, générer un message de commit Conventional Commits.
```
Skill local : anthropic-skills:auto-commit
```

### Feature Development
**Déclencheur :** développement d'une nouvelle feature de A à Z (workflow complet).
```
Skill local : feature-development
```

### Database Migration
**Déclencheur :** migration de schéma DB, gestion de versions, rollback.
```
Skill local : database-migration
```

### Backend Engineering
**Déclencheur :** API REST/gRPC, PostgreSQL, Redis, Kafka, observabilité, services backend.
```
Skill local : backend-engineering
```

### Memory Vault — Mémoire IA locale
**Déclencheur :** stocker / retrouver du contexte projet, hybrid search, knowledge graph local.
```
Skill local : memory-vault
```

### Public APIs Orchestration
**Déclencheur :** intégrer ou orchestrer des APIs externes (1000+ APIs disponibles).
```
Skill local : public-apis
```

### Codex API / Agent SDK
**Déclencheur :** construire une app avec l'Anthropic SDK, Agent SDK, appels API Codex.
```
Skill local : Codex-api
```

### Product Self-Knowledge (Anthropic)
**Déclencheur :** question sur les modèles Codex, pricing, limites de tokens, SDK.
```
SKILL : /mnt/skills/public/product-self-knowledge/SKILL.md
```

---

## 5. Tooling & Sécurité

### Git Guardrails — Protection des repos
**Déclencheur :** **installer sur CHAQUE repo de production.** Bloque `push --force`, `reset --hard`, `clean` avant exécution.
```
npx skills@latest add mattpocock/skills/git-guardrails-Codex
```

### Setup Pre-Commit
**Déclencheur :** nouveau repo → Husky + lint-staged + Prettier + typecheck + tests.
```
npx skills@latest add mattpocock/skills/setup-pre-commit
```

### Update Config
**Déclencheur :** modifier `settings.json`, hooks Codex, permissions.
```
Skill local : update-config
```

### Loop — Tâches récurrentes
**Déclencheur :** `/loop 5m /check`, polling, tâche à exécuter périodiquement dans la session.
```
Skill local : loop
```

### Schedule — Agents planifiés (cron)
**Déclencheur :** tâche à planifier, agent distant récurrent.
```
Skill local : schedule  |  anthropic-skills:schedule
```

### Everything Codex (Conventions ECC)
**Déclencheur :** configurer Codex correctement, hooks, rules, conventions du projet.
```
Skill local : everything-Codex
```

### Add Language Rules
**Déclencheur :** ajouter des règles de langage / linting au projet.
```
Skill local : add-language-rules
```

---

## 6. Agents & Automatisation

### Codex Autorunner (CAR)
**Déclencheur :** orchestration multi-agents par tickets, meta-harness complexe.
```
Skill local : codex-autorunner
```

### OpenClaude — Compatibilité multi-agents
**Déclencheur :** faire collaborer Codex avec des agents OpenAI / Codex.
```
Skill local : openclaude
```

### n8n — Automatisation 400+ intégrations
**Déclencheur :** workflow n8n, LangChain, CI/CD, intégrations no-code/low-code.
```
Skill local : n8n
Skills n8n : content-design, create-issue, create-pr, create-skill,
             loom-transcript, n8n-conventions, node-add-oauth,
             reproduce-bug, spec-driven-development
```

### Chief of Staff
**Déclencheur :** Google Workspace, productivité, sessions QMD, agenda, orchestration bureautique.
```
Skill local : chief-of-staff
```

### UI-TARS — Agent GUI multimodal
**Déclencheur :** automatisation bureau ou navigateur, interaction avec une interface graphique.
```
Skill local : ui-tars
```

### Pixel Agents — Visualisation multi-agents
**Déclencheur :** visualiser l'activité de plusieurs agents simultanément en pixel art.
```
Skill local : pixel-agents
```

### Design Orchestrator
**Déclencheur :** orchestrer les tâches de design dans le flux DGAP, coordonner avec Slack et les systèmes de gestion de projet. L’agent lit les entrées de tâches design (payload.kind = 'design_task' ou 'ui_design') et effectue un travail minimalement représentatif, puis marque la tâche comme terminée et émet un événement interne.
```
Skill local : designAgent
```

- Comportement: lionne coordination entre les tâches de design et les canaux externes (Slack) lorsque configuré.
- Sorties: journalisation dans agent logs; optionnel notification Slack via un webhook configuré (SLACK_WEBHOOK_URL).
- Conséquences: ne déclenche pas de modifications humaines sans dépêches; éviter les effets de bord sur le graph d’actions.

### MCP Builder
**Déclencheur :** construire un serveur MCP (Model Context Protocol), intégrer une API externe via MCP.
```
SKILL : /mnt/skills/examples/mcp-builder/SKILL.md
```

### Top 50 AI Tools
**Déclencheur :** choisir un outil IA, comparer des solutions, découvrir l'écosystème IA.
```
Skill local : top-50-ai-tools
```

---

## 7. Writing & Knowledge

### Edit Article
**Déclencheur :** "améliore cet article" → restructuration des arguments, coupe du remplissage, clarté.
```
npx skills@latest add mattpocock/skills/edit-article
```

### API Documentation Generator
**Déclencheur :** "génère la doc de mon API" → OpenAPI/Swagger avec exemples, codes d'erreur, auth.
```
github.com/ComposioHQ/awesome-Codex-skills/api-docs-generator
```

### Create PR / Create Issue / Create Skill
**Déclencheur :** créer une PR GitHub, ouvrir une issue, scaffolder un nouveau skill.
```
Skills locaux : create-pr  |  create-issue  |  create-skill
```

### Loom Transcript
**Déclencheur :** traiter / résumer un transcript Loom.
```
Skill local : loom-transcript
```

---

## 8. Visuel & Branding

> Voir aussi [§2 Design & Frontend](#2-design--frontend) pour les skills UI.

| Besoin | Skill | Chemin |
|--------|-------|--------|
| Palette + thème complet | theme-factory | `/mnt/skills/examples/theme-factory/SKILL.md` |
| Charte graphique sur composants | brand-guidelines | `/mnt/skills/examples/brand-guidelines/SKILL.md` |
| Poster / visuel statique PNG/PDF | canvas-design | `/mnt/skills/examples/canvas-design/SKILL.md` |
| Art génératif p5.js | algorithmic-art | `/mnt/skills/examples/algorithmic-art/SKILL.md` |
| GIF animé Slack | slack-gif-creator | `/mnt/skills/examples/slack-gif-creator/SKILL.md` |

---

## 9. Meta-Skills

### Skill Creator
**Déclencheur :** créer un nouveau skill, benchmarker un skill, itérer sur un SKILL.md existant.
```
SKILL : /mnt/skills/examples/skill-creator/SKILL.md
```
Workflow : décrire le workflow → proposer un SKILL.md → 3-5 tests → analyser les échecs → affiner.

### Write a Skill (structure)
**Déclencheur :** après Skill Creator, structurer proprement le SKILL.md (progressive disclosure, bundled resources).
```
npx skills@latest add mattpocock/skills/write-a-skill
```

### Find Skills
**Déclencheur :** avant de créer un skill, chercher s'il existe déjà sur SkillsMP ou GitHub.
```
Marketplace : skillsmp.com
```

### Keybindings Help
**Déclencheur :** "quels sont les raccourcis ?", aide sur les keybindings Codex.
```
Skill local : keybindings-help
```

---

## 10. Self-Evolution System

Ce système apprend et s'améliore au fil des sessions. Activer les composants selon le contexte.

```
SKILL : /mnt/skills/user/self-evolution-skills-ecosysteme-complet/SKILL.md
```

| Composant | Rôle | Quand l'activer |
|-----------|------|----------------|
| `context-priming` | Restaure le contexte projet | **Début de chaque session** |
| `pattern-capture` | Codifie les patterns réutilisables | Après toute tâche non triviale |
| `skill-gap-detector` | Détecte les gaps de compétence | Tâche répétitive ou difficile |
| `self-correction-loop` | Apprend des corrections | Dès qu'une erreur est corrigée |
| `session-debrief` | Bilan de fin de session | "C'est bon pour aujourd'hui" |
| `skill-registry` | Index central des skills | Création / recherche de skills |
| `meta-learner` | Analyse macro des tendances | 3+ corrections similaires |
| `proactive-suggestion` | Anticipe les prochaines étapes | Après chaque tâche complétée |

**Démarrage minimal recommandé :**
1. `context-priming` — bénéfice immédiat, zéro friction
2. `session-debrief` — active tout l'écosystème
3. `skill-registry` — la fondation mémorielle

---

## 11. GitNexus — Intelligence Code

> Index : **2043 symboles · 5135 relations · 157 flux d'exécution**
> Si l'index est périmé → `npx gitnexus analyze`

### Règles obligatoires

| Priorité | Règle |
|----------|-------|
| 🔴 MUST | `gitnexus_impact` avant toute modification de symbole |
| 🔴 MUST | `gitnexus_detect_changes()` avant chaque commit |
| 🟡 WARN | Risque HIGH/CRITICAL → stopper, signaler à l'utilisateur |
| 🔵 TIP | Explorer avec `gitnexus_query`, jamais avec grep |

### Interdits absolus

- ❌ Modifier un symbole sans `gitnexus_impact`
- ❌ Ignorer un warning HIGH/CRITICAL
- ❌ Renommer avec find-and-replace → utiliser `gitnexus_rename`
- ❌ Committer sans `gitnexus_detect_changes()`

### Outils

| Outil | Quand | Commande |
|-------|-------|---------|
| `query` | Chercher par concept | `gitnexus_query({query: "auth"})` |
| `context` | Vue 360° d'un symbole | `gitnexus_context({name: "fn"})` |
| `impact` | Blast radius avant édition | `gitnexus_impact({target: "fn", direction: "upstream"})` |
| `detect_changes` | Pré-commit | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Renommage sûr multi-fichiers | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Requêtes graph custom | `gitnexus_cypher({query: "MATCH ..."})` |

### Niveaux de risque

| Depth | Sens | Action |
|-------|------|--------|
| `d=1` | WILL BREAK — callers directs | Mettre à jour obligatoirement |
| `d=2` | LIKELY AFFECTED | Tester |
| `d=3` | MAY NEED TESTING | Tester si chemin critique |

### Workflows GitNexus

**Exploration :**
```
gitnexus_query({query: "<concept>"})
gitnexus_context({name: "<symbole>"})
READ gitnexus://repo/admin ta-quota/process/{name}
```

**Avant modification :**
```
gitnexus_impact({target: "<fn>", direction: "upstream"})
→ Si HIGH/CRITICAL : signaler à l'utilisateur
→ Modifier → mettre à jour tous les d=1
gitnexus_detect_changes({scope: "staged"})
```

**Refactoring :**
```
Renommage :
  gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})
  → vérifier → dry_run: false

Extraction :
  gitnexus_context + gitnexus_impact → modifier → detect_changes({scope: "all"})
```

### Ressources GitNexus

| Ressource | Usage |
|-----------|-------|
| `gitnexus://repo/admin ta-quota/context` | Vue d'ensemble, fraîcheur index |
| `gitnexus://repo/admin ta-quota/clusters` | Zones fonctionnelles |
| `gitnexus://repo/admin ta-quota/processes` | Flux d'exécution |
| `gitnexus://repo/admin ta-quota/process/{name}` | Trace d'un flux |

**Maintenir l'index :**
```bash
npx gitnexus analyze                  # sans embeddings
npx gitnexus analyze --embeddings     # si stats.embeddings > 0 dans .gitnexus/meta.json
```

---

## CHECKLIST UNIVERSELLE — Avant de clore toute tâche

### Si la tâche touche au code
- [ ] `gitnexus_impact` lancé sur tous les symboles modifiés
- [ ] Aucun warning HIGH/CRITICAL ignoré
- [ ] `gitnexus_detect_changes()` confirme le scope attendu
- [ ] Tous les `d=1` (WILL BREAK) mis à jour

### Si la tâche produit un fichier
- [ ] Skill document approprié utilisé (docx / pdf / xlsx / pptx)
- [ ] Fichier déposé dans `/mnt/user-data/outputs/`

### Après toute tâche non triviale
- [ ] `pattern-capture` activé si nouveau pattern découvert
- [ ] `proactive-suggestion` : proposer la prochaine étape logique
- [ ] `session-debrief` si fin de session

---

## SKILLS LOCAUX — Référence rapide

Ces skills sont installés dans l'environnement Codex mais ne sont pas dans `/mnt/skills/`.
Les appeler par leur nom dans la session.

```
Core          : update-config, keybindings-help, simplify, loop, schedule, Codex-api
Engineering   : backend-engineering, memory-vault, public-apis, feature-development,
                database-migration, add-language-rules
Agents        : codex-autorunner, openclaude, n8n, chief-of-staff, pixel-agents, ui-tars
Ecosystem     : top-50-ai-tools, everything-Codex
n8n Content   : content-design, create-issue, create-pr, create-skill, loom-transcript,
                n8n-conventions, node-add-oauth, reproduce-bug, spec-driven-development
Anthropic     : anthropic-skills:pdf, anthropic-skills:docx, anthropic-skills:pptx,
                anthropic-skills:xlsx, anthropic-skills:skill-creator,
                anthropic-skills:consolidate-memory, anthropic-skills:schedule,
                anthropic-skills:setup-cowork
```
