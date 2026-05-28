# DiagAutoSN Product Masterplan

## Positionnement

DiagAutoSN n'est pas seulement une vitrine ni un dashboard garage. Le produit doit devenir une plateforme automobile multi-espaces qui relie :

- les visiteurs publics qui decouvrent les services du garage ;
- les clients du garage qui creent un compte personnel ;
- les proprietaires de vehicules qui renseignent, suivent et personnalisent leur carnet ;
- le garage et son equipe atelier ;
- l'administration interne de la plateforme ;
- les capteurs IoT installes dans les voitures ;
- les operations commerciales, finance, documents et support.

Objectif produit : permettre a un garage de gerer ses clients, vehicules, diagnostics, interventions, documents, devis, paiements et alertes, pendant que chaque client suit son vehicule en temps reel depuis son propre compte.

## Parties Prenantes Completes

### 1. Visiteur public

Profil : personne qui ne possede pas encore de compte et veut comprendre pourquoi venir chez DiagAutoSN.

Besoins :

- voir clairement les services proposes ;
- comprendre les benefices des capteurs IoT ;
- voir les offres garage, diagnostic, entretien, assurance, visite technique ;
- demander un rendez-vous ou un diagnostic ;
- verifier la credibilite du garage ;
- comprendre les prix ou au moins les fourchettes ;
- voir les garanties, zones couvertes, contacts et horaires.

Espace requis : page publique structurante avec services, preuves, parcours, FAQ, prise de rendez-vous et CTA.

### 2. Client du garage avec compte personnel

Profil : client ayant un ou plusieurs vehicules suivis par DiagAutoSN.

Besoins :

- creer un compte ;
- ajouter ou completer les details de ses voitures ;
- modifier photos, plaque, VIN, kilometrage, assurance, visite technique, prochaine vidange ;
- suivre les infos du vehicule en temps reel ;
- comprendre les alertes capteur sans jargon ;
- valider ou refuser un devis ;
- payer une facture ;
- telecharger documents et rapports ;
- demander un rappel atelier ;
- personnaliser ses preferences de notification.

Espace requis : portail client complet avec profil, vehicules, carnet, documents, devis, paiements, alertes, IoT et preferences.

### 3. Proprietaire flotte ou famille multi-vehicules

Profil : client avec plusieurs vehicules, chauffeur ou responsable flotte.

Besoins :

- vue globale de tous les vehicules ;
- classement par urgence ;
- echeances assurance, visite technique, vidange ;
- historique par vehicule ;
- export PDF/CSV ;
- roles secondaires : conducteur, gestionnaire, payeur.

Espace requis : mode flotte dans le portail client.

### 4. Reception garage

Profil : personne qui accueille le client et cree le dossier.

Besoins :

- creer un client ;
- verifier si le client existe deja ;
- creer ou selectionner un vehicule ;
- scanner/entrer plaque, VIN, kilometrage, documents ;
- ouvrir un ordre de reception ;
- prendre photos et observations ;
- assigner un type de service ;
- declencher notification client.

Espace requis : module reception avec workflow guide.

### 5. Chef atelier

Profil : responsable de la charge atelier, priorites et qualite.

Besoins :

- voir les ordres ouverts ;
- prioriser les urgences ;
- assigner mecaniciens et baies ;
- suivre temps, statut, blocages ;
- valider diagnostics ;
- controler devis et qualite ;
- communiquer au client.

Espace requis : cockpit atelier operationnel.

### 6. Mecanicien

Profil : technicien qui execute diagnostic et intervention.

Besoins :

- voir ses taches ;
- acceder aux infos vehicule ;
- saisir observations, photos, codes DTC, pieces ;
- changer statut intervention ;
- remonter une alerte ;
- demander validation chef atelier.

Espace requis : vue mecanicien mobile-first, simple et rapide.

### 7. Admin plateforme / CMS

Profil : administrateur DiagAutoSN qui gere la plateforme, les contenus et les parametrages.

Besoins :

- gerer pages publiques, services, prix, FAQ, textes, images ;
- gerer utilisateurs, roles, garages, clients ;
- gerer categories de services ;
- gerer templates notifications SMS/WhatsApp/email ;
- gerer regles d'alertes IoT ;
- gerer documents types ;
- consulter logs, evenements, erreurs ;
- superviser la qualite des donnees.

Espace requis : back-office CMS/admin separe du cockpit garage.

### 8. Finance / caisse

Profil : personne qui suit devis, factures, encaissements.

Besoins :

- generer devis ;
- suivre validation client ;
- transformer devis en facture ;
- encaisser Wave, Orange Money, cash, carte ;
- produire recus ;
- suivre paiements partiels ;
- exporter comptabilite.

Espace requis : module finance robuste.

### 9. Support client

Profil : charge de relation client.

Besoins :

- voir tickets, demandes de rappel, plaintes ;
- voir historique client ;
- repondre via WhatsApp/SMS/email ;
- escalader au chef atelier ;
- tenir un SLA.

Espace requis : inbox support et timeline client.

### 10. Capteur IoT / device

Profil : boitier installe sur vehicule.

Besoins systeme :

- authentification device ;
- signature payload ;
- derniere synchronisation ;
- statut connecte/deconnecte ;
- ingestion idempotente ;
- regles d'alerte ;
- historique telemetrie ;
- detection doublons ou valeurs aberrantes.

Espace requis : module device registry et ingestion telemetry.

## Espaces Produit A Construire

### A. Site public

Pages :

- accueil ;
- services ;
- diagnostic intelligent ;
- capteur IoT ;
- entretien et vidange ;
- assurance et visite technique ;
- tarifs ou demandes de devis ;
- prise de rendez-vous ;
- FAQ ;
- contact.

Critere qualite : le visiteur doit comprendre en moins de 20 secondes ce qu'il gagne en venant chez DiagAutoSN.

### B. Compte client

Modules :

- profil ;
- mes vehicules ;
- ajouter/modifier un vehicule ;
- carnet entretien ;
- alertes ;
- donnees IoT ;
- documents ;
- devis ;
- factures ;
- rendez-vous ;
- preferences notifications.

Critere qualite : le client doit savoir quoi faire aujourd'hui pour son vehicule.

### C. Cockpit garage

Modules :

- clients ;
- vehicules ;
- reception ;
- ordres de reparation ;
- diagnostics ;
- planning atelier ;
- equipe ;
- alertes ;
- documents ;
- devis/factures ;
- paiements ;
- notifications.

Critere qualite : le garage doit pouvoir travailler toute la journee sans sortir de la plateforme.

### D. Admin CMS

Modules :

- gestion contenu public ;
- gestion services ;
- gestion medias ;
- utilisateurs et roles ;
- parametrage alertes ;
- templates notifications ;
- parametrage paiements ;
- logs et observabilite ;
- exports.

Critere qualite : l'equipe DiagAutoSN doit pouvoir modifier la plateforme sans developpeur pour les contenus et parametres courants.

## Objets Metier Minimum

- User
- Role
- Garage
- Client
- Vehicle
- VehicleProfile
- IoTDevice
- TelemetrySignal
- AlertRule
- Alert
- Appointment
- Reception
- WorkOrder
- Inspection
- Diagnostic
- DTCCode
- Estimate
- EstimateItem
- Invoice
- Payment
- Document
- Notification
- SupportTicket
- AuditEvent
- CMSPage
- ServiceCatalogItem
- MediaAsset

## Permissions

### Public

- lire contenu public ;
- demander rendez-vous ;
- envoyer formulaire contact.

### Client

- lire ses vehicules ;
- modifier details autorises ;
- ajouter documents ;
- consulter alertes ;
- demander rappel ;
- valider devis ;
- initier paiement ;
- configurer notifications.

### Reception

- creer client/vehicule ;
- ouvrir reception ;
- joindre documents ;
- programmer rendez-vous.

### Mecanicien

- lire ordres assignes ;
- saisir diagnostic ;
- joindre photos ;
- changer statut technique.

### Chef atelier

- assigner equipe ;
- valider diagnostic ;
- valider devis technique ;
- gerer priorites.

### Finance

- gerer devis/factures/paiements ;
- exporter.

### Admin

- gerer utilisateurs, contenus, services, roles, regles, logs.

## Corrections Necessaires Par Rapport A L'Etat Actuel

1. Separer clairement `/` public, `/login`, `/carnet`, `/atelier`, `/admin`.
2. Remplacer `clientId` en query param par une session auth.
3. Ajouter un vrai modele `User` et `Role`.
4. Ajouter un espace client de personnalisation vehicule.
5. Ajouter un CMS admin pour contenus publics et catalogues de services.
6. Ajouter un module rendez-vous public et client.
7. Ajouter une vue visiteur convaincante avec services, preuves et CTA.
8. Transformer les alertes en decisions metier lisibles.
9. Rendre assurance, visite technique et vidange actionnables.
10. Ajouter un audit log pour toutes les actions sensibles.
11. Ajouter validation API stricte.
12. Ajouter authentification et signature device IoT.

## Roadmap Chef De Projet

### Phase 1 - Fondations Produit

- schema utilisateurs/roles ;
- separation routes public/client/garage/admin ;
- auth minimale ;
- suppression des mentions de simulation ;
- layout app unifie ;
- audit log.

### Phase 2 - Espace Public

- page publique claire ;
- services ;
- capteur IoT ;
- prise de rendez-vous ;
- FAQ ;
- SEO local.

### Phase 3 - Espace Client

- profil client ;
- gestion vehicules ;
- documents ;
- alertes intelligentes ;
- preferences ;
- devis/paiements securises.

### Phase 4 - Cockpit Garage

- reception ;
- ordres de reparation ;
- assignation equipe ;
- diagnostic ;
- planning ;
- finance.

### Phase 5 - Admin CMS

- pages CMS ;
- services ;
- medias ;
- notifications ;
- regles alertes ;
- supervision.

### Phase 6 - IoT Production

- registry devices ;
- tokens devices ;
- ingestion securisee ;
- historique telemetry ;
- moteur de regles ;
- notifications automatiques.

## Definition Du Produit Reussi

DiagAutoSN sera reussi quand :

- un visiteur comprend l'offre sans compte ;
- un client peut creer son compte et suivre son vehicule sans appeler le garage ;
- le garage peut gerer toute son operation quotidienne dans l'app ;
- un admin peut piloter contenus et parametres ;
- les capteurs IoT creent des alertes utiles, securisees et comprehensibles ;
- chaque action importante laisse une trace ;
- le design donne une impression de produit premium, pas de maquette.
