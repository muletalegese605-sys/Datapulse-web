#!/bin/bash
COLLECTIONS=(
  "ai_operator_trai"
  "ai_operator_training"
  "cleaned_business"
  "fully_automated"
  "launch_readiness"
  "security_activity"
  "stakeholder_finance"
)
for col in "${COLLECTIONS[@]}"; do
  echo "🔥 Haqaa jira: $col"
  firebase firestore:delete "$col" --recursive --force
  echo "✅ $col haqameera"
done
echo "🎉 Hojii xumurame!"
