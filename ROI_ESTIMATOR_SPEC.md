# ROI Estimator Rebuild Specification

## Key Principles
- Ghost asset gross value = exposure only, NOT cash recovery
- Do not treat gross asset value, replacement value, book value, or unrecorded asset value as realized financial benefit
- Do not count the same benefit in more than one category

## 6 Result Categories (separate)
1. **Asset-Record Exposure** — estimated value of records requiring validation. NOT cash recovery. NOT included in ROI.
2. **Potential One-Time Financial Recovery** — net cash proceeds/refunds: surplus asset sale, property-tax refunds, contract corrections
3. **Potential Annual Recurring Savings** — maintenance contracts terminated, insurance premium reductions, prospective property-tax reductions, duplicate-purchase avoidance
4. **Engagement Investment** — displayed as range with Low/Mid/High selector (default midpoint)
5. **Net ROI** — calculated per formulas below
6. **Payback Period** — calculated per formulas below

## Required Financial Formulas

### First-Year Financial Benefit
= Potential One-Time Financial Recovery + First-Year Recurring Savings

### First-Year Net ROI (%)
= ((First-Year Financial Benefit − Total First-Year Investment) ÷ Total First-Year Investment) × 100

### Five-Year Financial Benefit
= Potential One-Time Financial Recovery + (Annual Recurring Savings × 5)

### Five-Year Total Cost
= Initial Engagement Investment + Technology Costs + Client Implementation Costs + Five Years of Applicable Recurring Governance Costs

### Five-Year Net ROI (%)
= ((Five-Year Financial Benefit − Five-Year Total Cost) ÷ Five-Year Total Cost) × 100

### Benefit-Cost Ratio
= Financial Benefit ÷ Total Investment (display as "3.2×", NOT labeled as ROI)

### Payback Period in Months
= Total Initial Investment ÷ Expected Monthly Cash Benefit
- If one-time recovery included, incorporate timing into cumulative cash flow
- If total expected benefit is zero: "Not Achievable Based on Current Inputs"
- NEVER display 12-month payback when calculated benefit is $0

## Investment Range (Section D)
- Display: Projected investment range, exact estimated investment used, explanation that modeled amount is midpoint unless user selects otherwise
- Selector: Low estimate / Midpoint estimate (default) / High estimate

## 9 Required Result Cards (Section E)
1. Estimated Asset-Record Exposure
2. Potential One-Time Financial Recovery
3. Potential Annual Recurring Savings
4. First-Year Financial Benefit
5. Modeled Engagement Investment
6. First-Year Net ROI
7. Five-Year Net ROI
8. Benefit-Cost Ratio
9. Estimated Payback Period

Each card must have expandable "How This Was Calculated" details.

## Confidence Labels (Section F)
- **Low Confidence** — primarily benchmark-based
- **Moderate Confidence** — combination of client inputs and benchmarks
- **Higher Confidence** — supported by recent client financial data

Show for every estimated rate: rate used, input/benchmark applied, source/assumption, user-provided vs estimated, confidence level.

## Input Validation (Section G)
- Asset count > 0 (blocks calc if zero)
- Facilities >= 1
- Financial inputs cannot be negative
- Display reasonable maximum-value warnings
- Require users to confirm: replacement value or net book value?
- Prevent numeric formatting from appending digits
- Recalculate on any input change
- Preserve inputs between Step 1 and Step 2
- "Start Over" button that resets every field
- If zero assets: no ROI, no exposure, no engagement recommendations — show validation message

## Property Tax Questions (Section H)
- Is org subject to tangible personal property tax?
- Is org government, nonprofit, tax-exempt, or partially exempt?
- Does user know approximate effective property-tax rate?
- Is a recent property-tax filing available?
- If rate unknown: label as "broad preliminary scenario"
- Government/nonprofit/education may have exemptions — don't apply universal assumption

## Disclaimer Text (Section I)
"This estimator provides a preliminary planning scenario based on user-provided information and disclosed assumptions. Asset-record exposure does not represent cash recovery. Potential financial benefits are not verified until supporting records, physical assets, contracts, tax treatment, insurance coverage, and procurement activity are evaluated. Results are not a quote, appraisal, audit opinion, tax opinion, financial guarantee, or assurance of recovery."

## Lead Capture Language (Section J)
"Enter your business email to request a personalized executive briefing explaining the assumptions, methodology, and recommended next steps associated with this preliminary estimate."
Add Privacy Policy link beside submission button.

## Test Cases (Section K)

### Test 1 — All-Zero Case
Assets: 0, Financial inputs: $0
Expected: Calculation blocked, No ROI displayed, No payback displayed, Validation message shown

### Test 2 — No Financial Benefit
Assets > 0, One-time recovery: $0, Annual savings: $0, Investment > 0
Expected: First-year ROI: −100%, Five-year ROI: −100%, Payback: "Not Achievable Based on Current Inputs"

### Test 3 — Recurring Savings Only
Investment: $100,000, One-time recovery: $0, Annual savings: $25,000
Expected: First-year net ROI: −75%, Five-year benefit: $125,000, Five-year net ROI: 25%, Payback: 48 months, Year 1 BCR: 0.25×, Five-year BCR: 1.25×

### Test 4 — One-Time and Recurring Benefits
Investment: $100,000, One-time recovery: $150,000, Annual recurring savings: $50,000
Expected: First-year benefit: $200,000, First-year net ROI: 100%, Five-year benefit: $400,000, Five-year net ROI: 300%, Year 1 BCR: 2.0×

### Test 5 — No Double Counting
Ghost-asset record value: $1M, generates $10K property-tax reduction
Expected: $1M appears ONLY as Asset-Record Exposure, $10K appears as annual potential savings, $1M NOT added to ROI, $10K counted only once
