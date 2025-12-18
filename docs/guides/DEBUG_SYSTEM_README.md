# 🔧 Système de Débogage Réutilisable

## 📋 Vue d'ensemble

Un système de logging a été intégré dans `plan-parking-advanced.html` pour faciliter le débogage de nouveaux éléments ajoutés au plan interactif.

## 🎯 Utilisation

### Activation/Désactivation

Dans `plan-parking-advanced.html`, recherchez `DEBUG_CONFIG` :

```javascript
const DEBUG_CONFIG = {
  enabled: false,  // ← Mettre à true pour activer
  serverEndpoint: 'http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',
  sessionId: 'debug-session',
};
```

### Fonction de Logging

Utilisez la fonction `debugLog()` pour logger des événements :

```javascript
debugLog(location, message, data, hypothesisId, runId)
```

**Paramètres :**
- `location` (string) : Emplacement du code, ex: `'plan-parking-advanced.html:123'`
- `message` (string) : Description de l'événement
- `data` (object) : Données à logger (optionnel, défaut: `{}`)
- `hypothesisId` (string) : ID de l'hypothèse testée (optionnel)
- `runId` (string) : ID de la session de test (optionnel, défaut: `'run1'`)

## 📝 Exemples d'Utilisation

### Exemple 1 : Logger l'ajout d'un nouvel élément

```javascript
function addNewElement(config) {
  // Log avant traitement
  debugLog(
    'plan-parking-advanced.html:XXX',
    'addNewElement - Entry',
    { type: config.type, x: config.x, z: config.z }
  );
  
  // ... code de traitement ...
  
  // Log après traitement
  debugLog(
    'plan-parking-advanced.html:XXX',
    'addNewElement - Created',
    { elementId: el.id, finalX: el.dataset.x, finalZ: el.dataset.z }
  );
}
```

### Exemple 2 : Logger une conversion de coordonnées

```javascript
function convertCoordinates(viewportX, viewportY) {
  const canvasX = (viewportX - panX) / zoom;
  const canvasY = (viewportY - panY) / zoom;
  
  debugLog(
    'plan-parking-advanced.html:XXX',
    'convertCoordinates - Viewport to Canvas',
    {
      viewportX,
      viewportY,
      canvasX,
      canvasY,
      zoom,
      panX,
      panY
    },
    'B' // Hypothesis ID
  );
  
  return { canvasX, canvasY };
}
```

### Exemple 3 : Logger un événement utilisateur

```javascript
element.addEventListener('click', (e) => {
  debugLog(
    'plan-parking-advanced.html:XXX',
    'element - Click',
    {
      elementType: element.dataset.type,
      position: [element.dataset.x, element.dataset.z],
      clientX: e.clientX,
      clientY: e.clientY
    }
  );
});
```

## 🔍 Analyse des Logs

Les logs sont écrits dans :
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/.cursor/debug.log
```

Format NDJSON (une ligne JSON par événement).

### Rechercher dans les logs

```bash
# Chercher tous les logs d'un élément spécifique
grep "addNewElement" .cursor/debug.log

# Chercher les logs d'une hypothèse
grep '"hypothesisId":"B"' .cursor/debug.log

# Chercher les logs d'une session
grep '"runId":"run1"' .cursor/debug.log
```

## 🎯 Bonnes Pratiques

1. **Activer uniquement quand nécessaire** : Mettre `enabled: false` en production
2. **Logs ciblés** : Logger uniquement les points critiques (entrées/sorties, conversions, erreurs)
3. **Données pertinentes** : Inclure les valeurs importantes (coordonnées, états, paramètres)
4. **Hypothèses claires** : Utiliser des IDs d'hypothèses cohérents (A, B, C, etc.)
5. **Nettoyer après débogage** : Retirer les logs une fois le problème résolu

## 🐛 Workflow de Débogage

1. **Activer le système** : `DEBUG_CONFIG.enabled = true`
2. **Ajouter des logs** aux points critiques du nouveau code
3. **Reproduire le problème** avec les logs actifs
4. **Analyser les logs** dans `.cursor/debug.log`
5. **Corriger le problème** basé sur les données
6. **Vérifier la correction** avec les logs
7. **Désactiver** : `DEBUG_CONFIG.enabled = false`
8. **Nettoyer** : Retirer les appels `debugLog()` si nécessaire

## 📊 Structure des Logs

Chaque log contient :
```json
{
  "location": "plan-parking-advanced.html:123",
  "message": "Description de l'événement",
  "data": {
    "key1": "value1",
    "key2": 42
  },
  "timestamp": 1765534365907,
  "sessionId": "debug-session",
  "runId": "run1",
  "hypothesisId": "A"  // Optionnel
}
```

## ✅ Checklist pour Nouveaux Éléments

Quand vous ajoutez un nouvel élément interactif :

- [ ] Logger l'ajout de l'élément (position, type, dimensions)
- [ ] Logger les conversions de coordonnées (viewport ↔ canvas ↔ 3D)
- [ ] Logger les événements utilisateur (click, drag, rotate)
- [ ] Logger les erreurs potentielles (conflits, validations)
- [ ] Tester avec les logs activés
- [ ] Désactiver les logs après validation

---

**Note** : Ce système a été utilisé avec succès pour corriger le problème de déplacement des éléments avec zoom/pan. Il est maintenant disponible pour tous les futurs développements.











