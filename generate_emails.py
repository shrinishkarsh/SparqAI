#!/usr/bin/env python3
"""
Generate 3 fully personalized emails per lead for all 1,225 qualified leads.
Output: campaign2_emails_ready.csv
Columns: lead identity + email_1_subject, email_1_body, email_2_subject, email_2_body, email_3_subject, email_3_body
"""

import csv
import random

INPUT  = "/home/user/SparqAI/campaign2_outbound_ready.csv"
OUTPUT = "/home/user/SparqAI/campaign2_emails_ready.csv"

# ── TEMPLATES ─────────────────────────────────────────────────────────────────
# Each template is a dict with subject options + body.
# {{placeholders}} are filled per-lead.

# ── VARIANT A — LEAD LEAKAGE ──────────────────────────────────────────────────

A_EMAIL1_SUBJECTS = [
    "{{company}} — lead follow-up question",
    "how fast does {{company}} follow up on new inquiries",
]

A_EMAIL1_BODY = """\
Hi {{first_name}},

{{personalized_opening}}

Quick question — when a new lead comes in across your locations, what does follow-up look like?

Most multi-location fitness businesses we talk to have the same gap: leads come in from ads, referrals, and walk-ins, but by the time someone follows up, the prospect has already moved on or signed somewhere else.

At {{branch_count}} locations, that adds up fast.

We build internal lead management systems for fitness businesses — auto follow-up, lead tracking across branches, and visibility into where inquiries are dropping off. Built to your workflow, not a generic CRM.

{{cta}}

[Sender Name]
Think Macro\
"""

A_EMAIL2_SUBJECTS = [
    "the 1-hour rule in fitness",
    "re: {{company}}",
]

A_EMAIL2_BODY = """\
Hi {{first_name}},

Leads contacted within the first hour are 7x more likely to convert than those contacted after.

Across {{branch_count}} locations, without a system centralising all inquiries and triggering auto follow-up — that window closes constantly.

The pattern we see most:
- Leads come in through different channels at different locations
- Someone manually checks and responds when they get to it
- A portion of those prospects have already signed somewhere else

We fixed this for a gym chain by building a single lead inbox with auto-sequenced follow-ups by location. Conversion on new inquiries went up in the first 30 days.

Worth a 20-minute call to walk through what that could look like for {{company}}?

[Sender Name]
Think Macro\
"""

A_EMAIL3_SUBJECTS = [
    "what the build looked like",
    "{{first_name}} — one specific example",
]

A_EMAIL3_BODY = """\
Hi {{first_name}},

We recently built an internal lead management system for a multi-location fitness business. The brief was simple: no lead should ever fall through the cracks again.

What we built:
- Central lead intake from all channels and all locations
- Auto follow-up sequences triggered within minutes of inquiry
- Owner dashboard showing lead volume, response time, and conversion by branch

The ops team stopped managing leads manually. The owner stopped guessing which locations were underperforming on new member sign-ups.

If {{company}} is running anything manual across your {{branch_count}} locations right now — spreadsheets, shared inboxes, WhatsApp — there's likely a version of this worth building for you.

{{cta}}

[Sender Name]
Think Macro\
"""

# ── VARIANT B — RENEWAL & RETENTION ──────────────────────────────────────────

B_EMAIL1_SUBJECTS = [
    "the quiet revenue leak at {{company}}",
    "membership renewals at {{branch_count}} locations",
]

B_EMAIL1_BODY = """\
Hi {{first_name}},

{{personalized_opening}}

Here's the thing about membership churn in fitness — most of it is avoidable. Members don't leave because they hate the gym. They leave because no one reached out at the right moment.

Across {{branch_count}} locations, without a system tracking renewal dates and triggering outreach automatically, a portion of your recurring revenue quietly disappears every month.

We build internal renewal automation systems for fitness businesses — member renewal tracking, automated outreach sequences, and lapse alerts by location. Built for how your business works, not a generic tool.

{{cta}}

[Sender Name]
Think Macro\
"""

B_EMAIL2_SUBJECTS = [
    "the renewal math at scale",
    "re: {{company}}",
]

B_EMAIL2_BODY = """\
Hi {{first_name}},

A simple way to think about this:

If {{company}} has 500 active members across locations and 5% lapse quietly each month without any system catching them — that's 25 members a month, 300 a year, gone without a nudge.

At even $80/month average membership, that's $24,000 in annual recurring revenue leaking out with no visibility.

The fix isn't complicated. A renewal tracking system that flags upcoming lapses, triggers personalised outreach automatically, and gives you a dashboard of retention health by location.

We built exactly this for a multi-location fitness business. They recovered renewal revenue in the first quarter that covered the cost of the entire build.

Worth a quick call to see what this looks like for {{company}}?

[Sender Name]
Think Macro\
"""

B_EMAIL3_SUBJECTS = [
    "what we built — renewal system",
    "{{first_name}} — the retention build",
]

B_EMAIL3_BODY = """\
Hi {{first_name}},

A specific example that might be useful:

We built a member renewal and retention system for a fitness business losing members quietly across multiple locations. No one had visibility into who was at risk until they'd already left.

What we built:
- Renewal calendar synced across all branches
- Automated outreach triggered 30, 14, and 3 days before lapse date
- Win-back sequence for lapsed members
- Retention dashboard showing at-risk members by location in real time

The team stopped chasing renewals manually. The owner had full retention visibility across every location for the first time.

If {{company}} is managing renewals manually across {{branch_count}} locations right now, there's a version of this worth building.

{{cta}}

[Sender Name]
Think Macro\
"""

# ── VARIANT C — OPERATIONS & VISIBILITY ──────────────────────────────────────

C_EMAIL1_SUBJECTS = [
    "operations across {{branch_count}} locations",
    "{{company}} — branch visibility question",
]

C_EMAIL1_BODY = """\
Hi {{first_name}},

{{personalized_opening}}

At {{branch_count}} locations, there's usually a point where operations stop scaling with you. The things that worked at 2 locations — shared spreadsheets, group chats, manual reporting — start creating friction at 5, 10, 15.

The specific things that tend to break:
- Trainer scheduling done manually, creating gaps and conflicts
- No single view of performance across branches
- Owners spending hours pulling reports instead of reading them

We build internal operations systems for fitness businesses at exactly this stage — branch dashboards, scheduling tools, reporting that updates itself. All built to how your business actually runs.

{{cta}}

[Sender Name]
Think Macro\
"""

C_EMAIL2_SUBJECTS = [
    "the scaling problem in fitness ops",
    "re: {{company}}",
]

C_EMAIL2_BODY = """\
Hi {{first_name}},

The pattern we see in most multi-location fitness businesses at your stage:

- Scheduling: trainer and class schedules managed location by location, manually. Gaps and double-bookings happen. Staff friction builds.
- Reporting: each location reports separately. You're consolidating manually or not at all.
- Visibility: you find out a location is underperforming weeks after the fact, not in real time.

None of this is a people problem. It's a systems problem — and it has a straightforward fix.

We built an internal ops system for a fitness chain dealing with exactly this. Scheduling, branch dashboards, and automated reporting in one place. The owner went from spending half a day on ops to 30 minutes.

Open to a 20-minute call to see if there's a fit for {{company}}?

[Sender Name]
Think Macro\
"""

C_EMAIL3_SUBJECTS = [
    "what we built — operations system",
    "{{first_name}} — the ops build",
]

C_EMAIL3_BODY = """\
Hi {{first_name}},

One specific build that might be relevant to {{company}}:

We built an internal operations system for a multi-location fitness business that had outgrown its manual processes. They had the locations, the members, the trainers — but no central system holding it together.

What we built:
- Trainer and class scheduling system across all branches
- Live branch performance dashboard — revenue, attendance, member activity
- Automated daily and weekly ops reports sent to the owner
- Staff coordination tools replacing WhatsApp threads and spreadsheets

The ops overhead dropped significantly. The owner had real-time visibility across every location for the first time.

If {{company}} is running anything manual across {{branch_count}} locations right now, this is worth a conversation.

{{cta}}

[Sender Name]
Think Macro\
"""

# ── ROUTING ───────────────────────────────────────────────────────────────────

VARIANTS = {
    "A": {
        "subjects": [A_EMAIL1_SUBJECTS, A_EMAIL2_SUBJECTS, A_EMAIL3_SUBJECTS],
        "bodies":   [A_EMAIL1_BODY,     A_EMAIL2_BODY,     A_EMAIL3_BODY],
    },
    "B": {
        "subjects": [B_EMAIL1_SUBJECTS, B_EMAIL2_SUBJECTS, B_EMAIL3_SUBJECTS],
        "bodies":   [B_EMAIL1_BODY,     B_EMAIL2_BODY,     B_EMAIL3_BODY],
    },
    "C": {
        "subjects": [C_EMAIL1_SUBJECTS, C_EMAIL2_SUBJECTS, C_EMAIL3_SUBJECTS],
        "bodies":   [C_EMAIL1_BODY,     C_EMAIL2_BODY,     C_EMAIL3_BODY],
    },
}

def route_variant(primary_pain):
    if primary_pain == "Lead Leakage":
        return "A"
    if primary_pain == "Renewal Leakage":
        return "B"
    return "C"  # Scheduling Chaos, No Branch Visibility

def fill(template, row):
    return (template
        .replace("{{first_name}}", row["first_name"])
        .replace("{{company}}", row["company"])
        .replace("{{branch_count}}", row["branch_count"])
        .replace("{{personalized_opening}}", row["personalized_opening"])
        .replace("{{cta}}", row["cta"])
    )

# ── MAIN ──────────────────────────────────────────────────────────────────────

OUTPUT_COLS = [
    "first_name", "last_name", "title", "company", "website", "email", "linkedin",
    "company_type", "branch_count", "employee_count",
    "primary_pain", "secondary_pain",
    "revenue_leakage_score", "ops_complexity_score", "lead_priority_score",
    "tech_stack", "instagram_handle",
    "variant",
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

    out = {col: row.get(col, "") for col in OUTPUT_COLS if col in row}
    out["variant"] = variant

    for i in range(3):
        # Pick subject — alternate A/B across leads for split testing
        subject_options = v["subjects"][i]
        subject = subject_options[variant_counts[variant] % len(subject_options)]
        body = v["bodies"][i]

        out[f"email_{i+1}_subject"] = fill(subject, row)
        out[f"email_{i+1}_body"]    = fill(body, row)

    output_rows.append(out)

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=OUTPUT_COLS)
    writer.writeheader()
    writer.writerows(output_rows)

print(f"\nVariant breakdown:")
for v, count in variant_counts.items():
    print(f"  Variant {v}: {count} leads")
print(f"\nOutput written: {OUTPUT}")
print(f"Total emails generated: {len(output_rows) * 3:,}")
