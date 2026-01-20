# 🛍️ MaBoutique - Site E-commerce Moderne

Un site e-commerce complet et professionnel avec gestion de produits, système de paiement, authentification utilisateur et interface administrateur.

## 🎯 Fonctionnalités Principales

### ✅ Fonctionnalités Implémentées

#### 🏠 **Frontend Client**
- ✅ **Page d'accueil moderne** avec carrousel de produits vedettes
- ✅ **Catalogue de produits** avec système de filtrage avancé
  - Filtrage par catégorie
  - Tri par prix, nom, note
  - Recherche textuelle
  - Filtrage par plage de prix
- ✅ **Pages de détails produit** avec images multiples et zoom
- ✅ **Système de catégories** organisé et navigable
- ✅ **Navigation responsive** compatible mobile/tablette/desktop

#### 🔐 **Authentification & Comptes**
- ✅ **Création de compte** avec formulaire complet
  - Nom, email, mot de passe
  - Adresse de livraison complète
  - Téléphone
- ✅ **Connexion sécurisée** avec gestion de session
- ✅ **Page de profil utilisateur** avec :
  - Informations personnelles
  - Historique des commandes
  - Statut des commandes en temps réel

#### 🛒 **Panier & Commandes**
- ✅ **Panier d'achat intelligent** avec :
  - Ajout/retrait de produits
  - Modification des quantités
  - Calcul automatique des totaux
  - Persistance locale (localStorage)
- ✅ **Liste de favoris (Wishlist)**
  - Ajout/retrait rapide
  - Accès depuis n'importe quelle page

#### 💳 **Processus de Paiement**
- ✅ **Page de checkout complète** avec :
  - Formulaire d'adresse de livraison
  - Récapitulatif de commande détaillé
  - Calcul de livraison (gratuite > 50€)
- ✅ **Méthodes de paiement** :
  - 💳 **Carte bancaire** (Visa, Mastercard, Amex)
    - Validation du numéro de carte
    - Date d'expiration
    - Code CVV
  - 🅿️ **PayPal** avec redirection simulée
- ✅ **Page de confirmation** avec numéro de commande

#### 🔧 **Interface Administrateur**
- ✅ **Dashboard d'administration complet**
- ✅ **Gestion des produits** :
  - Ajouter de nouveaux produits
  - Modifier les produits existants
  - Supprimer des produits
  - Gérer le stock
  - Définir les produits vedettes
- ✅ **Gestion des commandes** :
  - Voir toutes les commandes
  - Mettre à jour les statuts (en attente, traitement, expédié, livré)
  - Détails complets de chaque commande
- ✅ **Visualisation des catégories**

#### 🎨 **Design & UX**
- ✅ Design moderne et professionnel
- ✅ Animations subtiles et fluides
- ✅ Responsive design (mobile-first)
- ✅ Palette de couleurs cohérente
- ✅ Typographie lisible (Google Fonts - Inter)
- ✅ Icônes et emojis pour une meilleure UX
- ✅ Messages d'alerte contextuels
- ✅ États vides avec appels à l'action

## 📁 Structure du Projet

```
/
├── index.html              # Page d'accueil avec carrousel
├── products.html           # Catalogue avec filtres
├── product.html            # Détails d'un produit
├── cart.html              # Panier d'achat
├── wishlist.html          # Liste de favoris
├── checkout.html          # Page de paiement
├── order-success.html     # Confirmation de commande
├── login.html             # Connexion
├── register.html          # Inscription
├── profile.html           # Profil utilisateur
├── admin.html             # Interface administrateur
├── css/
│   └── style.css          # Styles complets (21KB)
├── js/
│   └── app.js             # Logique JavaScript (19KB)
└── README.md              # Documentation
```

## 🗄️ Modèle de Données

### Tables Implémentées

#### **1. products** (Produits)
- `id` : Identifiant unique
- `name` : Nom du produit
- `description` : Description détaillée
- `price` : Prix en euros
- `category` : ID de la catégorie
- `image` : URL de l'image principale
- `images` : Array d'images supplémentaires
- `stock` : Quantité disponible
- `featured` : Produit vedette (boolean)
- `rating` : Note moyenne (0-5)
- `reviews_count` : Nombre d'avis

#### **2. categories** (Catégories)
- `id` : Identifiant unique
- `name` : Nom de la catégorie
- `description` : Description
- `icon` : Emoji/icône
- `image` : URL de l'image

#### **3. users** (Utilisateurs)
- `id` : Identifiant unique
- `email` : Email (unique)
- `password` : Mot de passe hashé
- `name` : Nom complet
- `phone` : Téléphone
- `address` : Adresse complète
- `city` : Ville
- `postal_code` : Code postal
- `country` : Pays
- `is_admin` : Administrateur (boolean)

#### **4. orders** (Commandes)
- `id` : Identifiant unique
- `user_id` : ID de l'utilisateur
- `items` : Articles (JSON array)
- `total` : Montant total
- `status` : Statut (pending, processing, shipped, delivered, cancelled)
- `payment_method` : Méthode de paiement (card, paypal)
- `shipping_address` : Adresse de livraison (JSON)
- `order_date` : Date de la commande

#### **5. wishlist** (Favoris)
- `id` : Identifiant unique
- `user_id` : ID de l'utilisateur
- `product_id` : ID du produit

## 🌐 Points d'Entrée & Navigation

### Pages Publiques
- **`/index.html`** - Page d'accueil
  - Carrousel de promotions
  - Catégories principales
  - Produits vedettes
  - Avantages (livraison, paiement, etc.)

- **`/products.html`** - Catalogue de produits
  - Paramètres : `?category=cat-1`, `?search=keyword`
  - Filtres multiples disponibles

- **`/product.html?id={id}`** - Détails d'un produit
  - Images multiples
  - Informations complètes
  - Ajout au panier/favoris

- **`/cart.html`** - Panier d'achat
  - Liste des articles
  - Modification des quantités
  - Calcul des totaux

- **`/wishlist.html`** - Liste de favoris

### Pages d'Authentification
- **`/login.html`** - Connexion
- **`/register.html`** - Création de compte
- **`/profile.html`** - Profil utilisateur (nécessite connexion)

### Processus de Commande
- **`/checkout.html`** - Paiement et livraison
- **`/order-success.html?orderId={id}`** - Confirmation

### Administration
- **`/admin.html`** - Dashboard administrateur (nécessite admin)
  - Gestion des produits
  - Gestion des commandes
  - Visualisation des catégories

## 🔑 Compte de Test

### Administrateur
- **Email** : `admin@boutique.com`
- **Mot de passe** : `admin123`
- **Accès** : Interface administrateur complète

### Créer un nouveau compte
Utilisez la page `/register.html` pour créer un compte utilisateur standard.

## 💾 Stockage des Données

### API RESTful Intégrée
Le site utilise l'API REST fournie par la plateforme :

```javascript
// Exemples d'utilisation
// Récupérer tous les produits
GET /tables/products?limit=100

// Récupérer un produit spécifique
GET /tables/products/{id}

// Créer un produit
POST /tables/products
Body: { name, price, description, ... }

// Modifier un produit
PUT /tables/products/{id}
Body: { name, price, ... }

// Supprimer un produit
DELETE /tables/products/{id}
```

### Stockage Local (localStorage)
- **Panier** : Persisté localement pour maintenir la session
- **Favoris** : Sauvegardé dans le navigateur
- **Session utilisateur** : Token de connexion

## 🎨 Caractéristiques Techniques

### Technologies Utilisées
- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables CSS
- **JavaScript ES6+** - Logique client
- **Fetch API** - Communication avec le backend
- **LocalStorage** - Persistance côté client
- **Google Fonts** - Typographie (Inter)

### Responsive Design
- **Desktop** : Layout optimisé grand écran
- **Tablette** : Adaptation automatique
- **Mobile** : Navigation simplifiée, menu hamburger

### Performance
- Chargement optimisé des images
- Animations CSS3 hardware-accelerated
- Code JavaScript modulaire et réutilisable

## 🚀 Prochaines Étapes Recommandées

### Fonctionnalités à Ajouter
1. **Système d'avis produits**
   - Permettre aux clients de laisser des avis
   - Afficher les commentaires sur les pages produits

2. **Notifications par email**
   - Confirmation de commande
   - Mises à jour de statut
   - Newsletters

3. **Gestion avancée du stock**
   - Alertes de stock bas
   - Réapprovisionnement automatique

4. **Programme de fidélité**
   - Points de récompense
   - Codes promo et réductions

5. **Comparateur de produits**
   - Comparer plusieurs produits côte à côte

6. **Historique de navigation**
   - Produits récemment consultés
   - Recommandations personnalisées

7. **Chat en direct**
   - Support client en temps réel

8. **Export des données**
   - Rapports de ventes
   - Statistiques détaillées

### Améliorations Techniques
1. **Optimisation des images**
   - Lazy loading
   - Format WebP
   - Compression automatique

2. **PWA (Progressive Web App)**
   - Installation sur mobile
   - Mode hors ligne

3. **Tests automatisés**
   - Tests unitaires
   - Tests d'intégration

4. **Sécurité renforcée**
   - Authentification à deux facteurs
   - Hashage bcrypt pour les mots de passe

## 📝 Notes Importantes

### Sécurité
⚠️ **Important** : Le système actuel utilise un hashage Base64 simple pour les mots de passe. En production, utilisez bcrypt ou un algorithme de hashage sécurisé.

### Paiement
ℹ️ Le système de paiement est actuellement simulé. Pour une utilisation en production, intégrez :
- **Stripe** pour les cartes bancaires
- **PayPal SDK** pour les paiements PayPal
- **Autres processeurs** selon vos besoins

### Données de Démonstration
Le site inclut :
- 6 catégories pré-configurées
- 12 produits de démonstration
- 1 compte administrateur

## 📞 Support & Contact

Pour toute question ou assistance :
- 📧 Email : contact@boutique.com
- 📞 Téléphone : +33 1 23 45 67 89

## 📄 Licence

Ce projet est créé pour usage privé. Tous droits réservés.

---

**Développé avec ❤️ pour MaBoutique**

*Site E-commerce moderne, performant et sécurisé*
