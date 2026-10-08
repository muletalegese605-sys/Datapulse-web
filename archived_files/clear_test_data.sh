#!/bin/bash
# Collections test/audit haquuf
COLLECTIONS=(
  "ai_button_audit"
  "ai_operator_training"
  "cleaned_business"
  "fully_automated"
  "launch_readiness"
  "security_activity"
  "stakeholder_finance"
  "stock_health_audit"
  "uat_feedback"
  "summary"
  "system_settings"
  "capabilities"
  "categories"
  "features"
  "plans"
)

for col in "${COLLECTIONS[@]}"; do
  echo "🔥 Haqaa jira: $col"
  firebase firestore:delete "$col" --recursive --force
  echo "✅ $col haqameera"
done
echo "🎉 Hojii xumurame!"
