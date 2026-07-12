# EIE Modification Plan for ProposalCalculator.tsx

## Phase 2 Changes (Remove tagging from Phase 2)
- Remove `BASELINE_ID_METHODS` array (lines 92-98) from Phase 2 usage
- Remove `baselineIdMethod` from CalcInputs interface (line 222)
- Remove `baselineIdAddOn` calculation from Phase 2 pricing (line 294): `const baselineIdAddOn = inputs.assets * BASELINE_ID_METHODS[inputs.baselineIdMethod].perAsset;`
- Remove the "Baseline ID Method" dropdown from the Phase 2 form section (lines 843-846)
- Update Phase 2 proposal description from "Discovery, Verification & Capital Recovery" to "Physical Verification & Recovery Analysis"
- Update Phase 2 scope text to: "Physical asset verification, inventory validation, FAR reconciliation, existence/condition verification, recovery analysis, and executive reporting."

## Phase 3 Changes (Add deployment decisions, make Tech Advisory mandatory)

### New inputs to add to CalcInputs:
- `tagDeployment: "lai" | "client"` — Who performs barcode/tag deployment?
- `barcodeProcurement: "lai" | "client"` — Who purchases the barcodes?

### Move BASELINE_ID_METHODS to Phase 3 (only applies when tagDeployment === "lai")
- When `tagDeployment === "lai"`: include tagging labor (per-asset cost from BASELINE_ID_METHODS) + travel for tagging
- When `tagDeployment === "client"`: tagging labor = 0, travel for tagging = 0

### Barcode Procurement:
- When `barcodeProcurement === "lai"`: include barcode procurement cost (new cost item, e.g., $1.50-$5 per asset depending on type)
- When `barcodeProcurement === "client"`: procurement cost = 0

### Technology Advisory:
- Currently `TECH_ENABLEMENT` is a selectable add-on in Phase 3
- Change: Technology Advisory is now MANDATORY when Phase 3 is selected
- Remove the "Advisory Only" option as the minimum — it's always included
- The `techEnablement` dropdown stays but represents the LEVEL of tech enablement (all include advisory)
- Default to at least "Advisory Only" ($3,500) when Phase 3 is included

### Phase 3 Calculation Update:
```
phase3Price = baseEffort + assetComponent + locationComponent + deptComponent
  * governanceMod * controlledRiskModifier
  + techAddOn (mandatory, minimum Advisory Only)
  + trainingAddOn
  + taggingLabor (if LAI deploys: assets * BASELINE_ID_METHODS[method].perAsset)
  + barcodeProcurement (if LAI purchases: assets * barcode unit cost)
  + travelAllocation (if LAI deploys: include tagging travel; if client: exclude)
```

### Form UI Changes:
- Phase 2 section: Remove "Baseline ID Method" dropdown
- Phase 3 section: Add "Tag Deployment" dropdown (LAI / Client)
- Phase 3 section: Add "Barcode Procurement" dropdown (LAI / Client)  
- Phase 3 section: Add "Tag Type" dropdown (only visible when tagDeployment === "lai") — reuse BASELINE_ID_METHODS
- Phase 3 section: Keep "Technology Enablement" but label as mandatory

### Proposal Output Changes:
- Phase 2 description: "Physical Verification & Recovery Analysis" — remove any tagging mention
- Phase 3 description: Update to reflect technology implementation + optional deployment
- Add line items for tag deployment and barcode procurement when applicable

## Barcode Procurement Cost Table (new):
- QR Labels: $1.50/asset
- Barcode Labels: $2.00/asset  
- RFID Tags: $5.00/asset
- Temporary Labels: $0.75/asset
