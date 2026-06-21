# The Outbound Operating System for GTM Agencies

A repeatable system for designing, launching, and scaling cold-outbound campaigns
across any axis — **SaaS ↔ non-SaaS, industry ↔ industry, location ↔ location,
ICP ↔ ICP** — built on four stacked logic layers:

> **List Logic → Pain Logic → Offer Logic → Copy Logic**

The premise: a GTM agency doesn't win by writing clever emails. It wins by owning a
**system** that turns "who do we email next?" into a 30-minute decision and a
launch-ready brief. Everything below is designed to be recombined, not rewritten,
each time you open a new segment.

---

## 0. Operating Principles

1. **List quality is 60% of the result, copy is 20%, offer is 20%.** You cannot
   write your way out of a bad list. Spend your effort proportionally.
2. **One segment = one message = one offer.** The moment a campaign tries to speak
   to two ICPs, it speaks to none. Split first, scale second.
3. **Relevance beats personalization.** A perfectly relevant generic line ("saw
   you're hiring 3 AEs") outperforms a personalized irrelevant one ("love your
   podcast").
4. **Lead with the outcome, sell the mechanism later.** Cold prospects buy a
   result, not your process.
5. **Every campaign is an experiment with a hypothesis.** If you can't state the
   ICP, the pain, and the expected positive-reply rate before launch, you're not
   ready to launch.
6. **Reuse the layers, swap the variables.** The matrix engine (Section 6) is the
   whole point: 80% of a new campaign is assembled, only 20% is net-new.

---

## 1. The Campaign Matrix — picking the next outbound

Every new campaign is a coordinate on four axes. Define the coordinate before
anything else.

| Axis | Question | Example values |
|---|---|---|
| **Vertical** | SaaS or non-SaaS? | B2B SaaS, fintech, agencies, healthcare, manufacturing, logistics, professional services |
| **Industry** | Which sub-industry within that? | "Series A dev-tools SaaS" vs "regional HVAC contractors" |
| **Location** | Which geo/market? | US, UK, DACH, Nordics, ANZ, GCC |
| **ICP / Persona** | Who exactly inside the company? | Founder/CEO, VP Sales, Head of RevOps, Head of Talent |

**How to prioritize which coordinate to run next** — score each candidate segment
0–5 on five factors (the **PROOF score**):

| Factor | What it measures | Weight |
|---|---|---|
| **P**roof | Do we have a case study/result in or adjacent to this segment? | ×3 |
| **R**eachability | Can we build a clean, deep list (data + signals exist)? | ×2 |
| **O**ffer-fit | Does our offer map to an urgent, expensive pain here? | ×3 |
| **O**rder value | Deal size × close rate × LTV | ×2 |
| **F**riction | Sales-cycle length, compliance, gatekeeping (inverse — score low = bad) | ×1 |

Run the next segment that scores highest. Reassess monthly. This kills the
"let's just email everyone" instinct and makes expansion deliberate.

---

## 2. Layer 1 — LIST LOGIC

> *"Who, exactly, and why are they reachable right now?"*

### 2.1 ICP definition framework

Define every ICP on four dimensions. If you can't fill all four, the list isn't ready.

1. **Firmographic** — industry, headcount band, revenue band, funding stage,
   growth rate, business model (B2B/B2C/marketplace).
2. **Technographic** — tools they run that imply fit (e.g. uses HubSpot but no
   enrichment tool; runs Shopify Plus; ATS = Greenhouse ⇒ scaling hiring).
3. **Signal / trigger** — *why now* (see 2.3). This is what separates a list from a
   spray.
4. **Persona** — exact titles + their job-to-be-done + what they're measured on +
   what they fear.

**Template — ICP card (fill one per segment):**

```
ICP NAME:            e.g. "Series A B2B SaaS – Head of Sales – US"
Firmographic:        SaaS, 30–150 employees, $3–20M ARR, raised A in last 18mo
Technographic:       Outreach/Salesloft user, hiring on LinkedIn, no RevOps tool
Trigger (why now):   Posted 2+ AE roles in last 30 days
Persona:             VP/Head of Sales; measured on pipeline & ramp time; fears
                     missing the number after the raise
Disqualifiers:       <$2M ARR, agency, services biz, >500 employees
Serviceable?         Yes — English, US time zone, we have 2 SaaS case studies
Est. TAM:            ~4,800 accounts
```

### 2.2 Account tiering (don't treat all accounts equally)

- **Tier 1 (Dream 100/500):** highest-value, perfect-fit accounts. Deep 1:1
  research, multi-channel, manual touches. ~5% of volume, ~40% of effort.
- **Tier 2:** strong fit, clear trigger. 1:few personalization (snippets per
  sub-segment). The workhorse — most pipeline comes from here.
- **Tier 3:** fits firmographics, no strong trigger yet. 1:many with light dynamic
  fields. Pure volume play, lowest effort.

### 2.3 Trigger / intent signal library (the "why now")

The single biggest lever on reply rate. Build campaigns *around* a signal, not
around a static list.

| Signal type | Examples | Implies |
|---|---|---|
| **Hiring** | Posted roles for the function you serve (AEs, SDRs, RevOps, marketers) | Scaling that function = pain you solve |
| **Funding** | Raised seed/A/B in last 6–18 months | Pressure to deploy capital into growth |
| **Leadership change** | New VP Sales/CMO/CRO in last 90 days | New leader wants quick wins, open to vendors |
| **Tech adoption/churn** | Added/removed a tool (BuiltWith/Wappalyzer) | Stack in flux, budget moving |
| **Growth** | Headcount up X% YoY, new office/market | Scaling pains |
| **Engagement** | Visited site, opened prior emails, engaged on LinkedIn | Warm-ish, prioritize |
| **Event/news** | Product launch, award, M&A, expansion | Personalized, timely opener |

**Rule:** every Tier 2/3 campaign should be triggered by at least one signal. "No
trigger" lists are Tier 3 volume only.

### 2.4 Data sourcing waterfall

Don't rely on one source. Layer them and verify:

1. **Source** — Apollo / Sales Navigator / Ocean.io / Crunchbase / industry lists.
2. **Enrich** — Clay (orchestration) pulling from multiple providers via waterfall
   (e.g. work email: Prospeo → Findymail → Datagma; stop when found).
3. **Signal-append** — hiring (job boards), funding (Crunchbase), tech (BuiltWith).
4. **Verify** — email validation (catch-all handling, MX checks) — this protects
   deliverability (Section 7).
5. **De-dupe & suppress** — against current clients, existing pipeline, prior
   contacts, and DNC/unsubscribe lists.

### 2.5 Location logic (geo is not just a filter)

Each location changes data availability, copy, timing, and law:

| Dimension | What changes by geo |
|---|---|
| **Language & tone** | US = direct/benefit-led; UK = understated; DACH = formal, proof-heavy; Nordics = concise; GCC = relationship/respect-led |
| **Compliance** | US: CAN-SPAM (opt-out + valid address). EU/UK: GDPR — legitimate-interest basis, easy opt-out, no special-category data. CASL (Canada) stricter. **Build the campaign to the strictest applicable law.** |
| **Timing** | Send windows in local time; mind public holidays and Ramadan/observances |
| **Data depth** | US data richest; EU thinner & GDPR-limited; verify per-market before promising TAM |
| **Proof localization** | Lead with in-region logos/case studies where possible |

**Location-to-location expansion rule:** never copy a US campaign into EU verbatim.
Re-check (1) data availability, (2) legal basis, (3) language/tone, (4) local proof.

### 2.6 List-build SOP + quality gates

Before a list ships to sending, it must pass:

- [ ] Matches ICP card firmographics (spot-check 20 rows manually)
- [ ] ≥1 trigger present for Tier 1/2
- [ ] Emails verified, catch-alls handled per policy
- [ ] Suppression applied (clients, pipeline, DNC, prior 90-day contacts)
- [ ] Personalization fields populated ≥95% (no `{{first_name}}` blanks)
- [ ] Disqualifiers removed
- [ ] Sample of 10 read aloud — "would a human believe this is relevant?"

---

## 3. Layer 2 — PAIN LOGIC

> *"What does this exact person lie awake about, and what is it costing them?"*

### 3.1 The pain hierarchy

For each ICP, map three levels — you sell to all three but lead with the top:

1. **Surface pain** — the symptom they'd name ("our reply rates dropped").
2. **Business pain** — what it costs the company (pipeline down ⇒ missed number).
3. **Personal pain** — what it costs *them* (the VP misses quota after a raise ⇒
   job risk; the founder can't fundraise the next round). **This is what moves
   people.**

### 3.2 Pain mapping per segment

**Template — pain map (one per ICP):**

```
ICP:                 Series A SaaS – Head of Sales – US
Status quo:          Hired 2 SDRs, building outbound in-house
Surface pain:        Ramp is slow, pipeline inconsistent
Business pain:       Burning runway on a function that isn't producing pipeline
Personal pain:       Board expects the raise to turn into pipeline THIS quarter
Cost of inaction:    Each dead month = ~$X in wasted comp + slipped number
Trigger that proves it: 2 open AE roles + recent raise
```

### 3.3 SaaS vs non-SaaS pain (why the axis matters)

| | **SaaS / tech** | **Non-SaaS (services, trades, traditional)** |
|---|---|---|
| Dominant pain | Pipeline, CAC, growth efficiency, churn | Inconsistent lead flow, capacity utilization, seasonality, margin |
| Buyer literacy | High — knows "cold outbound", skeptical of hype | Lower — needs concrete, jargon-free, "more booked jobs/clients" |
| Proof that lands | Metrics, benchmarks, dashboards | Local case studies, before/after revenue, "people like you" |
| Sales cycle | Faster, more self-serve | Relationship-led, trust-first, often phone-closed |
| Copy tone | Sharp, metric-led, low fluff | Plain-English, outcome-led, low jargon |

**Implication:** the *offer and copy don't transfer across this axis even if the
mechanism is identical.* Same service, completely different pain language.

### 3.4 Pain-to-segment matrix (build once, reuse forever)

Maintain a living grid: rows = ICPs, columns = the 3–5 pains you can credibly
solve, cells = the specific angle + proof for that intersection. New campaign =
pick a cell, not write from scratch.

---

## 4. Layer 3 — OFFER LOGIC

> *"Why is saying yes a no-brainer, and why now?"*

### 4.1 Offer construction — the value equation

Make the offer feel high-value and low-risk. Maximize the top, minimize the bottom:

```
              Dream Outcome  ×  Perceived Likelihood of Success
Value  =  ───────────────────────────────────────────────────────
               Time Delay   ×   Effort & Sacrifice
```

- **Dream outcome** — state it in *their* metric ("35 qualified meetings booked in
  90 days," not "we do outbound").
- **Likelihood** — proof, guarantees, risk reversal, specificity.
- **Time delay** — compress: "first meetings in 3–4 weeks."
- **Effort** — "done-for-you; you show up to booked calls."

### 4.2 Risk reversal / guarantee ladder (pick per segment maturity)

1. **Performance floor** — "X meetings in 90 days or we work free until you get
   them."
2. **Pay-per-outcome** — pay per qualified meeting/opportunity (low risk to buyer,
   needs your ops to be tight).
3. **Pilot/trial** — paid 4–6 week pilot, defined success metric, then scale.
4. **Money-back** — full refund if floor not hit. Strongest, use when confident.

Match the guarantee to your confidence in that segment's PROOF score. New segments:
start with a pilot, not a money-back guarantee.

### 4.3 Offer packaging models for agencies

| Model | How it works | Best when |
|---|---|---|
| **Retainer** | Flat monthly for managed outbound | Predictable, you control infra |
| **Performance / pay-per-meeting** | $ per qualified meeting | Buyer is skeptical; you trust your funnel |
| **Hybrid** | Lower retainer + per-meeting bonus | Aligns incentives, de-risks both sides |
| **Infrastructure + done-with-you** | You build sending infra + Clay, they run it | Buyer has an SDR team |

### 4.4 Offer-by-segment rule

The *mechanism* is constant (you run outbound). The *offer wrapper* changes:

- SaaS VP Sales → "Predictable pipeline to hit your post-raise number — 30
  meetings/quarter, pay-per-meeting."
- Non-SaaS agency owner → "5–10 booked sales calls/month with your ideal clients,
  done-for-you, or you don't pay."

Same service. Different dream outcome, different proof, different guarantee.

### 4.5 Offer-market fit test

Before scaling, validate the offer on 200–300 sends. Signal of fit: **positive
reply rate ≥ 3–5%** and replies that engage with the *offer* (asking price/how),
not just "not interested." If replies are "what is this?" the offer/relevance is
off, not the copy.

---

## 5. Layer 4 — COPY LOGIC

> *"Would a busy stranger believe this was written for them and reply?"*

### 5.1 Sequence architecture

A campaign is a **sequence**, not an email. Default structure (tune per segment):

| Step | Day | Channel | Purpose |
|---|---|---|---|
| 1 | 0 | Email | Trigger + pain + soft CTA |
| 2 | 2–3 | Email (reply to #1) | New angle / proof point |
| 3 | 4–5 | LinkedIn | Connect / light touch (multichannel lift) |
| 4 | 6–8 | Email | Case study / social proof |
| 5 | 10–12 | Email | Break-up / "should I close the file?" |

- **3–5 email steps**, spread 2–4 days, multichannel where possible.
- Replies in-thread (keeps deliverability + context).
- Each step = **one new angle**, never "just bumping this up."

### 5.2 Personalization tiers (match to account tier)

| Tier | Method | Scales to |
|---|---|---|
| **1:1** | Manual research, custom first 1–2 lines | Tier 1 (dozens) |
| **1:few** | Snippet libraries per sub-segment + dynamic fields | Tier 2 (hundreds) |
| **1:many** | Relevant generic + light dynamic fields (industry, trigger) | Tier 3 (thousands) |

The win is **relevance via signal**, not name-dropping. A `{{trigger}}` field ("saw
you're hiring 3 SDRs") beats hand-written flattery.

### 5.3 Cold-email message framework

Keep it **<90 words**, mobile-readable, one CTA. Use a proven skeleton:

**PAS-for-cold (the workhorse):**
```
[Opener: trigger/relevance — proves this isn't a blast]
[Pain: name the specific pain this ICP feels, in their words]
[Mechanism + proof: one line on how + one credible result]
[CTA: low-friction, interest-based]
```

**Worked example — Series A SaaS, Head of Sales, US:**
```
Subject: 2 AE roles

Hi {{first_name}} — saw {{company}} is hiring a couple of AEs after the
Series A. Usually means pipeline needs to scale faster than ramp allows.

We build the outbound engine that fills that gap — booked {{proof_metric}}
for {{similar_company}} in their first quarter post-raise.

Worth a 15-min look at what that'd map to for {{company}}?
```

**Worked example — non-SaaS, agency owner, UK:**
```
Subject: booked calls for {{company}}

Hi {{first_name}} — most {{niche}} agencies I speak to are great at the
work but rely on referrals for new clients, so growth is lumpy.

We book 5–10 sales calls a month with your ideal clients, fully
done-for-you. {{similar_company}} went from referrals-only to a steady
calendar in ~6 weeks.

Open to seeing if we could do the same for {{company}}?
```

### 5.4 Subject lines

- 1–3 words, lowercase, looks internal/human ("quick q", "2 AE roles",
  "{{company}} pipeline").
- Avoid spammy words, ALL CAPS, exclamation marks, "free", "guarantee".
- Never make the subject the pitch.

### 5.5 CTA ladder (interest-based, not calendar-shoving)

Cold step: **interest CTA** ("worth a look?", "open to it?") — not "book a call."
Only ask for time *after* they engage. Lower friction = higher reply.

### 5.6 Copy variables by axis

- **SaaS vs non-SaaS:** metric-led & sharp vs plain-English & outcome-led (see 3.3).
- **Persona:** founder = vision/speed; VP = number/quota; RevOps = efficiency/stack.
- **Geo:** match tone to market (2.5); localize proof and CTA formality.

### 5.7 Copy quality gate

- [ ] <90 words, one idea, one CTA
- [ ] Opener proves relevance (trigger/segment), not flattery
- [ ] Pain stated in the prospect's language
- [ ] One specific, believable proof point
- [ ] No jargon the buyer wouldn't use
- [ ] Reads naturally aloud; no "I hope this email finds you well"
- [ ] Spam-checked; links/images minimized

---

## 6. The Matrix Engine — recombining the layers

This is the system. To launch *any* new segment, you assemble — you don't rewrite.

**The recombination workflow (≈ half a day to a launch-ready brief):**

1. **Pick the coordinate** (Section 1) — Vertical × Industry × Location × ICP.
2. **Pull the ICP card** (2.1) — clone the nearest existing one, swap variables.
3. **Pull the pain map cell** (3.4) — the intersection of this ICP × your solvable
   pains.
4. **Wrap the offer** (4.4) — same mechanism, swap dream outcome + proof + guarantee.
5. **Assemble copy** (5.3) — drop the segment's pain + trigger + proof into the
   skeleton.
6. **Set infra & guardrails** (Section 7).
7. **Write the hypothesis** (Section 8 brief) and launch a 200–300 send test.

**Worked example — moving along an axis:**

> *Base camp:* "US Series A SaaS — Head of Sales" (proven).
> *New coordinate:* "UK Series A SaaS — Head of Sales" (location → location).
> What changes: data source/availability, GDPR legitimate-interest basis, UK tone
> (more understated), localized proof. What stays: ICP firmographics, pain map,
> offer mechanism, sequence structure. → ~80% reused, 20% re-localized.

> *Different axis:* "US Series A SaaS — Head of Sales" → "US regional marketing
> agencies — Owner" (SaaS → non-SaaS). What changes: pain language (lumpy
> referral-led growth, not post-raise quota), proof (local case study not SaaS
> metric), offer wrapper (booked calls + DFY guarantee), copy tone (plain-English).
> What stays: list-build SOP, sequence architecture, deliverability, measurement.

---

## 7. Deliverability & Infrastructure (the silent killer)

None of the above matters if you land in spam. Treat infra as a first-class layer.

- **Domains:** secondary sending domains (never the primary brand domain), 1–3
  mailboxes per domain, multiple domains per campaign for volume.
- **Authentication:** SPF, DKIM, DMARC fully set on every domain. Non-negotiable.
- **Warm-up:** 2–4 weeks before real sends; ramp volume gradually.
- **Volume guardrails:** ~20–40 sends/mailbox/day; don't spike.
- **List hygiene:** verified emails only; suppress catch-alls per risk tolerance;
  remove hard bounces immediately.
- **Health monitoring:** watch bounce rate (<3%), spam complaints (<0.1%), reply
  rate, and inbox-placement. If bounce or spam climbs, **pause and fix**, don't push.
- **Content hygiene:** minimal links, no heavy images, no spam-trigger words,
  plain-text feel.

> Rule of thumb: deliverability problems masquerade as copy problems. If a proven
> campaign's replies suddenly drop, check infra before rewriting copy.

---

## 8. Measurement, Benchmarks & Optimization

### 8.1 The funnel (measure every stage, optimize the weakest)

```
Sent → Delivered → Opened → Replied → Positive Reply → Meeting Booked →
Showed → Opportunity → Closed
```

### 8.2 Diagnostic benchmarks (directional — your numbers will vary)

| Metric | Healthy range | If below, fix… |
|---|---|---|
| Bounce rate | < 3% | List verification / infra |
| Reply rate | 5–15% | Relevance / list / opener |
| Positive reply rate | 3–8% of replies⁺ | Offer + pain match |
| Meeting booked | 1–3% of contacts | CTA + qualification |
| Spam complaints | < 0.1% | Infra + list quality |

⁺ As a share of contacts, target ≈ **1–4% positive replies** for a healthy campaign.

### 8.3 Diagnosis logic (where to look when a number is bad)

- **Low delivery/high bounce** → list verification + infra (Section 7).
- **Delivered but low open** → subject line + sender reputation + (don't over-index
  on opens post-Apple MPP).
- **Opens but low reply** → relevance/opener (List + Copy).
- **Replies but few positive** → offer/pain mismatch (Layers 2 & 3), not copy.
- **Positives but no meetings** → CTA friction + qualification + speed-to-lead.

### 8.4 Testing discipline

- Change **one variable at a time** (subject OR opener OR offer), 200–300 sends
  per variant for signal.
- Hold a **control**. Kill losers fast, double down on winners, document in the
  pain-to-segment matrix so the win is reusable.
- **Speed-to-lead:** reply to positive replies within minutes–hours; it dominates
  meeting-conversion.

---

## 9. The Campaign Brief (one-pager to launch anything)

Nothing launches without this filled in. It forces the whole system into a single
artifact and creates a hypothesis you can grade.

```
CAMPAIGN BRIEF

1. COORDINATE
   Vertical / Industry / Location / ICP:  ____
   PROOF score & why we're running it now: ____

2. LIST LOGIC
   ICP card (firmo/techno/signal/persona): ____
   Trigger (why now):                      ____
   Data sources + enrichment waterfall:    ____
   Suppression applied:                    ____
   Tier & target volume:                   ____ / ____ contacts

3. PAIN LOGIC
   Surface / business / personal pain:     ____
   Cost of inaction:                       ____

4. OFFER LOGIC
   Dream outcome (their metric):           ____
   Mechanism (1 line):                     ____
   Guarantee / risk reversal:              ____
   Packaging & price:                      ____

5. COPY LOGIC
   Sequence (steps/channels/timing):       ____
   Personalization tier:                   ____
   Subject + opener + proof + CTA:         ____

6. INFRA
   Domains / mailboxes / daily volume:     ____
   Warm-up & auth confirmed:               ____

7. HYPOTHESIS & TARGETS
   "We believe [ICP] feels [pain]; with [offer] + [angle] we'll hit
    [positive-reply %] and [N] meetings in [timeframe]."
   Kill criteria:                          ____
```

---

## 10. 90-Day Rollout & Operating Cadence

**Days 0–30 — Foundation**
- Stand up infra (domains, mailboxes, auth, warm-up).
- Build the asset library: 3–5 ICP cards, the pain-to-segment matrix, offer
  wrappers, copy skeletons, suppression lists.
- Launch 1–2 *proven-adjacent* segments (highest PROOF score) as 200–300 send tests.

**Days 31–60 — Validate & systematize**
- Read results against benchmarks (Section 8); fix the weakest funnel stage.
- Lock the winners; codify into reusable templates.
- Add 1–2 new coordinates via the matrix engine (one new axis at a time).

**Days 61–90 — Scale**
- Scale volume on validated segments (add domains/mailboxes, not new messages).
- Expand along the highest-PROOF axis (geo or adjacent industry).
- Build the reporting rhythm:

**Operating cadence**
- **Daily:** deliverability health (bounce/spam/reply), reply triage & speed-to-lead.
- **Weekly:** funnel metrics per campaign, one test concluded + one launched.
- **Monthly:** re-score the matrix (Section 1), retire losers, open the next
  highest-PROOF coordinate, update the pain-to-segment matrix with new wins.

---

## 11. Quick-Reference: the four layers in one line each

- **List Logic** — *the right person, provably reachable now* (ICP card + trigger +
  verified data + tiering + geo/compliance).
- **Pain Logic** — *what it costs them personally* (surface → business → personal,
  mapped per segment, SaaS ≠ non-SaaS).
- **Offer Logic** — *a no-brainer, de-risked yes* (value equation + guarantee ladder
  + segment-specific dream outcome).
- **Copy Logic** — *relevant, human, one idea, one CTA* (sequence + personalization
  tier + PAS skeleton + deliverability-safe).

> Build the asset library once. After that, every new outbound — any vertical, any
> industry, any location, any ICP — is a half-day assembly job, not a from-scratch
> rebuild. That is the agency's actual product: the system, not the send.
