#!/usr/bin/env python3
"""
GTM Lead Processing Script — Campaign 2: Internal Operations Tools for Gym Chains
Transforms raw Prospeo export into outbound-sequence-ready sheet.
"""

import csv
import re
import sys
from pathlib import Path

INPUT_FILE = "/root/.claude/uploads/6e5381e7-7eb3-5381-8acf-f90d402f2e69/799280ad-Gym_prospeo_person_export_20260618_151035_e11b5c.csv"
OUTPUT_FILE = "/home/user/SparqAI/campaign2_outbound_ready.csv"

# ── CONSTANTS ──────────────────────────────────────────────────────────────────

PERSONAL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "yahoo.co.uk", "hotmail.co.uk", "icloud.com", "me.com",
    "live.com", "msn.com", "aol.com", "protonmail.com", "ymail.com",
}

EXCLUDED_TITLES = {
    "trainer", "coach", "receptionist", "sales rep", "sales representative",
    "assistant manager", "front desk", "membership advisor", "membership consultant",
    "class instructor", "yoga instructor", "pilates instructor", "fitness instructor",
    "personal trainer", "group fitness", "group exercise",
}

PREFERRED_SENIORITY = {
    "founder/owner", "c-suite", "director", "vp", "partner", "owner",
    "president", "chairman",
}

PREFERRED_TITLE_KEYWORDS = [
    "founder", "owner", "ceo", "co-founder", "cofounder",
    "regional director", "franchise director", "operations manager",
    "general manager", "gm", "managing director", "managing partner",
    "chief operating officer", "coo", "chief executive",
    "president", "director of operations", "head of operations",
    "vice president", "vp of operations",
]

FITNESS_KEYWORDS = [
    "gym", "fitness", "pilates", "yoga", "wellness center", "wellness studio",
    "crossfit", "boutique fitness", "health club", "athletic club",
    "martial arts", "boxing gym", "cycling studio", "barre studio", "barre class",
    "f45", "orangetheory", "anytime fitness", "planet fitness",
    "crunch fitness", "equinox", "la fitness", "24 hour fitness",
    "dance fitness", "spin studio", "hiit", "group fitness studio",
    "fitness studio", "training studio", "personal training studio",
    "swim club", "aquatic center", "recreation center", "leisure centre",
]

# Keywords that indicate it's NOT a physical fitness business
NON_FITNESS_EXCLUSIONS = [
    "streaming", "video platform", "e-learning", "online education", "edtech",
    "software", "saas", "app developer", "mobile app", "b2b software",
    "dental", "medical", "pharmaceutical", "insurance", "financial",
    "real estate", "construction", "law firm", "legal",
    "family solutions", "behavioral", "mental health clinic",
    "pool management", "playground", "landscape", "play equipment",
    "foundation", "non-profit sports foundation", "hockey team", "hockey club",
    "golf club", "canoe club", "showgrounds", "fair", "rodeo",
    "corporate wellness company", "wellness technology", "wellness management company",
    "kinesiology tape", "cbd", "supplement",
    "national governing body", "governing body", "national federation", "national association",
    "provincial federation", "regional federation", "sports association", "sports federation",
    "equipment brand", "equipment supplier", "equipment manufacturer",
    "media", "publishing", "magazine", "content creator",
]

FITNESS_INDUSTRIES = [
    "wellness and fitness services",
    "recreational facilities",
    "health, wellness and fitness",
    "sports",
]

MINDBODY_KEYWORDS = ["mindbody", "mind body"]
ZEN_PLANNER_KEYWORDS = ["zen planner", "zenplanner"]
GLOFOX_KEYWORDS = ["glofox"]
WELLNESS_LIVING_KEYWORDS = ["wellnessliving", "wellness living"]
HUBSPOT_KEYWORDS = ["hubspot"]
SALESFORCE_KEYWORDS = ["salesforce"]

OUTPUT_COLUMNS = [
    "first_name", "last_name", "title", "company", "website", "email", "linkedin",
    "company_description", "company_type", "employee_count", "branch_count",
    "pricing_tier", "franchise_or_owned",
    "ops_complexity_score", "revenue_leakage_score",
    "tech_stack",
    "instagram_handle", "instagram_followers", "posting_frequency", "social_activity_score",
    "primary_pain", "secondary_pain", "pain_summary",
    "best_case_study",
    "primary_offer", "secondary_offer",
    "best_copy_angle",
    "personalized_opening",
    "trigger_event",
    "relevant_pain",
    "relevant_offer",
    "case_study_reference",
    "cta",
    "lead_priority_score",
]


# ── HELPERS ────────────────────────────────────────────────────────────────────

def clean(v):
    return (v or "").strip()


def lower(v):
    return clean(v).lower()


def is_personal_email(email):
    email = lower(email)
    if "@" not in email:
        return True
    domain = email.split("@")[-1]
    return domain in PERSONAL_DOMAINS


def is_fitness_company(row):
    industry = lower(row.get("Company industry", ""))
    company = lower(row.get("Company name", ""))
    description = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    comp_type = lower(row.get("Company type", ""))

    text = f"{industry} {company} {description} {keywords}"

    # Hard exclusions first
    if any(excl in text for excl in NON_FITNESS_EXCLUSIONS):
        return False

    # Must match fitness keywords positively
    industry_match = any(ind in industry for ind in FITNESS_INDUSTRIES)
    keyword_match = any(kw in text for kw in FITNESS_KEYWORDS)

    return industry_match and keyword_match


def is_decision_maker(row):
    title = lower(row.get("Job title", ""))
    seniority = lower(row.get("Job seniority", ""))
    headline = lower(row.get("Person headline", ""))

    # Check seniority field
    if any(s in seniority for s in PREFERRED_SENIORITY):
        return True

    # Check title keywords
    if any(kw in title for kw in PREFERRED_TITLE_KEYWORDS):
        return True

    # Exclude junior titles
    if any(excl in title for excl in EXCLUDED_TITLES):
        return False

    # Headline check
    if any(kw in headline for kw in PREFERRED_TITLE_KEYWORDS):
        return True

    return False


def has_social_presence(row):
    fb = clean(row.get("Company Facebook URL", ""))
    ig = clean(row.get("Company Instagram URL", ""))
    tw = clean(row.get("Company Twitter URL", ""))
    li = clean(row.get("Company LinkedIn URL", ""))
    return any([fb, ig, tw, li])


def infer_company_type(row):
    desc = lower(row.get("Company description", ""))
    name = lower(row.get("Company name", ""))
    keywords = lower(row.get("Company keywords", ""))
    industry = lower(row.get("Company industry", ""))
    text = f"{desc} {name} {keywords} {industry}"

    if any(w in text for w in ["pilates"]):
        return "pilates chain"
    if any(w in text for w in ["yoga"]):
        return "yoga chain"
    if any(w in text for w in ["wellness center", "wellness centre", "wellness clinic"]):
        return "wellness center"
    if any(w in text for w in ["crossfit", "f45", "orangetheory", "barre", "cycling studio", "boutique"]):
        return "fitness studio"
    if any(w in text for w in ["gym chain", "fitness chain", "health club", "gym"]):
        return "gym chain"
    if "fitness" in text or "studio" in text:
        return "fitness studio"
    if "wellness" in text:
        return "wellness center"
    return "fitness studio"


def infer_branch_count(row):
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    name = lower(row.get("Company name", ""))
    emp = int(row.get("Company employee count", 0) or 0)
    text = f"{desc} {keywords} {name}"

    # High-confidence patterns (explicit chain/franchise language)
    chain_patterns = [
        r'\b(\d+)\s*\+?\s*locations?\b',
        r'\b(\d+)\s*\+?\s*studios?\b',
        r'\b(\d+)\s*\+?\s*branches?\b',
        r'\b(\d+)\s*\+?\s*franchise\s*locations?\b',
        r'\bover\s+(\d+)\s*(?:locations?|studios?)\b',
        r'\b(\d+)\s*\+?\s*centres?\b',
        r'\b(\d+)\s*\+?\s*centers?\b',
    ]

    # Lower-confidence patterns (contextual)
    low_conf_patterns = [
        r'\b(\d+)\s*\+?\s*gyms?\b',
        r'\b(\d+)\s*\+?\s*clubs?\b',
    ]

    found_high = []
    for pat in chain_patterns:
        for m in re.finditer(pat, text):
            try:
                val = int(m.group(1))
                if 2 <= val <= 200:  # sanity cap
                    found_high.append(val)
            except Exception:
                pass

    if found_high:
        return max(found_high)

    found_low = []
    for pat in low_conf_patterns:
        for m in re.finditer(pat, text):
            try:
                val = int(m.group(1))
                if 2 <= val <= 50:  # conservative cap for low-confidence
                    found_low.append(val)
            except Exception:
                pass

    if found_low:
        return max(found_low)

    # Multi-location signals
    multi_signals = [
        "nationwide", "across the country", "multiple locations", "multi-location",
        "franchise", "franchis", "national chain",
        "across the uk", "across the us", "coast to coast",
    ]
    if any(s in text for s in multi_signals):
        if emp >= 500:
            return 15
        if emp >= 200:
            return 8
        if emp >= 100:
            return 5
        if emp >= 50:
            return 3
        return 2

    # Infer from employee count
    if emp == 0 or emp == 1:
        return 1
    if emp <= 10:
        return 1
    if emp <= 30:
        return 2
    if emp <= 75:
        return 3
    if emp <= 150:
        return 4
    if emp <= 500:
        return 6
    return 10


def branch_complexity_score(branch_count):
    if branch_count >= 10:
        return 5
    if branch_count >= 6:
        return 4
    if branch_count >= 3:
        return 3
    if branch_count == 2:
        return 2
    return 1


def ops_complexity(row, branch_count):
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    text = f"{desc} {keywords}"
    emp = int(row.get("Company employee count", 0) or 0)

    score = branch_complexity_score(branch_count)

    # Services/classes complexity
    complex_signals = [
        "classes", "trainers", "memberships", "membership", "scheduling",
        "personal training", "group fitness", "nutrition", "spa", "pool",
        "multiple services", "variety of classes",
    ]
    signal_count = sum(1 for s in complex_signals if s in text)
    score = min(5, score + (1 if signal_count >= 3 else 0))

    # Staff size
    if emp >= 100:
        score = min(5, score + 1)
    elif emp >= 50:
        score = min(5, score + 0)

    return max(1, min(5, score))


def revenue_leakage_score(row, branch_count, company_type):
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    text = f"{desc} {keywords}"

    score = 1

    # Multi-branch raises risk
    if branch_count >= 10:
        score += 2
    elif branch_count >= 3:
        score += 1

    # Membership/renewal model
    if any(w in text for w in ["membership", "recurring", "subscription", "renewal", "retain"]):
        score += 1

    # Lead/marketing activity
    if any(w in text for w in ["marketing", "lead", "inquiry", "inquiries", "ads", "advertising"]):
        score += 1

    # Scheduling complexity
    if any(w in text for w in ["scheduling", "schedule", "trainer", "class", "booking", "appointment"]):
        score += 1

    # Fitness type — boutique/studio more leakage-prone
    if company_type in ("gym chain", "pilates chain", "yoga chain", "fitness studio"):
        score = min(5, score + 1)

    return max(1, min(5, score))


def infer_tech_stack(row):
    tech_field = lower(row.get("Company technologies", ""))
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    text = f"{tech_field} {desc} {keywords}"

    techs = []
    if any(k in text for k in MINDBODY_KEYWORDS):
        techs.append("Mindbody")
    if any(k in text for k in ZEN_PLANNER_KEYWORDS):
        techs.append("Zen Planner")
    if any(k in text for k in GLOFOX_KEYWORDS):
        techs.append("Glofox")
    if any(k in text for k in WELLNESS_LIVING_KEYWORDS):
        techs.append("WellnessLiving")
    if any(k in text for k in HUBSPOT_KEYWORDS):
        techs.append("HubSpot")
    if any(k in text for k in SALESFORCE_KEYWORDS):
        techs.append("Salesforce")

    # Raw tech field (non-empty and not "No technology")
    if tech_field and "no technology" not in tech_field and tech_field not in ["unknown", ""]:
        for t in tech_field.split(","):
            t = t.strip().title()
            if t and t not in techs:
                techs.append(t)

    return ", ".join(techs) if techs else "Unknown / Manual Systems"


def extract_instagram(row):
    ig_url = clean(row.get("Company Instagram URL", ""))
    if not ig_url:
        return ""
    # Extract handle from URL
    handle = ig_url.rstrip("/").split("/")[-1]
    if handle and handle not in ["instagram.com", "www"]:
        return f"@{handle}"
    return ""


def estimate_instagram_followers(row, branch_count, emp):
    """Estimate followers from available signals."""
    ig_url = clean(row.get("Company Instagram URL", ""))
    if not ig_url:
        return "N/A"

    # Rough estimate based on employee count and branches
    base = emp * 50
    base += branch_count * 500

    # Revenue range signal
    rev = lower(row.get("Company revenue range", ""))
    if "10m" in rev:
        base = max(base, 5000)
    elif "5m" in rev:
        base = max(base, 2000)
    elif "1m" in rev:
        base = max(base, 1000)

    return f"~{max(500, base):,}"


def posting_frequency_estimate(row):
    ig_url = clean(row.get("Company Instagram URL", ""))
    fb_url = clean(row.get("Company Facebook URL", ""))
    tw_url = clean(row.get("Company Twitter URL", ""))
    count = sum(1 for u in [ig_url, fb_url, tw_url] if u)
    if count >= 3:
        return "3-5x/week"
    if count == 2:
        return "2-3x/week"
    if count == 1:
        return "1-2x/week"
    return "Inactive"


def social_activity_score(row):
    ig_url = clean(row.get("Company Instagram URL", ""))
    fb_url = clean(row.get("Company Facebook URL", ""))
    tw_url = clean(row.get("Company Twitter URL", ""))
    yt_url = clean(row.get("Company YouTube URL", ""))
    li_url = clean(row.get("Company LinkedIn URL", ""))

    score = sum(1 for u in [ig_url, fb_url, tw_url, yt_url, li_url] if u)
    return min(5, score)


def infer_pricing_tier(row):
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    rev = lower(row.get("Company revenue range", ""))
    text = f"{desc} {keywords}"

    if any(w in text for w in ["luxury", "premium", "boutique", "high-end", "exclusive", "private"]):
        return "Premium ($150+/mo)"
    if any(w in text for w in ["affordable", "value", "budget", "low cost", "low-cost"]):
        return "Budget (<$50/mo)"

    if "10m" in rev:
        return "Mid-Market ($80–150/mo)"
    if "5m" in rev or "1m" in rev:
        return "Mid-Market ($50–100/mo)"

    return "Mid-Market ($50–100/mo)"


def infer_franchise_or_owned(row):
    desc = lower(row.get("Company description", ""))
    comp_type = lower(row.get("Company type", ""))
    keywords = lower(row.get("Company keywords", ""))
    text = f"{desc} {comp_type} {keywords}"

    if "franchise" in text:
        return "Franchise"
    if any(w in text for w in ["independently owned", "family-run", "family owned", "privately owned"]):
        return "Independently Owned"
    if comp_type == "public":
        return "Corporate/Public"
    return "Privately Owned"


def infer_pains(row, company_type, branch_count, ops_score):
    desc = lower(row.get("Company description", ""))
    keywords = lower(row.get("Company keywords", ""))
    text = f"{desc} {keywords}"

    pains = []

    # Pain A — Lead Leakage
    if any(w in text for w in ["marketing", "lead", "inquir", "ads", "advertising", "referral"]):
        pains.append(("Lead Leakage", "Marketing spend is wasted when leads aren't followed up fast — every missed inquiry is lost revenue."))

    # Pain B — Renewal Leakage
    if any(w in text for w in ["membership", "recurring", "subscription", "renewal", "retain", "churn"]):
        pains.append(("Renewal Leakage", "Missed renewals quietly kill recurring revenue — especially across multiple locations."))

    # Pain C — Scheduling Chaos
    if any(w in text for w in ["scheduling", "schedule", "trainer", "class", "booking", "appointment", "staff"]):
        pains.append(("Scheduling Chaos", "Manual scheduling creates inefficiency and staff friction as class and trainer counts grow."))

    # Pain D — No Visibility Across Branches
    if branch_count >= 3:
        pains.append(("No Branch Visibility", "Owners lack real-time visibility into branch performance, revenue, and member activity."))

    # Ensure at least 2 pains
    if len(pains) == 0:
        pains = [
            ("Lead Leakage", "Marketing spend is wasted when leads aren't followed up fast."),
            ("Renewal Leakage", "Missed renewals quietly kill recurring revenue."),
        ]
    elif len(pains) == 1:
        pains.append(("Renewal Leakage", "Missed renewals quietly kill recurring revenue."))

    primary = pains[0]
    secondary = pains[1] if len(pains) > 1 else pains[0]
    return primary[0], secondary[0], primary[1]


def infer_best_case_study(branch_count, company_type):
    if branch_count >= 3:
        return "Internal Ops Automation — Built systems replacing manual workflows for multi-location fitness chains, recovering revenue and reducing admin overhead."
    return "Gym Internal Tool — Built custom internal operations tool for a gym business, solving member management, renewals, scheduling and operational workflows."


def infer_offer(revenue_leakage):
    if revenue_leakage >= 5:
        return (
            "Custom Gym Operations System (Lead CRM + Auto Follow-up + Renewal Automation + Branch Analytics)",
            "Free Revenue Leakage Audit — Identify top 3 operational revenue gaps at no cost",
        )
    if revenue_leakage >= 3:
        return (
            "Free Revenue Leakage Audit — Identify top 3 operational revenue gaps in your business",
            "Custom Gym Operations System — Built specifically for your locations",
        )
    return (
        "Free Revenue Leakage Audit — 30-minute diagnostic to find where revenue is leaking",
        "Custom Internal Operations System for Fitness Businesses",
    )


def infer_copy_angle(branch_count, company_type, ops_score):
    if branch_count >= 5:
        return "Operations Efficiency — As branch count grows, manual operations become expensive and visibility disappears."
    if company_type in ("gym chain", "pilates chain", "yoga chain"):
        return "Revenue Leakage — Multi-location fitness businesses often lose significant revenue through missed leads and lapsed renewals."
    return "Retention — Improving member retention by even 5–10% materially improves monthly recurring revenue."


def build_personalization(row, company_type, branch_count, primary_pain, primary_offer, copy_angle, case_study):
    company = clean(row.get("Company name", ""))
    city = clean(row.get("Company city", "")) or clean(row.get("Person city", ""))

    location_hint = f" in {city}" if city else ""

    # Personalized opening
    if branch_count >= 5:
        opening = f"Noticed {company} operates across {branch_count}+ locations{location_hint} — that level of growth typically comes with real operational complexity."
    elif branch_count >= 2:
        opening = f"Came across {company}{location_hint} — growing multi-location {company_type}s at your stage tend to hit some common operational friction points."
    else:
        opening = f"Came across {company} — looks like you're building something solid in the {company_type} space{location_hint}."

    # Trigger event
    if branch_count >= 5:
        trigger = "Expanding multi-location footprint creates operational complexity and revenue leakage risk"
    elif branch_count >= 2:
        trigger = "Multi-location operations requiring coordinated systems"
    else:
        trigger = "Growing fitness business with increasing operational demands"

    # Relevant pain
    relevant_pain = primary_pain

    # Relevant offer
    relevant_offer = primary_offer.split("(")[0].strip()

    # Case study reference
    case_ref = "Built similar internal operational system for a fitness business — reduced admin time and recovered revenue leakage"

    # CTA
    if "audit" in primary_offer.lower():
        cta = "Open to a free 20-minute call to identify where revenue may be leaking in your operations?"
    else:
        cta = "Would it be worth a quick call to see how other gyms at your scale have tackled this?"

    return opening, trigger, relevant_pain, relevant_offer, case_ref, cta


def lead_priority_score(branch_count, ops_score, rev_leakage, social_score, is_dm, branch_complexity):
    score = 0

    # Branch complexity (0–30 pts)
    score += branch_complexity * 6

    # Ops complexity (0–20 pts)
    score += ops_score * 4

    # Revenue leakage (0–25 pts)
    score += rev_leakage * 5

    # Social presence (0–10 pts)
    score += social_score * 2

    # Decision maker bonus (0–15 pts)
    if is_dm:
        score += 15

    return min(100, max(1, score))


# ── MAIN PROCESSING ────────────────────────────────────────────────────────────

def process():
    with open(INPUT_FILE, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Total raw rows: {len(rows)}")

    results = []
    filtered_out = 0
    reasons = {}

    for row in rows:
        email = clean(row.get("Email", ""))
        website = clean(row.get("Company website", ""))
        domain = clean(row.get("Company domain", ""))
        title = lower(row.get("Job title", ""))
        seniority = lower(row.get("Job seniority", ""))

        # ── STEP 1: FILTER ────────────────────────────────────────────────────

        # Must have website
        if not website and not domain:
            filtered_out += 1
            reasons["no_website"] = reasons.get("no_website", 0) + 1
            continue

        # Personal email
        if is_personal_email(email):
            filtered_out += 1
            reasons["personal_email"] = reasons.get("personal_email", 0) + 1
            continue

        # Not a fitness company
        if not is_fitness_company(row):
            filtered_out += 1
            reasons["not_fitness"] = reasons.get("not_fitness", 0) + 1
            continue

        # Must be decision maker
        dm = is_decision_maker(row)
        if not dm:
            filtered_out += 1
            reasons["not_dm"] = reasons.get("not_dm", 0) + 1
            continue

        # No social presence
        if not has_social_presence(row):
            filtered_out += 1
            reasons["no_social"] = reasons.get("no_social", 0) + 1
            continue

        # ── STEP 2: ENRICH (partial — need branch count for single-location filter) ────────────────────────────────────────────────────

        emp = int(row.get("Company employee count", 0) or 0)
        company_type = infer_company_type(row)
        branch_count = infer_branch_count(row)

        # Exclude single-location gyms
        if branch_count < 2:
            filtered_out += 1
            reasons["single_location"] = reasons.get("single_location", 0) + 1
            continue

        b_complexity = branch_complexity_score(branch_count)
        ops_score = ops_complexity(row, branch_count)
        rev_leakage = revenue_leakage_score(row, branch_count, company_type)
        tech_stack = infer_tech_stack(row)
        ig_handle = extract_instagram(row)
        ig_followers = estimate_instagram_followers(row, branch_count, emp)
        posting_freq = posting_frequency_estimate(row)
        soc_score = social_activity_score(row)
        pricing_tier = infer_pricing_tier(row)
        franchise = infer_franchise_or_owned(row)

        # ── STEP 3: PAINS ─────────────────────────────────────────────────────
        primary_pain, secondary_pain, pain_summary = infer_pains(row, company_type, branch_count, ops_score)

        # ── STEP 4: CASE STUDY ────────────────────────────────────────────────
        case_study = infer_best_case_study(branch_count, company_type)

        # ── STEP 5: OFFER ─────────────────────────────────────────────────────
        primary_offer, secondary_offer = infer_offer(rev_leakage)

        # ── STEP 6: COPY ANGLE ────────────────────────────────────────────────
        copy_angle = infer_copy_angle(branch_count, company_type, ops_score)

        # ── STEP 7: PERSONALIZATION ───────────────────────────────────────────
        opening, trigger, rel_pain, rel_offer, case_ref, cta = build_personalization(
            row, company_type, branch_count, primary_pain, primary_offer, copy_angle, case_study
        )

        # ── SCORE ─────────────────────────────────────────────────────────────
        priority = lead_priority_score(branch_count, ops_score, rev_leakage, soc_score, dm, b_complexity)

        # ── OUTPUT ROW ────────────────────────────────────────────────────────
        linkedin = clean(row.get("Person LinkedIn URL", ""))
        company_desc = clean(row.get("Company description", ""))
        if len(company_desc) > 300:
            company_desc = company_desc[:297] + "..."

        out = {
            "first_name": clean(row.get("First name", "")),
            "last_name": clean(row.get("Last name", "")),
            "title": clean(row.get("Job title", "")),
            "company": clean(row.get("Company name", "")),
            "website": website,
            "email": email,
            "linkedin": linkedin,
            "company_description": company_desc,
            "company_type": company_type,
            "employee_count": emp,
            "branch_count": branch_count,
            "pricing_tier": pricing_tier,
            "franchise_or_owned": franchise,
            "ops_complexity_score": ops_score,
            "revenue_leakage_score": rev_leakage,
            "tech_stack": tech_stack,
            "instagram_handle": ig_handle,
            "instagram_followers": ig_followers,
            "posting_frequency": posting_freq,
            "social_activity_score": soc_score,
            "primary_pain": primary_pain,
            "secondary_pain": secondary_pain,
            "pain_summary": pain_summary,
            "best_case_study": case_study,
            "primary_offer": primary_offer,
            "secondary_offer": secondary_offer,
            "best_copy_angle": copy_angle,
            "personalized_opening": opening,
            "trigger_event": trigger,
            "relevant_pain": rel_pain,
            "relevant_offer": rel_offer,
            "case_study_reference": case_ref,
            "cta": cta,
            "lead_priority_score": priority,
        }

        results.append(out)

    # De-duplicate: keep highest-scored contact per company
    seen_companies = {}
    deduped = []
    for r in sorted(results, key=lambda x: x["lead_priority_score"], reverse=True):
        co = r["company"].strip().lower()
        if co not in seen_companies:
            seen_companies[co] = True
            deduped.append(r)
    results = deduped
    print(f"After de-duplication (1 contact/company): {len(results)}")

    # Sort by priority descending
    results.sort(key=lambda x: x["lead_priority_score"], reverse=True)

    # Write output
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(results)

    print(f"\nFiltered out: {filtered_out}")
    print("Filter reasons:")
    for k, v in sorted(reasons.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    print(f"\nQualified leads written: {len(results)}")
    print(f"Output: {OUTPUT_FILE}")

    # Print top 10 leads
    print("\n── TOP 10 LEADS ──")
    for i, r in enumerate(results[:10], 1):
        print(f"{i:2}. [{r['lead_priority_score']:3}] {r['first_name']} {r['last_name']} | {r['title']} @ {r['company']} | branches={r['branch_count']} | ops={r['ops_complexity_score']} | leakage={r['revenue_leakage_score']}")


if __name__ == "__main__":
    process()
