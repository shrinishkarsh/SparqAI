#!/usr/bin/env python3
"""
Generate 3 fully personalized emails per lead for all 1,225 qualified leads.
Rules:
  - No hyphens, no em dashes, free flowing prose throughout
  - Email 1: free offer hook (Revenue Leakage Audit), CTA is just "say yes"
  - Email 2: pain story and follow up
  - Email 3: case study proof
"""

import csv
import re
import hashlib

INPUT  = "/home/user/SparqAI/campaign2_outbound_ready.csv"
OUTPUT = "/home/user/SparqAI/campaign2_emails_ready.csv"


# ── HELPERS ───────────────────────────────────────────────────────────────────

def seed(row):
    return int(hashlib.md5(row["email"].encode()).hexdigest(), 16)

def extract_desc_hook(desc):
    desc = desc.strip()
    if not desc or desc == "...":
        return ""
    sentences = re.split(r'(?<=[.!?])\s+', desc)
    for s in sentences[:3]:
        s = s.strip()
        if len(s) < 30 or len(s) > 160:
            continue
        bad = ["http", "www.", "©", "follow us", "click", "visit", "call us", "contact"]
        if any(b in s.lower() for b in bad):
            continue
        return s
    return ""


# ── PERSONALIZED OPENING GENERATOR ───────────────────────────────────────────

def generate_opening(row):
    company      = row["company"]
    company_type = row["company_type"]
    branches     = row["branch_count"]
    emp          = row["employee_count"]
    franchise    = row["franchise_or_owned"]
    tech         = row["tech_stack"]
    ig           = row["instagram_handle"]
    ig_followers = row["instagram_followers"]
    desc         = row["company_description"]

    b = int(branches)
    e = int(emp) if emp else 0
    desc_hook = extract_desc_hook(desc)

    options = []

    # Branch count
    if b >= 20:
        options += [
            f"Came across {company} and running {b} locations is no small thing operationally.",
            f"{b} locations is a serious footprint. Most {company_type}s at that scale have outgrown their manual systems by now.",
            f"Noticed {company} has scaled to {b} locations and at that size the operational overhead tends to become its own full time challenge.",
        ]
    elif b >= 10:
        options += [
            f"Noticed {company} operating across {b} locations and that is the stage where operations either scale with you or start slowing you down.",
            f"{b} locations puts {company} at the point where most fitness businesses need better internal systems not more people.",
            f"Came across {company} and {b} locations is exactly the scale where centralised ops tools start paying for themselves.",
        ]
    elif b >= 5:
        options += [
            f"Noticed {company} running {b} locations and growing {company_type}s at your stage tend to hit the same operational friction points.",
            f"Came across {company} and at {b} locations the things that worked at 2 tend to start breaking down.",
            f"{b} locations is a meaningful operation. Most {company_type}s at this stage are still running things manually across branches.",
        ]
    else:
        options += [
            f"Came across {company} and even at {b} locations the gap between how operations run today and how they could run is usually bigger than expected.",
            f"Noticed {company} and growing {company_type}s at your stage tend to hit some common operational friction points early.",
            f"Came across {company} and multi location {company_type}s often underestimate how much revenue slips through the cracks operationally.",
        ]

    # Company type
    if company_type == "pilates chain":
        options += [
            f"Noticed {company} and multi location pilates businesses have some of the highest scheduling and renewal complexity in the fitness space.",
            f"Came across {company} and pilates chains at your scale typically deal with a lot of manual scheduling and membership tracking across studios.",
        ]
    elif company_type == "yoga chain":
        options += [
            f"Came across {company} and yoga studios with multiple locations tend to run a surprising amount of their operations manually.",
            f"Noticed {company} and multi location yoga businesses often have strong brand but under systemised operations behind the scenes.",
        ]
    elif company_type == "gym chain":
        options += [
            f"Noticed {company} and gym chains at your scale are often managing more operational complexity than their systems were built for.",
            f"Came across {company} and most gym chains we work with at your stage are dealing with the same thing where locations grow faster than the internal tools.",
        ]
    elif company_type == "wellness center":
        options += [
            f"Came across {company} and wellness centers with multiple locations tend to have a lot of moving parts that are not talking to each other.",
            f"Noticed {company} and multi location wellness businesses usually have the hardest time getting visibility across branches.",
        ]
    else:
        options += [
            f"Came across {company} and boutique fitness studios at your stage often have great product but manual operations holding back growth.",
            f"Noticed {company} and multi location fitness studios tend to outgrow their tools faster than most businesses realise.",
        ]

    # Franchise
    if "franchise" in franchise.lower():
        options += [
            f"Noticed {company} and franchise operations at your scale have unique visibility and reporting challenges across locations.",
            f"Came across {company} and franchise fitness businesses tend to have the most to gain from centralised ops systems.",
        ]

    # Tech stack
    if tech and "manual" not in tech.lower() and "unknown" not in tech.lower():
        tools = tech.split(",")[0].strip()
        options += [
            f"Noticed {company} is using {tools} and businesses at your stage often find their software stack covers some gaps but leaves others wide open.",
            f"Came across {company} and even with {tools} in place most multi location operators still carry significant manual ops gaps across branches.",
        ]

    # Instagram
    if ig and ig_followers and "N/A" not in ig_followers:
        options += [
            f"Came across {company} on Instagram ({ig}) and you are clearly doing a great job building the brand. Thought it was worth reaching out about the operations side.",
        ]

    # Description hook — only use complete sentences
    if desc_hook:
        if any(w in desc_hook.lower() for w in ["founded", "since", "location", "year", "open", "member", "client", "program", "service"]):
            # Only use if desc_hook is a complete sentence (ends in period or is short enough)
            clean_hook = desc_hook.strip().rstrip(",")
            if not clean_hook.endswith("."):
                clean_hook = clean_hook + "."
            if len(clean_hook) <= 160:
                options += [
                    f"Read a bit about {company}. {clean_hook} That kind of growth usually comes with real operational complexity behind the scenes.",
                ]

    # Employee count
    if e >= 100:
        options += [
            f"Noticed {company} has a team of {e} people and at that headcount across multiple locations manual ops coordination gets expensive fast.",
        ]

    # Fallback
    if not options:
        options = [
            f"Came across {company} and thought this might be relevant given where you are in the growth curve.",
            f"Noticed {company} and wanted to reach out because we work specifically with multi location {company_type}s on operational complexity.",
        ]

    idx = seed(row) % len(options)
    return options[idx]


# ── TEMPLATES ─────────────────────────────────────────────────────────────────
# No hyphens. No em dashes. Free flowing prose. Bullets replaced with sentences.
# Email 1 CTA: just say yes, no call ask.
# ──────────────────────────────────────────────────────────────────────────────


# VARIANT A  —  LEAD LEAKAGE

A_E1_SUBJECTS = [
    "free audit for {{company}}",
    "{{first_name}} quick question on leads",
    "where {{company}} might be losing new members",
]

A_E1_BODY = """\
Hi {{first_name}},

{{opening}}

We put together a free Revenue Leakage Audit specifically for multi location fitness businesses. It is a short written breakdown we put together for you that maps where leads are dropping off across your locations and what it is likely costing each month.

No call needed. No pitch. We just share it with you and you decide what to do with it.

The one thing we look at specifically is how fast and consistently new inquiries across your {{branch_count}} locations are being followed up. Leads that are not contacted within the first hour are seven times less likely to convert and at {{branch_count}} locations that window closes a lot.

If you want us to put one together for {{company}} just say yes and we will get started.

[Sender Name]
Think Macro\
"""

A_E2_SUBJECTS = [
    "the one hour rule in fitness",
    "re {{company}}",
    "what we see at {{branch_count}} locations",
]

A_E2_BODY = """\
Hi {{first_name}},

Following up on the audit offer.

Here is what we almost always find in multi location fitness businesses at your stage. Leads come in through different channels at different locations. Someone manually checks and responds when they get to it. A portion of those prospects have already signed somewhere else by then.

At {{branch_count}} locations with no centralised system that window closes constantly and no one has visibility into how much it is costing.

We fixed this for a gym chain by building a single lead inbox with auto sequenced follow ups by location. Conversion on new inquiries went up in the first 30 days.

The audit is free and we send it to you in writing. Still want it?

[Sender Name]
Think Macro\
"""

A_E3_SUBJECTS = [
    "what we built for a similar business",
    "{{first_name}} one specific example",
    "the lead system we built",
]

A_E3_BODY = """\
Hi {{first_name}},

One more and I will leave you alone.

We recently built an internal lead management system for a multi location fitness business. The brief was simple. No lead should ever fall through the cracks again.

We built a central lead intake that pulled from all channels and all locations. We set up auto follow up sequences that triggered within minutes of each inquiry. We gave the owner a single dashboard showing lead volume, response time and conversion by branch.

The ops team stopped managing leads manually. The owner stopped guessing which locations were underperforming on new sign ups.

If {{company}} is still running lead follow up manually across your {{branch_count}} locations there is likely a version of this worth building for you.

Interested in seeing the full breakdown?

[Sender Name]
Think Macro\
"""


# VARIANT B  —  RENEWAL & RETENTION

B_E1_SUBJECTS = [
    "free audit for {{company}}",
    "{{first_name}} the quiet revenue leak",
    "where {{company}} might be losing recurring revenue",
]

B_E1_BODY = """\
Hi {{first_name}},

{{opening}}

We put together a free Revenue Leakage Audit specifically for multi location fitness businesses. It is a short written breakdown we put together for you that maps exactly where recurring revenue is slipping through and what it is likely costing each month.

No call needed. No pitch. We just share it with you and you decide what to do with it.

The thing we look at specifically is how many members are lapsing each month across your {{branch_count}} locations without any automated system catching them. In fitness most churn is not intentional. Members just did not get nudged at the right moment.

If you want us to put one together for {{company}} just say yes and we will get started.

[Sender Name]
Think Macro\
"""

B_E2_SUBJECTS = [
    "the renewal math at scale",
    "re {{company}}",
    "what we find in most retention audits",
]

B_E2_BODY = """\
Hi {{first_name}},

Following up on the audit offer.

Here is a simple way to think about what it usually surfaces. If {{company}} has 500 active members across locations and just 5 percent lapse quietly each month without any system catching them that is 25 members a month and 300 a year gone without a nudge.

At even 80 dollars a month average membership that is 24000 dollars in annual recurring revenue leaking out with no visibility.

The fix is not complicated. A renewal tracking system that flags upcoming lapses, triggers personalised outreach automatically and gives a real time retention dashboard by location.

We built exactly this for a multi location fitness business. They recovered renewal revenue in the first quarter that covered the cost of the entire build.

Still want the free audit sent through?

[Sender Name]
Think Macro\
"""

B_E3_SUBJECTS = [
    "what we built for a similar business",
    "{{first_name}} the renewal build",
    "one specific example for {{company}}",
]

B_E3_BODY = """\
Hi {{first_name}},

Last one from me.

We built a member renewal and retention system for a fitness business losing members quietly across multiple locations. No one had visibility into who was at risk until they had already left.

We built a renewal calendar synced across all branches. We set up automated outreach that triggered 30, 14 and 3 days before each lapse date. We added a win back sequence for members who had already gone and gave the owner a retention dashboard showing at risk members by location in real time.

The team stopped chasing renewals manually. The owner had full visibility across every location for the first time.

If {{company}} is managing renewals manually across {{branch_count}} locations right now there is a version of this worth building.

Want us to send you the full breakdown?

[Sender Name]
Think Macro\
"""


# VARIANT C  —  OPERATIONS & VISIBILITY

C_E1_SUBJECTS = [
    "free ops audit for {{company}}",
    "{{first_name}} operations across {{branch_count}} locations",
    "where {{company}} ops might be leaking revenue",
]

C_E1_BODY = """\
Hi {{first_name}},

{{opening}}

We put together a free Revenue Leakage Audit specifically for multi location fitness businesses. It is a short written breakdown we put together for you that maps where manual processes are costing you time and revenue across branches and what it is likely adding up to each month.

No call needed. No pitch. We just share it with you and you decide what to do with it.

The things we look at are scheduling gaps across locations, reporting that still requires manual consolidation and blind spots in branch performance that only show up weeks after the fact.

If you want us to put one together for {{company}} just say yes and we will get started.

[Sender Name]
Think Macro\
"""

C_E2_SUBJECTS = [
    "the ops scaling problem",
    "re {{company}}",
    "what breaks at {{branch_count}} locations",
]

C_E2_BODY = """\
Hi {{first_name}},

Following up on the audit offer.

Here is the pattern we see in most multi location fitness businesses at your stage. Trainer and class schedules are managed location by location manually so gaps and double bookings happen and staff friction builds. Each location reports separately so you are consolidating manually or not at all. And performance problems at a branch only surface weeks after the fact not in real time.

None of this is a people problem. It is a systems problem and it has a straightforward fix.

We built an internal ops system for a fitness chain dealing with exactly this. Scheduling, branch dashboards and automated reporting all in one place. The owner went from spending half a day on ops to 30 minutes.

The audit is free and we send it in writing. Still want it?

[Sender Name]
Think Macro\
"""

C_E3_SUBJECTS = [
    "what we built for a similar business",
    "{{first_name}} one specific example",
    "the build that might be relevant to {{company}}",
]

C_E3_BODY = """\
Hi {{first_name}},

Last one from me.

We built an internal operations system for a multi location fitness business that had outgrown its manual processes. They had the locations, the members and the trainers but no central system holding it all together.

We built a trainer and class scheduling system across all branches. We set up a live branch performance dashboard showing revenue, attendance and member activity in real time. We automated daily and weekly ops reports sent straight to the owner. We replaced the WhatsApp threads and spreadsheets with proper staff coordination tools.

The ops overhead dropped significantly. The owner had real time visibility across every location for the first time.

If {{company}} is running anything manually across {{branch_count}} locations right now this is worth a conversation.

Want us to send you the full breakdown?

[Sender Name]
Think Macro\
"""


# ── ROUTING ───────────────────────────────────────────────────────────────────

VARIANTS = {
    "A": {
        "subjects": [A_E1_SUBJECTS, A_E2_SUBJECTS, A_E3_SUBJECTS],
        "bodies":   [A_E1_BODY,     A_E2_BODY,     A_E3_BODY],
    },
    "B": {
        "subjects": [B_E1_SUBJECTS, B_E2_SUBJECTS, B_E3_SUBJECTS],
        "bodies":   [B_E1_BODY,     B_E2_BODY,     B_E3_BODY],
    },
    "C": {
        "subjects": [C_E1_SUBJECTS, C_E2_SUBJECTS, C_E3_SUBJECTS],
        "bodies":   [C_E1_BODY,     C_E2_BODY,     C_E3_BODY],
    },
}

def route_variant(primary_pain):
    if primary_pain == "Lead Leakage":
        return "A"
    if primary_pain == "Renewal Leakage":
        return "B"
    return "C"

def fill(template, row, opening):
    return (template
        .replace("{{first_name}}",   row["first_name"])
        .replace("{{company}}",      row["company"])
        .replace("{{branch_count}}", row["branch_count"])
        .replace("{{opening}}",      opening)
        .replace("{{cta}}",          row["cta"])
    )


# ── MAIN ──────────────────────────────────────────────────────────────────────

OUTPUT_COLS = [
    "first_name", "last_name", "title", "company", "website", "email", "linkedin",
    "company_type", "branch_count", "employee_count",
    "primary_pain", "secondary_pain",
    "revenue_leakage_score", "ops_complexity_score", "lead_priority_score",
    "tech_stack", "instagram_handle",
    "variant",
    "personalized_opening",
    "email_1_subject", "email_1_body",
    "email_2_subject", "email_2_body",
    "email_3_subject", "email_3_body",
]

with open(INPUT, newline="", encoding="utf-8") as f:
    leads = list(csv.DictReader(f))

print(f"Processing {len(leads)} leads...")

variant_counts = {"A": 0, "B": 0, "C": 0}
output_rows = []

for row in leads:
    variant = route_variant(row["primary_pain"])
    variant_counts[variant] += 1
    v = VARIANTS[variant]

    opening = generate_opening(row)
    s = seed(row)

    out = {col: row.get(col, "") for col in OUTPUT_COLS if col in row}
    out["variant"] = variant
    out["personalized_opening"] = opening

    for i in range(3):
        subj_opts = v["subjects"][i]
        subj = subj_opts[s % len(subj_opts)]
        body = v["bodies"][i]
        out[f"email_{i+1}_subject"] = fill(subj, row, opening)
        out[f"email_{i+1}_body"]    = fill(body, row, opening)

    output_rows.append(out)

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=OUTPUT_COLS)
    writer.writeheader()
    writer.writerows(output_rows)

print(f"\nVariant breakdown:")
for v, c in variant_counts.items():
    print(f"  Variant {v}: {c} leads")
print(f"\nOutput: {OUTPUT}")
print(f"Total emails generated: {len(output_rows) * 3:,}")
