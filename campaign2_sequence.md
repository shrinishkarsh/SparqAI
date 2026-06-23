# Campaign 2 — Outbound Email Sequence
## Internal Operations Tools for Gym Chains & Fitness Businesses

**Target:** Multi-location fitness operators (gyms, pilates, yoga, fitness studios)
**Sender:** Think Macro / Sparq
**Sequence length:** 4 emails + LinkedIn touchpoint
**Send cadence:** Day 1 → Day 4 → Day 8 → Day 14

---

## SEGMENT ROUTING

Route by `primary_pain` column in `campaign2_outbound_ready.csv`:

| primary_pain | Variant | Leads | Angle |
|---|---|---|---|
| Lead Leakage | **Variant A** | 677 | Revenue — lost leads = lost money |
| Renewal Leakage | **Variant B** | 40 | Retention — quiet churn kills MRR |
| Scheduling Chaos | **Variant C** | 508 | Ops — manual chaos costs you at scale |
| No Branch Visibility | **Variant C** | 237 | Ops — you can't manage what you can't see |

Use `{{personalized_opening}}` as first line of Email 1.
Use `{{cta}}` as closing line of Email 1 and Email 3.
Use `{{branch_count}}` and `{{company}}` as merge tags throughout.

---
---

## VARIANT A — LEAD LEAKAGE
*Angle: Every missed lead is lost revenue. You're spending on marketing but losing at follow-up.*
*677 leads — primary_pain = Lead Leakage*

---

### A · EMAIL 1 — Day 1

**Subject lines (A/B test 2):**
- `{{company}} — lead follow-up question`
- `how fast does {{company}} follow up on new inquiries`

---

Hi {{first_name}},

{{personalized_opening}}

Quick question — when a new lead comes in across your locations, what does the follow-up look like?

Most multi-location fitness businesses we talk to have the same gap: leads come in from ads, referrals, and walk-ins, but by the time someone follows up, the prospect has moved on or signed somewhere else.

At {{branch_count}} locations, that adds up fast.

We build internal lead management systems for fitness businesses — auto follow-up, lead tracking across branches, and visibility into where inquiries are dropping off. All built to your workflow, not a generic CRM.

{{cta}}

— [Sender Name]
Think Macro

---

### A · EMAIL 2 — Day 4

**Subject lines:**
- `the 1-hour rule in fitness`
- `re: {{company}}`

---

Hi {{first_name}},

There's a stat that keeps coming up in fitness: leads contacted within the first hour are 7x more likely to convert than those contacted after.

Across {{branch_count}} locations, without a system centralizing all inquiries and triggering auto follow-up — that window closes constantly.

The typical pattern we see:
- Leads come in through different channels at different locations
- Someone manually checks and responds — when they get to it
- A chunk of those prospects have already signed somewhere else

We fixed this for a gym chain by building a single lead inbox with auto-sequenced follow-ups by location. Conversion on new inquiries went up in the first 30 days.

Worth a 20-minute call to walk through what that could look like for {{company}}?

— [Sender Name]
Think Macro

---

### A · EMAIL 3 — Day 8

**Subject lines:**
- `what the build looked like`
- `{{first_name}} — one specific example`

---

Hi {{first_name}},

We recently built an internal lead management system for a multi-location fitness business. The brief was simple: no lead should ever fall through the cracks again.

What we built:
- Central lead intake from all channels and all locations
- Auto follow-up sequences triggered within minutes of inquiry
- Owner dashboard showing lead volume, response time, and conversion by branch

The ops team stopped managing leads manually. The owner stopped guessing which locations were underperforming on new members.

If {{company}} is running anything manual across your {{branch_count}} locations right now — spreadsheets, shared inboxes, WhatsApp — there's likely a version of this that's worth building for you.

{{cta}}

— [Sender Name]
Think Macro

---

### A · EMAIL 4 — Day 14 (Break-up)

**Subject lines:**
- `last one from me, {{first_name}}`
- `closing the loop`

---

Hi {{first_name}},

Last message — I know your inbox doesn't need another one.

If lead management isn't the pain point at {{company}} right now, no problem. If it ever is — whether it's response time, branch-level visibility, or just getting out of spreadsheets — we'd love to be the first call.

Before I go: is there a better person to connect with on operations at {{company}}?

— [Sender Name]
Think Macro

---
---

## VARIANT B — RENEWAL & RETENTION
*Angle: Memberships that lapse quietly are the most expensive kind of churn. You don't see it until it's gone.*
*40 leads — primary_pain = Renewal Leakage*

---

### B · EMAIL 1 — Day 1

**Subject lines (A/B test 2):**
- `the quiet revenue leak at {{company}}`
- `membership renewals at {{branch_count}} locations`

---

Hi {{first_name}},

{{personalized_opening}}

Here's the thing about membership churn in fitness — most of it is avoidable. Members don't leave because they hate the gym. They leave because no one reached out at the right moment.

Across {{branch_count}} locations, without a system tracking renewal dates and triggering outreach automatically, a portion of your recurring revenue quietly disappears every month.

We build internal renewal automation systems for fitness businesses — member renewal tracking, automated outreach sequences, and lapse alerts by location. Built for how your business works, not a generic tool.

{{cta}}

— [Sender Name]
Think Macro

---

### B · EMAIL 2 — Day 4

**Subject lines:**
- `the renewal math at scale`
- `re: {{company}}`

---

Hi {{first_name}},

A simple way to think about this:

If {{company}} has 500 active members across locations and 5% lapse quietly each month without any system catching them — that's 25 members a month, 300 a year, gone without a nudge.

At even $80/month average, that's $24,000 in annual recurring revenue leaking out with no visibility.

The fix isn't complicated. It's a renewal tracking system that flags upcoming lapses, triggers personalized outreach automatically, and gives you a dashboard of retention health by location.

We built exactly this for a multi-location fitness business. They recovered renewal revenue in the first quarter that covered the cost of the build.

Worth a quick call to see what this looks like for {{company}}?

— [Sender Name]
Think Macro

---

### B · EMAIL 3 — Day 8

**Subject lines:**
- `what we built — renewal system`
- `{{first_name}} — the retention build`

---

Hi {{first_name}},

Specific example that might be useful:

We built a member renewal and retention system for a fitness business that was losing members quietly across multiple locations. No one had visibility into who was at risk until they'd already left.

What we built:
- Renewal calendar synced across all branches
- Automated outreach triggered 30, 14, and 3 days before lapse date
- Win-back sequence for lapsed members
- Retention dashboard showing at-risk members by location in real time

The team stopped chasing renewals manually. The owner could finally see retention health across every location in one view.

If {{company}} is managing renewals manually across {{branch_count}} locations right now, there's a version of this worth building.

{{cta}}

— [Sender Name]
Think Macro

---

### B · EMAIL 4 — Day 14 (Break-up)

**Subject lines:**
- `leaving this here, {{first_name}}`
- `last one from me`

---

Hi {{first_name}},

Last one from me on this.

If member retention isn't the priority right now at {{company}}, completely understood. If it ever becomes one — renewals, lapse automation, branch-level visibility — we'd love to be the first call.

One question before I go: what's the biggest operational challenge you're dealing with at {{company}} right now?

— [Sender Name]
Think Macro

---
---

## VARIANT C — OPERATIONS & VISIBILITY
*Angle: At a certain number of locations, manual operations become the ceiling. You can't grow what you can't see.*
*745 leads — primary_pain = Scheduling Chaos OR No Branch Visibility*

---

### C · EMAIL 1 — Day 1

**Subject lines (A/B test 2):**
- `operations across {{branch_count}} locations`
- `{{company}} — branch visibility question`

---

Hi {{first_name}},

{{personalized_opening}}

At {{branch_count}} locations, there's usually a point where operations stop scaling with you. The things that worked at 2 locations — shared spreadsheets, group chats, manual reporting — start creating friction at 5, 10, 15.

The specific things that tend to break:
- Trainer scheduling done manually, creating gaps and conflicts
- No single view of what's happening across branches
- The owner spending hours pulling reports instead of reading them

We build internal operations systems for fitness businesses at exactly this stage. Branch dashboards, scheduling tools, reporting that updates itself. All built to how your business actually runs.

{{cta}}

— [Sender Name]
Think Macro

---

### C · EMAIL 2 — Day 4

**Subject lines:**
- `the scaling problem in fitness ops`
- `re: {{company}}`

---

Hi {{first_name}},

Following up briefly.

The pattern we see in most multi-location fitness businesses at your stage:

- **Scheduling:** Trainer and class schedules managed location by location, manually. Gaps and double-bookings happen. Staff friction builds.
- **Reporting:** Each location reports separately. You're consolidating manually or not at all.
- **Visibility:** You find out a location is underperforming weeks after the fact, not in real time.

None of this is a people problem. It's a systems problem. And it has a straightforward fix.

We built an internal ops system for a fitness chain dealing with exactly this — scheduling, branch dashboards, and automated reporting in one place. The owner went from spending half a day on ops to 30 minutes.

Open to a 20-minute call to see if there's a fit?

— [Sender Name]
Think Macro

---

### C · EMAIL 3 — Day 8

**Subject lines:**
- `what we built — operations system`
- `{{first_name}} — the ops build`

---

Hi {{first_name}},

One specific build that might be relevant to {{company}}:

We built an internal operations system for a multi-location fitness business that had outgrown its manual processes. They had the locations, the members, the trainers — but no central system holding it all together.

What we built:
- Trainer and class scheduling system across all branches
- Live branch performance dashboard — revenue, attendance, member activity
- Automated daily/weekly ops reports sent to the owner
- Staff coordination tools replacing WhatsApp threads and spreadsheets

The ops overhead dropped significantly. The owner had real-time visibility across every location for the first time.

If {{company}} is running anything manual across {{branch_count}} locations right now, this is likely worth a conversation.

{{cta}}

— [Sender Name]
Think Macro

---

### C · EMAIL 4 — Day 14 (Break-up)

**Subject lines:**
- `last one, {{first_name}}`
- `closing the loop on {{company}}`

---

Hi {{first_name}},

Last message from me.

If operations visibility isn't a priority right now at {{company}}, all good. If it ever becomes one — scheduling, branch dashboards, reporting — we'd love to be the first call.

Before I go: what does day-to-day operations management look like across your locations right now?

No pitch. Genuinely curious.

— [Sender Name]
Think Macro

---
---

## LINKEDIN TOUCHPOINT
*Send on Day 6 (between Email 2 and Email 3) to leads who opened but didn't reply*

### Connection Request Note (300 chars max)

> Hi {{first_name}} — noticed {{company}} operates across {{branch_count}} locations. We build internal ops systems for fitness businesses — lead tracking, renewals, scheduling, branch dashboards. Thought it might be relevant. Would love to connect.

---

### Message After Connection (variant-matched)

**Variant A (Lead Leakage):**
> Thanks for connecting, {{first_name}}. We recently built an internal lead management system for a multi-location fitness business — central lead inbox, auto follow-up by location, conversion dashboard. If that's relevant to {{company}}, happy to share what it looked like. Worth a quick chat?

**Variant B (Renewal):**
> Thanks for connecting, {{first_name}}. We built a member renewal automation system for a fitness chain — renewal tracking, automated outreach, retention dashboard across all branches. If {{company}} is managing renewals manually right now, might be worth 20 minutes. Interested?

**Variant C (Ops/Visibility):**
> Thanks for connecting, {{first_name}}. We built an internal ops system for a multi-location fitness business — scheduling, branch dashboards, automated reporting. Replaced a lot of manual work. If {{company}} is at that stage, might be worth a quick conversation.

---
---

## COPY RULES (DO NOT VIOLATE)

- Never say: APIs, databases, backend, engineering, architecture, code, software platform, SaaS
- Always say: "internal system", "custom tool", "we build it for you", "built to your workflow"
- Pain first — solution second — proof third — CTA last
- One CTA per email, never two
- Emails 1–2: under 120 words
- Email 3: up to 200 words (proof email)
- Email 4: under 80 words (break-up)
- Subject lines: lowercase, max 6 words, no exclamation marks

---

## FULL ROUTING SUMMARY

```
primary_pain = "Lead Leakage"         →  Variant A  (677 leads)
primary_pain = "Renewal Leakage"      →  Variant B  (40 leads)
primary_pain = "Scheduling Chaos"     →  Variant C  (508 leads)
primary_pain = "No Branch Visibility" →  Variant C  (237 leads)
```

Merge tags to pull from CSV:
- `{{first_name}}` → `first_name`
- `{{company}}` → `company`
- `{{branch_count}}` → `branch_count`
- `{{personalized_opening}}` → `personalized_opening`
- `{{cta}}` → `cta`
