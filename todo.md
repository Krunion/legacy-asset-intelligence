# Legacy Asset Intelligence - Project TODO

## HubSpot Integration
- [x] Add HUBSPOT_API_KEY to environment variables
- [x] Create HubSpot helper module (`server/_core/hubspot.ts`)
- [x] Validate HubSpot API key with test
- [x] Add leads router with submitLead procedure
- [x] Wire HubSpot submission to ROI Calculator component
- [ ] Test lead submission end-to-end
- [ ] Add success/error notifications to UI

## Homepage & Layout
- [ ] Resolve Home.tsx conflict (template vs existing business plan)
- [ ] Review and finalize homepage design
- [ ] Test responsive layout on mobile

## Case Studies & ROI Calculator
- [ ] Verify CaseStudies component integration
- [ ] Test ROI Calculator calculations
- [ ] Verify PDF generation with lead data

## Database & Backend
- [ ] Run `pnpm db:push` to sync schema
- [ ] Create leads table to store submissions (optional)
- [ ] Add logging for HubSpot submissions

## Testing & QA
- [ ] Test form validation
- [ ] Test error handling for invalid emails
- [ ] Verify HubSpot contact creation in CRM
- [ ] Test PDF download flow

## Deployment
- [ ] Create checkpoint before publishing
- [ ] Publish to production
