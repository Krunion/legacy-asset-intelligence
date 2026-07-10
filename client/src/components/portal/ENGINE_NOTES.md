# Financial Recovery & Proposal ROI Engine - Architecture Notes

## Current State (ProposalCalculator.tsx)
- Lines 178-209: CalcInputs interface (manual `recoverableOpportunityLow/High`)
- Lines 211-314: calculateProposal() - pricing engine (keep as-is)
- Lines 532-543: Printable ROI section (currently uses manual low/high)
- Lines 825-838: Manual ROI input section (REPLACE with modeled engine)
- Lines 840-850: Live Preview (ADD modeled ROI outputs here)

## Plan: Replace Manual ROI with Modeled Engine
1. Add new fields to CalcInputs: `useEstimatedMode: boolean` (default true)
2. When estimated mode: auto-calculate ROI from existing inputs (industry, assets, locations, record quality, last inventory, complexity)
3. Map ProposalCalculator inputs → laiEstimationModels inputs:
   - industry index → industry key (INDUSTRIES[idx].label → match to INDUSTRY_BENCHMARKS key)
   - recordQuality index → assetManagementSystem (Poor→spreadsheets, Fair→basic_system, Good→erp_module, Excellent→dedicated_eam)
   - lastInventory index → lastPhysicalInventoryDate (0→within_12m, 1→1_3_years, 2→3_5_years, 3→5_plus_years, 4→never)
4. When verified mode (Phase 2): allow manual override of each category with verified field data
5. Show clear "ESTIMATED" vs "VERIFIED" badge on results and printable proposal

## Mapping Tables
INDUSTRIES index → INDUSTRY_BENCHMARKS key:
- 0: Healthcare → healthcare
- 1: Physician Group → healthcare
- 2: Senior Care → healthcare
- 3: Manufacturing → manufacturing
- 4: Distribution → distribution
- 5: Logistics → logistics
- 6: Government → government
- 7: Education → education
- 8: Hospitality → other
- 9: Professional Services → other
- 10: Technology → other
- 11: Retail → other
- 12: Construction → construction
- 13: Utilities → utilities
- 14: Aviation → logistics
- 15: Financial Services → other
- 16: Nonprofit → education
- 17: Real Estate → realestate
- 18: Food Service → other
- 19: Other → other

RECORD_QUALITY index → assetManagementSystem key:
- 0 (Excellent) → dedicated_eam
- 1 (Good) → erp_module
- 2 (Fair) → basic_system
- 3 (Poor) → spreadsheets
- 4 (Critical) → none

LAST_INVENTORY index → lastPhysicalInventoryDate key:
- 0 (Within 12 Months) → within_12m
- 1 (1-3 Years) → 1_3_years
- 2 (3-5 Years) → 3_5_years
- 3 (More Than 5 Years) → 5_plus_years
- 4 (Never) → never

## Output Shape for Proposal
- estimatedGhostAssets / estimatedGhostAssetValue
- estimatedUnrecordedAssets / estimatedUnrecordedValue
- recoverableCapital
- maintenanceWaste (annual)
- insuranceOptimization (annual)
- propertyTaxReduction (annual)
- procurementWaste (annual)
- totalFinancialOpportunity
- netROI (%)
- paybackPeriodMonths
- fiveYearBenefit
- dataMode: "estimated" | "verified"
