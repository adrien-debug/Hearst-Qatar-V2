#!/bin/bash

echo "🔍 Diagnostic Voice Input Cursor"
echo "=================================="
echo ""

# Vérifier si le microphone est détecté
echo "1. Vérification du microphone système..."
if system_profiler SPAudioDataType | grep -q "Microphone"; then
    echo "   ✅ Microphone détecté"
    system_profiler SPAudioDataType | grep -A 3 "Microphone"
else
    echo "   ❌ Aucun microphone détecté"
fi

echo ""
echo "2. Vérification des permissions microphone..."
echo "   Pour vérifier les permissions de Cursor :"
echo "   - Ouvrez Réglages Système (System Settings)"
echo "   - Allez dans Confidentialité et Sécurité (Privacy & Security)"
echo "   - Cliquez sur Microphone"
echo "   - Vérifiez que Cursor est dans la liste et activé"
echo ""

# Vérifier si Cursor est installé
echo "3. Vérification de l'installation Cursor..."
if [ -d "/Applications/Cursor.app" ]; then
    echo "   ✅ Cursor trouvé dans /Applications"
else
    echo "   ⚠️  Cursor non trouvé dans /Applications"
    echo "   Cherchez Cursor dans votre dossier Applications"
fi

echo ""
echo "4. Instructions pour réparer :"
echo "   a) Ouvrez Réglages Système > Confidentialité et Sécurité > Microphone"
echo "   b) Assurez-vous que Cursor est activé"
echo "   c) Si Cursor n'apparaît pas, lancez Cursor une fois puis revenez aux réglages"
echo "   d) Redémarrez Cursor après avoir activé la permission"
echo ""

echo "5. Test du microphone..."
echo "   Testez votre microphone avec une autre application (ex: Notes > Dictée)"
echo "   Si ça ne marche pas ailleurs, le problème vient du microphone système"
echo ""



