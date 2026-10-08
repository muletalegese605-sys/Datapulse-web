#!/bin/bash
COLLECTIONS=(
  "admins"
  "ai_operator_training"
  "business_records"
  "cleaned_business"
  "fully_automated"
  "launch_readiness"
  "security_activity"
  "stakeholder_finance"
  "subscriptions"
)
for col in "${COLLECTIONS[@]}"; do
  echo "🔥 Haqaa jira: $col"
  firebase firestore:delete "$col" --recursive --force
  echo "✅ $col haqameera"
done
echo "🎉 Hojii xumurame!"
