# SparqLabs — 20 Defined Outbound Campaigns

Twenty launch-ready campaign coordinates built from the Outbound Operating System,
deliberately cutting across **SaaS, fintech, cybersecurity, agencies, staffing,
ecommerce, manufacturing, logistics, health-tech, consulting, proptech,
construction, legal-tech, M&A advisory, HR-tech, energy, med-device, MSPs, and
hospitality-tech**, across **US / UK / DACH / ANZ / EU**.

Each card defines: **Coordinate (Industry · Location · ICP) → Trigger → List Logic
→ Pain Logic → Offer Logic → Personalization Logic → Copy Angle → Variables.**

**Merge-variable key** (Clay/EmailBison fields used throughout):
`{{first_name}} {{company}} {{industry}} {{trigger_detail}} {{role_count}}
{{tech_signal}} {{funding_stage}} {{similar_company}} {{proof_metric}}
{{competitor}} {{location_city}} {{niche}} {{tool_in_use}} {{recent_event}}`

---

## 1 — Post-raise SaaS pipeline (US)
- **Industry / Vertical:** B2B SaaS
- **Location:** United States
- **ICP / Persona:** VP / Head of Sales
- **Trigger (why now):** Raised Series A in last 12 mo **and** 2+ open AE roles
- **List Logic:** SaaS, 30–150 employees, $3–20M ARR, Series A < 18mo, uses
  Outreach/Salesloft, hiring AEs. *Disqualify:* <$2M ARR, services/agency, >500 HC. **Tier 2.**
- **Pain Logic:** *Surface* — ramp is slow, pipeline inconsistent. *Business* — burning
  runway on a function not yet producing pipeline. *Personal* — board expects the raise
  to become pipeline **this quarter**; VP's job rides on the number.
- **Offer Logic:** *Dream* — 30 qualified meetings/quarter. *Mechanism* — DFY outbound
  engine. *Guarantee* — pay-per-meeting after a paid pilot. *Packaging* — hybrid retainer + per-meeting.
- **Personalization Logic:** 1:few. Snippet by `{{funding_stage}}` + `{{role_count}}`.
- **Copy Angle:** Subj `2 AE roles` · Opener: "Saw {{company}} is hiring {{role_count}} AEs after the {{funding_stage}} — usually means pipeline must scale faster than ramp allows."
- **Variables:** `{{first_name}} {{company}} {{funding_stage}} {{role_count}} {{similar_company}} {{proof_metric}}`

## 2 — Seed dev-tools founder GTM (US)
- **Industry / Vertical:** Developer tools / DevOps SaaS
- **Location:** United States
- **ICP / Persona:** Founder / CEO
- **Trigger:** Raised seed in last 9 mo, still founder-led sales
- **List Logic:** Dev-tools/infra SaaS, 5–30 HC, seed-stage, GitHub/Product Hunt presence,
  no VP Sales yet. *Disqualify:* has full sales team. **Tier 1 (1:1).**
- **Pain Logic:** *Surface* — founder still doing all outbound. *Business* — growth capped
  by founder's calendar. *Personal* — needs traction to raise the A; can't be the bottleneck.
- **Offer Logic:** *Dream* — repeatable pipeline without hiring an SDR team. *Mechanism* —
  outsourced outbound engine. *Guarantee* — 4-week paid pilot, defined meeting target. *Packaging* — pilot → retainer.
- **Personalization Logic:** 1:1. Reference `{{recent_event}}` (launch/PH) + `{{tech_signal}}`.
- **Copy Angle:** Subj `founder-led outbound` · Opener: "Congrats on the {{recent_event}} — most seed dev-tools founders I speak to are still the entire sales team, which caps growth at their calendar."
- **Variables:** `{{first_name}} {{company}} {{recent_event}} {{tech_signal}} {{similar_company}}`

## 3 — B2B payments expansion (UK)
- **Industry / Vertical:** Fintech (B2B payments / embedded finance)
- **Location:** United Kingdom
- **ICP / Persona:** Head of Growth / Commercial Director
- **Trigger:** New market launch or FCA authorization announced
- **List Logic:** Fintech, 50–300 HC, B2B/embedded, FCA-regulated, recently expanded
  product/region. *Disqualify:* consumer-only neobanks. **Tier 2.** GDPR legitimate-interest basis.
- **Pain Logic:** *Surface* — new product/region, thin pipeline there. *Business* — high CAC,
  long enterprise cycles. *Personal* — Head of Growth must prove the new line lands fast.
- **Offer Logic:** *Dream* — qualified pipeline into the new segment in 90 days. *Mechanism* —
  targeted outbound to ICP accounts. *Guarantee* — performance floor. *Packaging* — retainer + bonus.
- **Personalization Logic:** 1:few by `{{recent_event}}` (launch/authorization).
- **Copy Angle:** Subj `{{company}} + {{recent_event}}` · Opener (UK tone, understated):
  "Noticed {{company}} recently {{trigger_detail}} — often the new line needs pipeline before the team's built to create it."
- **Variables:** `{{first_name}} {{company}} {{recent_event}} {{trigger_detail}} {{similar_company}}`

## 4 — Cybersecurity demand-gen rescue (US)
- **Industry / Vertical:** Cybersecurity vendors
- **Location:** United States
- **ICP / Persona:** CMO / Head of Demand Gen
- **Trigger:** Hiring demand-gen/SDRs **or** flat headcount after a raise (pipeline pressure)
- **List Logic:** Cybersecurity SaaS, 50–500 HC, Series A–C, sells to CISOs, uses
  6sense/Demandbase. *Disqualify:* pre-product. **Tier 2.**
- **Pain Logic:** *Surface* — crowded category, hard to book CISO meetings. *Business* —
  CAC rising, pipeline coverage short. *Personal* — CMO accountable for pipeline number to CRO/board.
- **Offer Logic:** *Dream* — net-new CISO meetings without ad spend inflation. *Mechanism* —
  signal-led outbound to security buyers. *Guarantee* — pay-per-qualified-meeting. *Packaging* — performance.
- **Personalization Logic:** 1:few by `{{competitor}}` displacement angle.
- **Copy Angle:** Subj `CISO meetings` · Opener: "Booking time with CISOs is brutal right now — most {{niche}} vendors lean on events and ads while outbound to the actual buyer goes untouched."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{competitor}} {{proof_metric}}`

## 5 — Referral-dependent agency growth (UK)
- **Industry / Vertical:** Marketing / creative / digital agencies
- **Location:** United Kingdom
- **ICP / Persona:** Founder / Owner / MD
- **Trigger:** Lumpy growth signal — small team, strong portfolio, no outbound presence
- **List Logic:** Agencies (marketing/dev/design), 5–50 HC, owner-led, active Clutch/portfolio.
  *Disqualify:* lead-gen agencies (competitors). **Tier 2.**
- **Pain Logic:** *Surface* — new clients come only from referrals. *Business* — revenue is
  lumpy, can't forecast. *Personal* — owner stressed by feast/famine, can't plan hiring.
- **Offer Logic:** *Dream* — 5–10 booked calls/mo with ideal clients. *Mechanism* — DFY
  outbound. *Guarantee* — "calls or you don't pay." *Packaging* — retainer + DFY.
- **Personalization Logic:** 1:few by `{{niche}}` (the agency's specialism).
- **Copy Angle:** Subj `booked calls for {{company}}` · Opener: "Most {{niche}} agencies are
  great at the work but rely on referrals for new business, so growth is lumpy."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{similar_company}}`

## 6 — Staffing firm dual-sided lead-gen (US)
- **Industry / Vertical:** Recruiting / staffing firms
- **Location:** United States
- **ICP / Persona:** Founder / Director of Business Development
- **Trigger:** Posting their own roles / expanding desks (growth signal)
- **List Logic:** Staffing/recruiting firms, 10–100 HC, niche verticals (tech, healthcare,
  light industrial), Bullhorn user. *Disqualify:* RPO giants. **Tier 2.**
- **Pain Logic:** *Surface* — need more client companies (not just candidates). *Business* —
  margin tied to filled reqs; client acquisition is manual. *Personal* — BD lead carries the
  new-logo number personally.
- **Offer Logic:** *Dream* — steady flow of hiring-company meetings. *Mechanism* — outbound to
  companies showing hiring signals in their niche. *Guarantee* — performance floor. *Packaging* — hybrid.
- **Personalization Logic:** 1:few by `{{niche}}` desk.
- **Copy Angle:** Subj `new client desks` · Opener: "You place {{niche}} talent well — the
  harder part is a steady stream of *hiring companies* to place them into."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{tool_in_use}} {{proof_metric}}`

## 7 — DTC rising-CAC diversification (US)
- **Industry / Vertical:** Ecommerce / DTC brands (Shopify Plus)
- **Location:** United States
- **ICP / Persona:** Head of Growth / CMO / Founder
- **Trigger:** Shopify Plus + heavy paid-social footprint (Meta pixel) = CAC exposure
- **List Logic:** DTC brands, $5–50M revenue, Shopify Plus, runs Meta/Google ads, 20–150 HC.
  *Disqualify:* pure marketplace sellers. **Tier 2.** (Note: B2B outbound = wholesale/retail
  partnerships angle, not consumer.)
- **Pain Logic:** *Surface* — paid CAC keeps climbing. *Business* — margins squeezed, growth
  single-channel. *Personal* — Head of Growth needs a non-paid channel to hit targets.
- **Offer Logic:** *Dream* — wholesale/retail-partner pipeline as a second growth channel.
  *Mechanism* — outbound to buyers/retail partners. *Guarantee* — pilot with meeting target. *Packaging* — retainer.
- **Personalization Logic:** 1:few by `{{tech_signal}}` (Shopify Plus) + category.
- **Copy Angle:** Subj `beyond paid` · Opener: "With CAC where it is, most {{niche}} brands on
  Shopify Plus are over-reliant on paid — wholesale/retail outbound is the quiet second channel."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{tech_signal}} {{similar_company}}`

## 8 — Industrial OEM distributor break-out (DACH)
- **Industry / Vertical:** Manufacturing / industrial OEM
- **Location:** DACH (Germany / Austria / Switzerland)
- **ICP / Persona:** Vertriebsleiter / VP Sales / Commercial Director
- **Trigger:** Trade-show attendance / new product line / export push
- **List Logic:** Industrial manufacturers/OEMs, 50–1,000 HC, distributor-reliant, exhibiting
  at sector trade shows. *Disqualify:* pure consumer goods. **Tier 2.** GDPR; formal German tone.
- **Pain Logic:** *Surface* — sales flow only through legacy distributors. *Business* — no direct
  pipeline, margin lost to channel, slow to enter new markets. *Personal* — Vertriebsleiter judged
  on direct/new-market growth.
- **Offer Logic:** *Dream* — direct qualified pipeline into target accounts/regions. *Mechanism* —
  outbound to procurement/engineering buyers. *Guarantee* — pilot. *Packaging* — retainer.
- **Personalization Logic:** 1:few by `{{recent_event}}` (Messe/show) — proof-heavy, formal.
- **Copy Angle:** Subj `Direktvertrieb {{company}}` · Opener (formal, proof-led): "Viele
  {{niche}}-Hersteller verkaufen fast ausschließlich über Distributoren — direkter Vertrieb in neue Märkte bleibt liegen."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{recent_event}} {{proof_metric}}`

## 9 — Freight forwarder new-lane fill (US)
- **Industry / Vertical:** Logistics / freight forwarding / 3PL
- **Location:** United States
- **ICP / Persona:** Sales Director / VP Commercial
- **Trigger:** New lane/warehouse/service announced; capacity to fill
- **List Logic:** Freight forwarders / 3PLs, 50–500 HC, regional, recently expanded capacity.
  *Disqualify:* asset-light brokers <10 HC. **Tier 2.**
- **Pain Logic:** *Surface* — empty capacity on new lanes. *Business* — fixed cost, utilization
  drives margin. *Personal* — Sales Director must fill capacity fast or it bleeds.
- **Offer Logic:** *Dream* — shippers booked onto new lanes. *Mechanism* — outbound to
  shipping/supply-chain managers. *Guarantee* — performance floor. *Packaging* — hybrid.
- **Personalization Logic:** 1:few by lane/region `{{location_city}}`.
- **Copy Angle:** Subj `{{location_city}} capacity` · Opener: "Saw {{company}} added
  {{trigger_detail}} — new capacity is great until it's sitting empty while utilization decides the margin."
- **Variables:** `{{first_name}} {{company}} {{trigger_detail}} {{location_city}} {{proof_metric}}`

## 10 — Health-tech long-cycle pipeline (US)
- **Industry / Vertical:** Healthcare SaaS / health-tech
- **Location:** United States
- **ICP / Persona:** VP Sales / Chief Commercial Officer
- **Trigger:** Raised round / hiring enterprise AEs; sells to providers/payers
- **List Logic:** Health-tech SaaS, 50–300 HC, Series B+, sells to hospitals/clinics/payers,
  HIPAA-aware. *Disqualify:* consumer wellness apps. **Tier 2.**
- **Pain Logic:** *Surface* — brutally long sales cycles, hard to reach clinical/admin buyers.
  *Business* — pipeline coverage thin vs. quota. *Personal* — VP needs predictable top-of-funnel
  to forecast credibly.
- **Offer Logic:** *Dream* — consistent meetings with provider/payer buyers. *Mechanism* —
  compliant, role-specific outbound. *Guarantee* — pay-per-qualified-meeting. *Packaging* — performance.
- **Personalization Logic:** 1:few by buyer type (clinical vs. admin vs. payer).
- **Copy Angle:** Subj `provider meetings` · Opener: "Selling into health systems means
  cycles measured in quarters — most {{niche}} teams under-invest in the top of funnel because of it."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{similar_company}} {{proof_metric}}`

## 11 — Consulting utilization filler (US)
- **Industry / Vertical:** Management / professional-services consulting
- **Location:** United States
- **ICP / Persona:** Partner / Principal
- **Trigger:** Hiring consultants (bench growth) → needs billable work to fill
- **List Logic:** Boutique consultancies, 20–200 HC, specialized (ops, finance, GTM, change),
  partner-led BD. *Disqualify:* Big-4. **Tier 2.**
- **Pain Logic:** *Surface* — BD depends on partners' networks. *Business* — utilization/bench
  cost; lumpy project pipeline. *Personal* — partner's comp tied to originated work.
- **Offer Logic:** *Dream* — steady qualified intro calls with target clients. *Mechanism* —
  outbound positioning the firm's specialism. *Guarantee* — pilot. *Packaging* — retainer.
- **Personalization Logic:** 1:few by `{{niche}}` practice area.
- **Copy Angle:** Subj `{{niche}} pipeline` · Opener: "Most boutique {{niche}} firms grow on
  partner networks — which is why pipeline is feast-or-famine and the bench gets nervous."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{role_count}} {{similar_company}}`

## 12 — Proptech leasing pipeline (UK)
- **Industry / Vertical:** Commercial real estate / proptech
- **Location:** United Kingdom
- **ICP / Persona:** Head of Sales / Leasing Director
- **Trigger:** New development / portfolio launch / proptech product release
- **List Logic:** CRE operators & proptech vendors, 20–250 HC, UK metros, recently launched
  space/product. *Disqualify:* residential-only agents. **Tier 2.** GDPR.
- **Pain Logic:** *Surface* — occupancy/leasing gaps or thin SaaS pipeline. *Business* — empty
  space / unsold seats = direct revenue loss. *Personal* — Head of Sales owns the occupancy number.
- **Offer Logic:** *Dream* — qualified tenant/buyer meetings. *Mechanism* — outbound to
  occupiers/decision-makers. *Guarantee* — performance floor. *Packaging* — hybrid.
- **Personalization Logic:** 1:few by `{{location_city}}` + asset/product type.
- **Copy Angle:** Subj `{{location_city}} occupancy` · Opener: "With {{trigger_detail}} coming
  online, the pressure's on to fill it before carrying cost eats the return."
- **Variables:** `{{first_name}} {{company}} {{location_city}} {{trigger_detail}} {{proof_metric}}`

## 13 — Specialty contractor bid pipeline (US)
- **Industry / Vertical:** Construction / specialty contractors
- **Location:** United States
- **ICP / Persona:** Owner / Business Development Lead
- **Trigger:** Hiring crews / equipment purchase = capacity to fill with projects
- **List Logic:** Commercial specialty contractors (electrical, HVAC, mechanical), $5–50M rev,
  regional, growing headcount. *Disqualify:* residential one-man shops. **Tier 2.**
- **Pain Logic:** *Surface* — pipeline of bids depends on GC relationships. *Business* — idle
  crews = burned margin; lumpy project flow. *Personal* — owner personally chasing the next job.
- **Offer Logic:** *Dream* — steady stream of qualified project/bid opportunities. *Mechanism* —
  outbound to GCs/developers/facility managers. *Guarantee* — pilot. *Packaging* — retainer + DFY.
- **Personalization Logic:** 1:few by trade `{{niche}}` + `{{location_city}}`.
- **Copy Angle:** Subj `{{location_city}} projects` · Opener: "Most {{niche}} contractors live
  off a handful of GC relationships — when those go quiet, crews sit and margin walks."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{location_city}} {{similar_company}}`

## 14 — Legal-tech competitive displacement (US)
- **Industry / Vertical:** Legal-tech SaaS
- **Location:** United States
- **ICP / Persona:** VP Sales / Head of Revenue
- **Trigger:** Competitor price hike / negative G2 movement / their hiring of AEs
- **List Logic:** Legal-tech SaaS (practice mgmt, e-discovery, contract), 30–300 HC, sells to
  law firms/legal ops. *Disqualify:* consumer legal. **Tier 2.**
- **Pain Logic:** *Surface* — crowded category, hard to differentiate in outbound. *Business* —
  CAC high, pipeline tied to events/inbound. *Personal* — VP needs predictable outbound channel.
- **Offer Logic:** *Dream* — net-new meetings with legal buyers via displacement angle.
  *Mechanism* — outbound targeting `{{competitor}}` users. *Guarantee* — pay-per-meeting. *Packaging* — performance.
- **Personalization Logic:** 1:few by `{{competitor}}` in use (technographic).
- **Copy Angle:** Subj `switching from {{competitor}}` · Opener: "Teams on {{competitor}} are
  increasingly looking after {{trigger_detail}} — but {{niche}} outbound to them is basically untapped."
- **Variables:** `{{first_name}} {{company}} {{competitor}} {{niche}} {{trigger_detail}}`

## 15 — M&A advisory deal-sourcing (US)
- **Industry / Vertical:** M&A advisory / boutique investment banking
- **Location:** United States
- **ICP / Persona:** Partner / Managing Director
- **Trigger:** New sector focus / fund mandate / recent close announced
- **List Logic:** Boutique M&A advisors & lower-mid-market PE, 10–100 HC, sector-specialized.
  *Disqualify:* bulge-bracket. **Tier 1 (1:1).**
- **Pain Logic:** *Surface* — proprietary deal flow is the bottleneck. *Business* — bankers'
  time is the constraint on sourcing. *Personal* — partner's economics tied to originated deals.
- **Offer Logic:** *Dream* — qualified conversations with sellable companies/owners. *Mechanism* —
  thesis-driven outbound to owner-operators. *Guarantee* — pilot, defined intro target. *Packaging* — retainer.
- **Personalization Logic:** 1:1, thesis-specific (`{{niche}}` + thesis).
- **Copy Angle:** Subj `{{niche}} thesis` · Opener: "Given your focus on {{niche}}, the
  constraint is rarely capital — it's proprietary access to owners who'd consider a conversation."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{recent_event}} {{proof_metric}}`

## 16 — HR-tech market entry (ANZ)
- **Industry / Vertical:** HR-tech / HRIS / people SaaS
- **Location:** Australia / New Zealand
- **ICP / Persona:** Head of Sales / Country Manager
- **Trigger:** Recently launched in ANZ / hired first local AEs
- **List Logic:** HR-tech SaaS, 50–300 HC, expanding into ANZ, sells to HR/People leaders.
  *Disqualify:* US-only with no local entity. **Tier 2.** Local tone, AU/NZ time zones.
- **Pain Logic:** *Surface* — new region, no local pipeline. *Business* — expansion bet needs
  traction to justify spend. *Personal* — Country Manager must prove the market fast.
- **Offer Logic:** *Dream* — local qualified pipeline in 90 days. *Mechanism* — outbound to ANZ
  HR buyers. *Guarantee* — performance floor. *Packaging* — retainer + bonus.
- **Personalization Logic:** 1:few by `{{location_city}}` + company size.
- **Copy Angle:** Subj `ANZ pipeline` · Opener: "Launching in ANZ is the easy part — building
  local pipeline before the team's fully ramped is where most {{niche}} expansions stall."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{location_city}} {{similar_company}}`

## 17 — Commercial solar lead flow (US)
- **Industry / Vertical:** Renewable energy / commercial solar & EPC
- **Location:** United States (Sun Belt states)
- **ICP / Persona:** Sales Director / VP Development
- **Trigger:** Hiring installers / new state license / incentive-program changes
- **List Logic:** Commercial solar installers/EPCs, $10–100M rev, C&I focus, expanding crews.
  *Disqualify:* residential door-knockers. **Tier 2.**
- **Pain Logic:** *Surface* — inconsistent commercial project lead flow. *Business* — crews/
  capital idle without project pipeline. *Personal* — Sales Director owns the bookings target.
- **Offer Logic:** *Dream* — qualified C&I project opportunities. *Mechanism* — outbound to
  facility/property owners & developers. *Guarantee* — pilot. *Packaging* — hybrid.
- **Personalization Logic:** 1:few by `{{location_city}}`/state + incentive `{{recent_event}}`.
- **Copy Angle:** Subj `C&I solar projects` · Opener: "With {{recent_event}}, demand for
  commercial solar is real — but most EPCs still wait on inbound while crews need feeding."
- **Variables:** `{{first_name}} {{company}} {{location_city}} {{recent_event}} {{proof_metric}}`

## 18 — Med-device clinic adoption (EU)
- **Industry / Vertical:** Medical devices / diagnostics
- **Location:** Western Europe (UK, NL, Nordics — English-first)
- **ICP / Persona:** Commercial Lead / Country Sales Manager
- **Trigger:** CE-mark / new product approval / clinic-targeted launch
- **List Logic:** Med-device & diagnostics firms, 50–500 HC, selling to clinics/hospitals,
  recently approved product. *Disqualify:* pure R&D pre-approval. **Tier 2.** GDPR; no health data.
- **Pain Logic:** *Surface* — slow clinical adoption, gatekept buyers. *Business* — approved
  product not converting to orders fast enough. *Personal* — commercial lead carries adoption KPI.
- **Offer Logic:** *Dream* — qualified meetings with procurement/clinical decision-makers.
  *Mechanism* — compliant outbound to the right titles. *Guarantee* — pilot. *Packaging* — retainer.
- **Personalization Logic:** 1:few by `{{location_city}}` + facility type.
- **Copy Angle:** Subj `{{product}} adoption` · Opener (understated EU): "Approval's the
  milestone — but turning a CE-marked {{niche}} device into orders depends on reaching the right buyers, fast."
- **Variables:** `{{first_name}} {{company}} {{niche}} {{recent_event}} {{similar_company}}`

## 19 — MSP recurring-contract growth (US)
- **Industry / Vertical:** IT managed-service providers (MSPs)
- **Location:** United States
- **ICP / Persona:** Owner / Founder
- **Trigger:** Hiring techs / acquired another MSP = capacity for more contracts
- **List Logic:** MSPs, 10–80 HC, SMB/mid-market clients, ConnectWise/Datto users, growing.
  *Disqualify:* break-fix one-person shops. **Tier 2.**
- **Pain Logic:** *Surface* — new client acquisition is referral/word-of-mouth. *Business* —
  MRR growth stalls; techs underutilized. *Personal* — owner is also the salesperson, stretched thin.
- **Offer Logic:** *Dream* — steady flow of SMB/mid-market prospects for managed contracts.
  *Mechanism* — outbound to office/ops managers showing IT pain signals. *Guarantee* — performance
  floor. *Packaging* — retainer + DFY.
- **Personalization Logic:** 1:few by `{{tool_in_use}}` (PSA/RMM) + `{{location_city}}`.
- **Copy Angle:** Subj `{{location_city}} managed contracts` · Opener: "Most growing MSPs add
  techs faster than clients — so MRR plateaus while the owner's still the whole sales team."
- **Variables:** `{{first_name}} {{company}} {{tool_in_use}} {{location_city}} {{proof_metric}}`

## 20 — Restaurant/hospitality SaaS expansion (US)
- **Industry / Vertical:** Hospitality / restaurant SaaS
- **Location:** United States
- **ICP / Persona:** Head of Sales / VP Revenue
- **Trigger:** Raised round / new product module / hiring AEs into multi-unit segment
- **List Logic:** Restaurant/hospitality SaaS (POS, ordering, labor, loyalty), 50–300 HC,
  targeting multi-unit operators & franchises. *Disqualify:* single-location tools <10 HC. **Tier 2.**
- **Pain Logic:** *Surface* — fragmented buyers, high churn in SMB, hard to reach multi-unit
  decision-makers. *Business* — needs higher-ACV multi-unit logos to fix unit economics. *Personal* —
  VP must move upmarket to hit the number.
- **Offer Logic:** *Dream* — meetings with multi-unit/franchise operators. *Mechanism* —
  outbound to ops/finance leaders at groups. *Guarantee* — pay-per-meeting. *Packaging* — performance.
- **Personalization Logic:** 1:few by unit-count band + `{{tech_signal}}` (current POS).
- **Copy Angle:** Subj `multi-unit operators` · Opener: "SMB restaurant SaaS churns hard —
  the fix is multi-unit logos, but those operators are exactly who outbound usually misses."
- **Variables:** `{{first_name}} {{company}} {{tech_signal}} {{similar_company}} {{proof_metric}}`

---

## Coverage map (industry × geo)

| # | Industry | Geo | ICP | Guarantee |
|---|---|---|---|---|
| 1 | B2B SaaS | US | VP Sales | Pay-per-meeting |
| 2 | Dev-tools SaaS | US | Founder | Paid pilot |
| 3 | Fintech/payments | UK | Head of Growth | Perf. floor |
| 4 | Cybersecurity | US | CMO/DG | Pay-per-meeting |
| 5 | Agencies | UK | Owner | Calls-or-free |
| 6 | Staffing | US | BD Director | Perf. floor |
| 7 | Ecommerce/DTC | US | Head of Growth | Pilot |
| 8 | Manufacturing | DACH | VP Sales | Pilot |
| 9 | Logistics/3PL | US | Sales Director | Perf. floor |
| 10 | Health-tech | US | VP Sales | Pay-per-meeting |
| 11 | Consulting | US | Partner | Pilot |
| 12 | Proptech/CRE | UK | Head of Sales | Perf. floor |
| 13 | Construction | US | Owner | Pilot |
| 14 | Legal-tech | US | VP Sales | Pay-per-meeting |
| 15 | M&A advisory | US | Partner | Pilot |
| 16 | HR-tech | ANZ | Country Mgr | Perf. floor |
| 17 | Commercial solar | US | Sales Director | Pilot |
| 18 | Med-device | EU | Commercial Lead | Pilot |
| 19 | MSP | US | Owner | Perf. floor |
| 20 | Hospitality SaaS | US | VP Sales | Pay-per-meeting |

**Spread:** 13 US · 3 UK · 1 DACH · 1 ANZ · 1 EU · (US Sun-Belt). 11 SaaS/tech vs 9
non-SaaS/traditional — a deliberate balance so the portfolio proves the system across both
sides of the SaaS ↔ non-SaaS axis.

**Suggested launch order (highest PROOF first):** #1, #5, #19, #6, #13 — proven-adjacent,
deep data, urgent pain, strong guarantee — then expand by geo (#3, #16) and vertical (#4, #10).
