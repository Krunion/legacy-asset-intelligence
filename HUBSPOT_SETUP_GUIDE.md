# HubSpot Integration Guide for Legacy Asset Intelligence

## Overview
This guide walks you through setting up HubSpot to capture leads from your ROI calculator and manage follow-up communications.

---

## Step 1: Create Your HubSpot Account

1. **Go to [HubSpot.com](https://www.hubspot.com)**
2. **Click "Get Started Free"** (top right)
3. **Sign up with your email:** `hello@legacyassetintelligence.com`
4. **Complete the onboarding:**
   - Company name: "Legacy Asset Intelligence"
   - Industry: "Consulting"
   - Company size: "1-10 employees"
5. **Verify your email** and log in

---

## Step 2: Get Your API Key

1. **In HubSpot, click your profile icon** (top right)
2. **Select "Settings"**
3. **In the left sidebar, go to:** Account Setup → Integrations → Private apps
4. **Click "Create private app"**
5. **Fill in:**
   - App name: "LAI ROI Calculator"
   - Description: "Captures leads from ROI calculator"
6. **Under "Scopes," enable:**
   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
7. **Click "Create app"**
8. **Copy your "Private App Access Token"** (you'll need this)
9. **Save it somewhere safe** — this is your API key

---

## Step 3: Create a Contact Property for ROI Data

1. **In HubSpot, go to:** Settings → Data Management → Properties
2. **Click "Create property"**
3. **Create these properties:**

| Property Name | Type | Description |
|---|---|---|
| `estimated_recovery` | Number | Estimated recoverable capital |
| `industry` | Dropdown | Industry type |
| `asset_count` | Number | Total assets audited |
| `maturity_level` | Dropdown | Asset intelligence maturity |
| `calculator_date` | Date | When calculator was completed |

4. **For "industry" dropdown, add options:**
   - Healthcare
   - Manufacturing
   - Distribution
   - Utilities
   - Education
   - Construction
   - Logistics
   - Government
   - Other

5. **For "maturity_level" dropdown, add options:**
   - Level 1: No Formal Process
   - Level 2: Spreadsheet Management
   - Level 3: Basic Asset System
   - Level 4: Good Controls
   - Level 5: Best-in-Class

---

## Step 4: Create an Automated Workflow

1. **In HubSpot, go to:** Automation → Workflows
2. **Click "Create workflow"**
3. **Select "Contact-based"**
4. **Name it:** "ROI Calculator Lead Follow-up"
5. **Set trigger:** "Contact property changed" → `estimated_recovery` is known
6. **Add actions:**
   - **Send email:** Create a welcome email that:
     - Thanks them for using the calculator
     - Summarizes their estimated recovery
     - Offers a 15-minute discovery call
     - Includes your contact info
   - **Assign to:** Your team member (or yourself)
   - **Create task:** "Follow up with ROI calculator lead"

---

## Step 5: Connect to Your Website

### For Now (Manual):
When you receive an email from a prospect:
1. **Go to HubSpot Contacts**
2. **Click "Create contact"**
3. **Fill in:**
   - First name
   - Last name
   - Email
   - Company
   - Estimated recovery (from their PDF)
   - Industry
   - Asset count
   - Maturity level
   - Calculator date (today)

### For Later (Automated - Requires Backend):
Once you upgrade to a full-stack project, we can:
- Automatically send calculator data to HubSpot via API
- Trigger workflows instantly
- Track lead source and conversion

---

## Step 6: Set Up Email Notifications

1. **In HubSpot, go to:** Settings → Notifications
2. **Enable "New contact created"** notifications
3. **Add your personal email** to receive alerts when new leads come in

---

## Step 7: Create Your First Sales Email Template

1. **In HubSpot, go to:** Sales → Email templates
2. **Click "Create template"**
3. **Name it:** "ROI Calculator Follow-up"
4. **Use this template:**

```
Subject: Your LAI ROI Assessment Results

Hi {{contact.firstname}},

Thank you for using the Legacy Asset Intelligence ROI calculator. 

Based on your {{contact.industry}} organization with {{contact.asset_count}} assets, we estimate you could recover approximately ${{contact.estimated_recovery}}K in hidden capital.

This represents a significant opportunity to:
• Eliminate unnecessary maintenance contracts
• Recover tax overpayments
• Reduce insurance premiums
• Prevent duplicate purchases

Our typical engagement recovers 15-30% of fixed asset value, often with ROI multiples of 12-27x.

Would you be open to a brief 15-minute discovery call to discuss your specific situation? We can explore:
- Your current asset visibility challenges
- Realistic recovery potential for your organization
- Our engagement approach and timeline

Let me know your availability, and we'll get something on the calendar.

Best regards,
Kevin Runion
Legacy Asset Intelligence
hello@legacyassetintelligence.com
```

---

## Step 8: Track Your Leads

1. **In HubSpot, go to:** Contacts → All contacts
2. **You'll see all your ROI calculator leads**
3. **Filter by:** Industry, estimated recovery, date added
4. **Track:** Which leads converted to calls/proposals

---

## Metrics to Monitor

- **Lead source:** ROI Calculator
- **Conversion rate:** Leads → Discovery calls
- **Average recovery estimate:** By industry
- **Response time:** How quickly you follow up
- **Close rate:** Leads → Signed engagements

---

## Next Steps

1. **Set up your HubSpot account** using the steps above
2. **Provide Kevin with your API key** (if you want automated integration later)
3. **Start manually adding leads** as they come in from the calculator
4. **Track your conversion metrics** to refine your follow-up process
5. **Once you have 5-10 leads**, consider upgrading to automated API integration

---

## Support

- **HubSpot Help:** https://knowledge.hubspot.com
- **API Documentation:** https://developers.hubspot.com
- **Your API Key:** [Store securely - do not share]

---

**Questions?** Email hello@legacyassetintelligence.com
