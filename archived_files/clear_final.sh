#!/bin/bash
# Maqaa guutuu collection sirrii ta'e galchi
COLLECTION="ai_operator_training" 
echo "🔥 Haqaa jira: $COLLECTION"
firebase firestore:delete "$COLLECTION" --recursive --force
echo "✅ $COLLECTION haqameera"
