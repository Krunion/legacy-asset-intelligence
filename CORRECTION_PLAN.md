# LAI Website Correction Implementation Plan

## Source Document
- `/home/ubuntu/upload/pasted_content.txt` — Full 951-line implementation brief from July 19, 2026 audit

## Route Inventory
| Route | Component | Status |
|-------|-----------|--------|
| / | Home.tsx | Needs P0 corrections |
| /about | About.tsx | Needs verification |
| /services | Services.tsx | Needs methodology alignment |
| /industries | Industries.tsx | Needs outcome claim removal |
| /team | Team.tsx | Needs credential verification |
| /insights | Insights.tsx | Needs article corrections |
| /insights/:slug | InsightArticle.tsx | Multiple articles need fixes |
| /resources | Resources.tsx | Broken downloads - P0 |
| /faq | FAQ.tsx | Needs methodology alignment |
| /careers | Career.tsx | Needs benefit verification |
| /employee-portal | EmployeePortal.tsx | Portal review needed |
| /contact | Contact.tsx | Form accessibility |
| /calculator | Calculator.tsx | P0 - Hide or rebuild |

## P0 Priority Actions (Must Fix First)
1. **Calculator**: Hide from public nav OR rebuild with proper methodology
2. **Fabricated research**: Remove "500 org survey", "$264B market", unverifiable citations
3. **Case studies**: Relabel as "Illustrative Financial Scenarios" 
4. **Phase methodology**: Make consistent across all routes (use Section 3 of brief)
5. **SDVOSB**: Change to "certification application pending" language
6. **Guarantees**: Remove "ensures", "guarantees", "audit-proof", "100% audit readiness"
7. **Resources**: Fix broken download buttons
8. **Disclosures**: Add privacy/financial-estimate notices

## Approved Phase Names (from brief Section 3)
| Phase | Name | Purpose |
|-------|------|---------|
| 1 | Discovery & Executive Assessment | Scope, records, operations, risk areas, initial assessment |
| 2 | Physical Verification & Recovery Analysis / Accountability | Compare physical/records, exceptions, discrepancies |
| 3 | Technology Enablement & Governance Implementation | Technology, controls, data standards, workflows |
| 4 | Recurring Governance & Executive Advisory | Recurring reviews, reporting, advisory, monitoring |

## Phase 4 Tiers
| Tier | Description |
|------|-------------|
| Bronze | Annual governance review and executive reporting |
| Silver | Semiannual governance assessments, advisory support, compliance/KPI review |
| Gold | Quarterly governance assessments, consulting, operational reviews, dashboard optimization |
| Platinum | Enterprise governance partnership with recurring validation, strategy, advisory, technology optimization |

## Key Definitions (from brief Section 8)
- **Ghost asset**: Record that cannot be physically verified or relates to disposed/lost/destroyed asset
- **Zombie asset**: Physically present but missing from, incorrectly classified in, or misrepresented in records
- **Cash recovery**: Realized refunds, credits, rebates, sale proceeds
- **Recurring savings**: Reduction in expense that would otherwise continue
- **Cost avoidance**: Future cost reasonably expected and prevented
- **Accounting correction**: Correction of record, NOT automatically cash
- **Record exposure**: Value associated with records requiring validation, NOT predicted loss/recovery

## SDVOSB Approved Language
> SDVOSB certification application pending. LAI does not represent itself as SBA-certified or eligible for SDVOSB set-aside benefits unless and until certification is approved.

## Professional Scope Disclaimer
> LAI provides asset-verification, data-reconciliation, technology-enablement, governance, and advisory services within the agreed engagement scope. Unless expressly stated in a written agreement and provided by appropriately qualified professionals, LAI does not provide legal advice, tax advice, accounting opinions, appraisals, valuations, insurance advice, engineering certifications, or independent audit or attestation services.

## Calculator Disclaimer
> This tool provides a directional planning estimate based on the information and assumptions shown. It is not a quote, valuation, appraisal, tax opinion, accounting conclusion, audit result, or guarantee of recovery or savings.

## Case Study Disclaimer
> Illustrative scenario—not a client result. This example shows how a hypothetical organization might evaluate asset-record exceptions and potential opportunities. Values are assumptions for discussion only.

## Claims to Remove (Section 6.2)
- 15-30% ghost-asset rate (unless properly sourced with limitations)
- 40%+ ghost assets for never-inventoried orgs
- $2.4M average annual waste
- 35% recoverable savings
- 18-month accuracy half-life
- 3x-10x ROI / 5:1-15:1 ROI
- 60-90 day payback
- 2-5% of asset value annual savings
- $3-8M healthcare results
- 40% fewer Joint Commission findings
- 60% less audit preparation
- 40% lower implementation costs
- 60% faster time to value
- 3x higher adoption
- 15-25% cost reduction per maturity level
- 50-65% cumulative cost reduction

## Compliance Language Fixes (Section 9)
Replace: satisfies, ensures, guarantees, fully compliant, audit-proof, 100% audit readiness, zero findings, meets all requirements, eliminates risk, permanently prevents
With: supports, helps prepare, designed to assist, may improve, subject to professional review
