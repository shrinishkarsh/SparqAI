#!/usr/bin/env python3
"""
Moni Microfinance App — Go-To-Market & Product Marketing Strategy
Capstone deck generator (python-pptx).
Author on title slide: Samuel Oluwafemi Afariogun
Brand: Fresh green + deep navy. Tone: balanced professional + culturally aware.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION, XL_LABEL_POSITION
from pptx.oxml.ns import qn

# ----------------------------------------------------------------------------- palette
NAVY      = RGBColor(0x0B, 0x1F, 0x3A)
NAVY_2    = RGBColor(0x12, 0x2E, 0x52)
GREEN     = RGBColor(0x00, 0xA8, 0x6B)
GREEN_LT  = RGBColor(0x5F, 0xD3, 0xA3)
GREEN_PALE= RGBColor(0xE3, 0xF6, 0xED)
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
OFFWHITE  = RGBColor(0xF4, 0xF7, 0xF6)
GREY      = RGBColor(0x5B, 0x6B, 0x73)
GREY_LT   = RGBColor(0xD9, 0xE0, 0xDF)
DARK      = RGBColor(0x1A, 0x2A, 0x33)
GOLD      = RGBColor(0xF2, 0xB0, 0x2E)
CORAL     = RGBColor(0xE8, 0x6A, 0x5C)

FONT_H = "Calibri"
FONT_B = "Calibri"

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]

# ----------------------------------------------------------------------------- helpers
def slide():
    return prs.slides.add_slide(BLANK)

def bg(s, color=WHITE):
    r = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    r.fill.solid(); r.fill.fore_color.rgb = color
    r.line.fill.background()
    r.shadow.inherit = False
    s.shapes._spTree.remove(r._element)
    s.shapes._spTree.insert(2, r._element)
    return r

def rect(s, x, y, w, h, color, line=None, line_w=1.0, shape=MSO_SHAPE.RECTANGLE):
    sp = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if color is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = color
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line; sp.line.width = Pt(line_w)
    sp.shadow.inherit = False
    return sp

def txt(s, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
        space_after=4, line_spacing=1.0, wrap=True):
    """runs: list of paragraphs; each paragraph = list of (text,size,color,bold,italic) tuples
       OR a simple string (uses defaults via shorthand handled by caller)."""
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.vertical_anchor = anchor
    tf.margin_left = 0; tf.margin_right = 0
    tf.margin_top = 0; tf.margin_bottom = 0
    first = True
    for para in runs:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = align
        p.space_after = Pt(space_after)
        p.space_before = Pt(0)
        if line_spacing:
            p.line_spacing = line_spacing
        for (t, sz, col, bold, ital) in para:
            r = p.add_run(); r.text = t
            r.font.size = Pt(sz); r.font.bold = bold; r.font.italic = ital
            r.font.color.rgb = col; r.font.name = FONT_B
    return tb

def R(t, sz=14, col=DARK, bold=False, ital=False):
    return (t, sz, col, bold, ital)

def bullets(s, x, y, w, h, items, size=13.5, color=DARK, bullet_color=GREEN,
            gap=6, line_spacing=1.04, marker="▸"):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = 0; tf.margin_right = 0; tf.margin_top = 0; tf.margin_bottom = 0
    first = True
    for it in items:
        # it: string OR (head, body) OR list of (text,bold) handled below
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.space_after = Pt(gap); p.line_spacing = line_spacing
        mk = p.add_run(); mk.text = marker + "  "
        mk.font.size = Pt(size); mk.font.color.rgb = bullet_color; mk.font.bold = True
        mk.font.name = FONT_B
        if isinstance(it, tuple):
            head, body = it
            r1 = p.add_run(); r1.text = head
            r1.font.size = Pt(size); r1.font.bold = True; r1.font.color.rgb = color; r1.font.name = FONT_B
            r2 = p.add_run(); r2.text = body
            r2.font.size = Pt(size); r2.font.color.rgb = color; r2.font.name = FONT_B
        else:
            r1 = p.add_run(); r1.text = it
            r1.font.size = Pt(size); r1.font.color.rgb = color; r1.font.name = FONT_B
    return tb

def header(s, kicker, title, num):
    """Standard content-slide header with side accent bar + kicker + page number."""
    rect(s, 0, 0, 13.333, 1.28, NAVY)
    rect(s, 0, 1.28, 13.333, 0.06, GREEN)
    rect(s, 0.55, 0.30, 0.12, 0.70, GREEN)
    txt(s, 0.85, 0.27, 11.5, 0.35, [[R(kicker, 11.5, GREEN_LT, True)]])
    txt(s, 0.85, 0.55, 11.6, 0.7, [[R(title, 25, WHITE, True)]])
    # page number chip
    txt(s, 12.2, 0.45, 0.9, 0.4, [[R(str(num), 12, GREEN_LT, True)]], align=PP_ALIGN.RIGHT)

def footer(s):
    txt(s, 0.55, 7.08, 8, 0.3, [[R("Moni  |  The everyday money companion for ambitious young Nigerians",
                                    9, GREY)]])

def chip(s, x, y, w, h, label, fill, text_color=WHITE, size=11, bold=True):
    c = rect(s, x, y, w, h, fill, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    try:
        c.adjustments[0] = 0.35
    except Exception:
        pass
    tf = c.text_frame; tf.word_wrap = True
    tf.margin_left = Pt(4); tf.margin_right = Pt(4)
    tf.margin_top = Pt(1); tf.margin_bottom = Pt(1)
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = label
    r.font.size = Pt(size); r.font.bold = bold; r.font.color.rgb = text_color; r.font.name = FONT_B
    return c

def card(s, x, y, w, h, fill=OFFWHITE, line=GREY_LT):
    c = rect(s, x, y, w, h, fill, line=line, line_w=1.0, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    try:
        c.adjustments[0] = 0.06
    except Exception:
        pass
    return c

def notes(s, text):
    s.notes_slide.notes_text_frame.text = text

def style_table(tbl, header_fill=NAVY, header_color=WHITE, band1=WHITE, band2=GREEN_PALE,
                header_size=11.5, body_size=10.5, first_col_bold=True, body_color=DARK):
    # turn off default banding style emphasis we control manually
    tblPr = tbl._tbl.tblPr
    tblPr.set('firstRow', '1')
    tblPr.set('bandRow', '0')
    nrows = len(tbl.rows); ncols = len(tbl.columns)
    for ri in range(nrows):
        for ci in range(ncols):
            cell = tbl.cell(ri, ci)
            cell.margin_left = Pt(6); cell.margin_right = Pt(6)
            cell.margin_top = Pt(3); cell.margin_bottom = Pt(3)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            if ri == 0:
                cell.fill.solid(); cell.fill.fore_color.rgb = header_fill
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = band1 if ri % 2 == 1 else band2
            for p in cell.text_frame.paragraphs:
                p.line_spacing = 0.98
                for r in p.runs:
                    r.font.name = FONT_B
                    if ri == 0:
                        r.font.size = Pt(header_size); r.font.bold = True; r.font.color.rgb = header_color
                    else:
                        r.font.size = Pt(body_size); r.font.color.rgb = body_color
                        r.font.bold = bool(first_col_bold and ci == 0)

def make_table(s, x, y, w, data, col_widths=None, row_h=0.34, header_h=0.4, **kw):
    nrows = len(data); ncols = len(data[0])
    gfx = s.shapes.add_table(nrows, ncols, Inches(x), Inches(y), Inches(w), Inches(row_h*nrows))
    tbl = gfx.table
    if col_widths:
        total = sum(col_widths)
        for ci, cw in enumerate(col_widths):
            tbl.columns[ci].width = Inches(w * cw / total)
    tbl.rows[0].height = Inches(header_h)
    for ri in range(1, nrows):
        tbl.rows[ri].height = Inches(row_h)
    for ri, row in enumerate(data):
        for ci, val in enumerate(row):
            cell = tbl.cell(ri, ci)
            cell.text = str(val)
    style_table(tbl, **kw)
    return tbl

PAGE = 0
def pnum():
    global PAGE
    PAGE += 1
    return PAGE

# =============================================================================
# 1. TITLE
# =============================================================================
s = slide(); bg(s, NAVY)
rect(s, 0, 0, 13.333, 7.5, NAVY)
# decorative arcs
rect(s, 9.6, -2.2, 6, 6, NAVY_2, shape=MSO_SHAPE.OVAL)
rect(s, 11.0, 3.6, 5, 5, NAVY_2, shape=MSO_SHAPE.OVAL)
rect(s, 0.9, 1.5, 0.16, 3.2, GREEN)
# logo lockup
chip(s, 1.25, 1.55, 1.7, 0.62, "moni", GREEN, WHITE, size=24)
txt(s, 1.25, 2.55, 11, 2.4, [
    [R("Launching a New Fintech Product", 40, WHITE, True)],
    [R("in Nigeria", 40, GREEN_LT, True)],
], line_spacing=1.0, space_after=2)
txt(s, 1.27, 4.55, 11, 0.6, [[R("A Go-To-Market & Product Marketing Strategy for Moni Microfinance App",
                                 17, GREY_LT, False, True)]])
rect(s, 1.27, 5.35, 6.2, 0.02, GREEN)
txt(s, 1.27, 5.55, 11, 1.2, [
    [R("Prepared by:  ", 14, GREY_LT), R("Samuel Oluwafemi Afariogun", 14, WHITE, True)],
    [R("Role:  ", 14, GREY_LT), R("Product Marketing Consultant", 14, WHITE)],
    [R("AltSchool of Product Marketing, Karatu 2025  •  Third Semester Capstone (60 Marks)", 12.5, GREEN_LT)],
], space_after=5)
notes(s, "Opening: Moni is a young Nigerian fintech with a strong product but a leaky funnel — "
         "18% 30-day retention and a ₦4,200 CAC. This deck delivers a launch playbook to grow "
         "awareness, adoption, retention and trust while driving CAC down, all within the ₦12m budget.")

# =============================================================================
# 2. AGENDA
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "CONTENTS", "What This Strategy Covers", pnum())
agenda = [
    ("A", "Product & Market Understanding", "Problem, USP, competitor intel, segmentation", GREEN),
    ("B", "Customer Research & Personas", "Research plan, survey design, two personas", NAVY),
    ("C", "Go-To-Market Strategy", "Positioning, viral campaign, ₦12m budget split", GREEN),
    ("D", "Metrics, Data & Optimization", "KPI dashboard + full A/B testing framework", NAVY),
    ("E", "Execution & Stakeholders", "Content calendar, stakeholders, reporting", GREEN),
]
y = 1.75
for letter, t, d, col in agenda:
    card(s, 0.7, y, 11.95, 0.95)
    rect(s, 0.7, y, 0.16, 0.95, col)
    chip(s, 1.05, y+0.225, 0.62, 0.5, letter, col, WHITE, size=20)
    txt(s, 1.95, y+0.14, 8.5, 0.4, [[R(t, 16.5, NAVY, True)]])
    txt(s, 1.95, y+0.55, 10.3, 0.35, [[R(d, 12, GREY)]])
    txt(s, 11.4, y+0.22, 1.1, 0.5, [[R(["10","10","15","15","10"][["A","B","C","D","E"].index(letter)]+" marks", 11, col, True)]], align=PP_ALIGN.RIGHT)
    y += 1.06
footer(s)

# =============================================================================
# 3. EXECUTIVE SUMMARY
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "OVERVIEW", "Executive Summary", pnum())
txt(s, 0.7, 1.6, 12, 0.9, [
    [R("Moni has product–market fit signals but a ", 14, DARK),
     R("leaky funnel", 14, GREEN, True),
     R(". The growth problem is not acquisition — it is ", 14, DARK),
     R("activation, retention and trust", 14, GREEN, True),
     R(". This strategy fixes the funnel before pouring budget into the top of it.", 14, DARK)],
])
# metric tiles
tiles = [
    ("2,350", "beta users", NAVY),
    ("640", "weekly actives (27%)", NAVY),
    ("₦4,200", "CAC per user", CORAL),
    ("18%", "30-day retention", CORAL),
    ("₦12m", "launch budget", GREEN),
]
x = 0.7
for big, small, col in tiles:
    card(s, x, 2.55, 2.27, 1.15)
    rect(s, x, 2.55, 2.27, 0.1, col)
    txt(s, x, 2.78, 2.27, 0.55, [[R(big, 26, col, True)]], align=PP_ALIGN.CENTER)
    txt(s, x, 3.36, 2.27, 0.3, [[R(small, 10.5, GREY)]], align=PP_ALIGN.CENTER)
    x += 2.42
# targets after launch
txt(s, 0.7, 3.95, 12, 0.4, [[R("90-DAY TARGETS POST-LAUNCH", 12, NAVY, True)]])
goals = [
    ("CAC", "₦4,200 → ₦2,600", "-38%"),
    ("30-day retention", "18% → 35%", "+17pts"),
    ("Weekly actives", "640 → 6,000+", "9x"),
    ("Referral share of installs", "→ 30%", "new"),
]
x = 0.7
for k, v, delta in goals:
    card(s, x, 4.4, 2.92, 1.05, GREEN_PALE, GREEN_LT)
    txt(s, x+0.15, 4.52, 2.6, 0.3, [[R(k, 11.5, GREY, True)]])
    txt(s, x+0.15, 4.8, 2.6, 0.4, [[R(v, 14.5, NAVY, True)]])
    chip(s, x+0.15, 5.16, 0.95, 0.22, delta, GREEN, WHITE, size=9.5)
    x += 3.05
txt(s, 0.7, 5.75, 12, 1.4, [
    [R("The big idea:  ", 14, GREEN, True),
     R("Position Moni as the everyday money companion — not another savings app — and win on ",
       14, DARK),
     R("trust, habit and community", 14, NAVY, True),
     R(". Spend the ₦12m on channels that compound (referral + community + campus) rather than "
       "rented attention alone, and let an always-on A/B testing engine push CAC down week over week.",
       14, DARK)],
])
footer(s)
notes(s, "Anchor the whole deck here: acquisition isn't the bottleneck — 27% of beta users are weekly "
         "active, which is decent, but 82% churn by day 30. If we fix activation and retention first, "
         "every naira of acquisition spend works harder and CAC falls naturally. Targets are illustrative "
         "but grounded in realistic fintech benchmarks.")

# =============================================================================
# SECTION A DIVIDER
# =============================================================================
def divider(letter, title, subtitle, items, marks):
    s = slide(); bg(s, NAVY)
    rect(s, 0, 0, 13.333, 7.5, NAVY)
    rect(s, 9.8, -2, 6, 6, NAVY_2, shape=MSO_SHAPE.OVAL)
    rect(s, 0.9, 1.9, 0.18, 3.4, GREEN)
    chip(s, 1.3, 1.95, 1.5, 1.5, letter, GREEN, WHITE, size=64)
    txt(s, 3.1, 2.0, 9, 0.5, [[R("SECTION " + letter + f"   •   {marks} MARKS", 13, GREEN_LT, True)]])
    txt(s, 3.1, 2.45, 9.4, 1.2, [[R(title, 34, WHITE, True)]], line_spacing=1.0)
    txt(s, 3.13, 3.75, 9, 0.5, [[R(subtitle, 15, GREY_LT, False, True)]])
    yy = 4.55
    for it in items:
        rect(s, 3.13, yy+0.07, 0.18, 0.18, GREEN, shape=MSO_SHAPE.OVAL)
        txt(s, 3.45, yy, 8.6, 0.4, [[R(it, 13.5, WHITE)]])
        yy += 0.46
    pnum()
    return s

divider("A", "Product & Market Understanding",
        "What Moni solves, why it wins, and where competitors leave the door open.",
        ["Product understanding, problem & USP",
         "Competitive intelligence vs. Opay, PiggyVest, Kuda & PalmPay",
         "Four-segment market segmentation"], 10)

# =============================================================================
# A1. THE PROBLEM
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A1 · PRODUCT UNDERSTANDING", "The Problem Moni Solves", pnum())
txt(s, 0.7, 1.55, 12, 0.7, [
    [R("Young Nigerians earn irregularly, spend reactively, and save inconsistently — ", 14, DARK),
     R("the money runs before the month does.", 14, GREEN, True)],
])
probs = [
    ("Inconsistent saving", "Irregular income (allowances, gigs, stipends) makes disciplined "
                            "saving feel impossible without automation."),
    ("Reactive spending", "No visibility into where money goes; 'where did my salary go?' by week two."),
    ("Emergency cash gaps", "An unexpected ₦15k expense forces borrowing from friends or loan-shark apps."),
    ("Missed bills & fees", "Forgotten airtime, data, subscriptions and utility bills cause penalties and stress."),
]
x = 0.7
for t, d in probs:
    card(s, x, 2.35, 2.92, 1.95)
    rect(s, x, 2.35, 2.92, 0.1, CORAL)
    txt(s, x+0.18, 2.6, 2.6, 0.6, [[R(t, 14.5, NAVY, True)]])
    txt(s, x+0.18, 3.2, 2.6, 1.05, [[R(d, 11, GREY)]], line_spacing=1.05)
    x += 3.05
# market context strip
rect(s, 0.7, 4.6, 11.95, 1.95, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 1.0, 4.78, 11.4, 0.4, [[R("WHY THIS MATTERS NOW  (illustrative market context)", 12, GREEN_LT, True)]])
ctx = [
    ("70%+", "of Nigeria's ~220m population is under 35 — a vast, mobile-first youth market."),
    ("60m+", "Nigerians use a fintech app monthly; trust — not access — is now the battleground."),
    ("<35%", "typical 30-day retention for Nigerian finance apps — Moni's 18% is fixable, not fatal."),
]
x = 1.0
for big, d in ctx:
    txt(s, x, 5.25, 3.6, 0.5, [[R(big, 26, GREEN_LT, True)]])
    txt(s, x, 5.85, 3.6, 0.55, [[R(d, 11, WHITE)]], line_spacing=1.02)
    x += 3.85
footer(s)
notes(s, "Frame Moni as solving a behavioural problem, not just a feature gap. The market context "
         "numbers are illustrative but directionally accurate for Nigeria's youth-heavy, mobile-first "
         "fintech landscape. Key line: 18% retention is a fixable problem, and that's the opportunity.")

# =============================================================================
# A1b. SOLUTION / USP
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A1 · PRODUCT UNDERSTANDING", "The Product, USP & Why Young Nigerians Care", pnum())
# five features
feats = [
    ("Automated savings", "Set-and-forget rules round up spend & sweep cash on payday."),
    ("Spend tracking", "Auto-categorised insights — see exactly where money goes."),
    ("Bill reminders", "Never miss airtime, data, rent or subscriptions again."),
    ("Emergency advances", "Small, fair micro-advances to bridge cash-flow gaps."),
    ("Goal challenges", "Gamified, social savings challenges that build habit."),
]
txt(s, 0.7, 1.5, 12, 0.35, [[R("FIVE FEATURES, ONE COMPANION", 12, NAVY, True)]])
x = 0.7
for t, d in feats:
    card(s, x, 1.9, 2.27, 1.75, WHITE)
    rect(s, x+0.15, 2.05, 0.4, 0.4, GREEN, shape=MSO_SHAPE.OVAL)
    txt(s, x+0.15, 2.55, 2.0, 0.5, [[R(t, 12.5, NAVY, True)]])
    txt(s, x+0.15, 3.02, 2.0, 0.6, [[R(d, 9.8, GREY)]], line_spacing=1.0)
    x += 2.42
# USP box
rect(s, 0.7, 3.95, 5.85, 2.6, GREEN, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 4.15, 5.4, 0.4, [[R("UNIQUE SELLING PROPOSITION", 12, NAVY, True)]])
txt(s, 0.95, 4.55, 5.4, 1.9, [
    [R("“The everyday money companion that ", 16, WHITE, True),
     R("saves, reminds and rescues", 16, NAVY, True),
     R(" — automatically — so ambitious young Nigerians stay one step ahead of their money.”",
       16, WHITE, True)],
], line_spacing=1.05)
# differentiators
card(s, 6.75, 3.95, 5.9, 2.6, NAVY)
txt(s, 7.0, 4.12, 5.4, 0.4, [[R("WHAT MAKES MONI DIFFERENT", 12, GREEN_LT, True)]])
diff = [
    "All-in-one: savings + tracking + bills + advances in one habit loop (rivals do one well).",
    "Companion, not vault: proactive nudges, not a passive piggy bank.",
    "Built for irregular income — flexible rules, not rigid monthly debits.",
    "Trust-first design: transparent fees, NDIC-insured partner, no hidden charges.",
    "Community + culture: challenges, streaks and Naija humour drive daily habit.",
]
bullets(s, 7.0, 4.5, 5.4, 2.0, diff, size=10.8, color=WHITE, bullet_color=GREEN_LT, gap=4)
footer(s)
notes(s, "USP must be repeatable in one breath: 'saves, reminds and rescues.' Competitors are point "
         "solutions — PiggyVest = savings vault, Opay = payments. Moni's wedge is the daily companion "
         "habit loop plus trust-first design. 'Why young Nigerians care': it removes money anxiety and "
         "rewards ambition.")

# =============================================================================
# A2. COMPETITIVE INTELLIGENCE — TABLE
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A2 · COMPETITIVE INTELLIGENCE", "How Moni Stacks Up", pnum())
data = [
    ["", "Moni", "PiggyVest", "Opay", "Kuda Bank", "PalmPay"],
    ["Core focus", "Money companion: save+track+bills+advance", "Goal & locked savings, investments", "Payments, transfers, agency banking", "Free digital bank, budgeting", "Payments, transfers, rewards"],
    ["Typical charges", "Free core; fair, transparent advance fee", "Free; penalty on early withdrawal", "Low fees; some transfer charges", "Free transfers (capped)", "Low/zero transfer fees"],
    ["Trust perception", "New — must be earned", "High (savings trust leader)", "Medium (scale, some support gripes)", "High among Gen-Z", "Medium-high, growing"],
    ["Positioning", "Everyday companion for ambition", "“Save & invest with ease”", "“Beyond banking” super-app", "“The bank of the free”", "“Payments made easy”"],
    ["Retention lever", "Habit loop + community + advances", "Locked savings + interest", "Ubiquity & cashbacks", "Free banking", "Cashback rewards"],
]
make_table(s, 0.55, 1.55, 12.25, data,
           col_widths=[1.25, 1.7, 1.55, 1.55, 1.45, 1.5],
           row_h=0.83, header_h=0.42, body_size=9.6, header_size=11)
txt(s, 0.55, 6.75, 12, 0.4, [
    [R("Takeaway:  ", 12.5, GREEN, True),
     R("rivals win on a single job-to-be-done. Moni's opening is the ", 12, DARK),
     R("integrated daily habit + transparent trust", 12, NAVY, True),
     R(" combination no single competitor owns.", 12, DARK)],
])
notes(s, "Don't claim Moni beats everyone on everything — that's not credible. Claim the white space: "
         "no competitor owns the integrated daily-companion + trust narrative. PiggyVest owns savings "
         "trust; Opay owns ubiquity. Moni must own habit + transparency for the irregular-income youth.")

# =============================================================================
# A2b. COMPETITOR WEAKNESSES / WHITE SPACE
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A2 · COMPETITIVE INTELLIGENCE", "The Gaps Competitors Aren't Closing", pnum())
gaps = [
    ("Cold, transactional UX", "Apps feel like utilities, not allies. No emotional relationship → easy to delete.",
     "Moni's move: a warm, proactive companion tone with human nudges & streaks."),
    ("Built for salary earners", "Rigid monthly debits punish irregular earners — students, NYSC, freelancers.",
     "Moni's move: flexible, income-aware rules that flex with gig/stipend cash flow."),
    ("Trust anxiety & opacity", "Hidden fees, scam fears and patchy support erode confidence sector-wide.",
     "Moni's move: radical fee transparency, NDIC-insured partner, visible support."),
    ("Weak youth retention", "Big spend on installs, little on habit — users churn after the signup bonus.",
     "Moni's move: community, challenges & referral loops that make staying fun."),
]
x, y = 0.7, 1.65
for i, (t, p, mv) in enumerate(gaps):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 2.45
    card(s, cx, cy, 5.85, 2.25, WHITE)
    rect(s, cx, cy, 0.14, 2.25, CORAL)
    txt(s, cx+0.3, cy+0.18, 5.4, 0.4, [[R(t, 14, NAVY, True)]])
    txt(s, cx+0.3, cy+0.62, 5.4, 0.8, [[R("Gap:  ", 11, CORAL, True), R(p, 11, GREY)]], line_spacing=1.03)
    rect(s, cx+0.3, cy+1.55, 5.3, 0.02, GREEN_LT)
    txt(s, cx+0.3, cy+1.62, 5.4, 0.6, [[R("Moni: ", 11, GREEN, True), R(mv.split('move: ')[1], 11, DARK)]], line_spacing=1.03)
footer(s)

# =============================================================================
# A3. MARKET SEGMENTATION
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A3 · MARKET SEGMENTATION", "Four Core Segments", pnum())
segs = [
    ("Students", "🎓",
     ["Need: stretch allowances, avoid going broke mid-semester",
      "Pain: irregular money from home, peer pressure spending",
      "Spend: airtime/data, food, transport, social outings",
      "Digital: TikTok & IG natives, WhatsApp, mobile-only"]),
    ("NYSC members", "🛡️",
     ["Need: make the ₦33k+ allowee last; save for post-service",
      "Pain: relocation costs, irregular allowee, uncertainty",
      "Spend: rent, transport, data, small business seed",
      "Digital: X & WhatsApp heavy, price-sensitive, deal-led"]),
    ("Young salary earners", "💼",
     ["Need: budget, automate savings, build emergency buffer",
      "Pain: 'salary finished' by week two, lifestyle creep",
      "Spend: rent, subscriptions, transport, black-tax",
      "Digital: IG & LinkedIn, fintech-savvy, multi-app users"]),
    ("Hustlers & freelancers", "🚀",
     ["Need: smooth lumpy income, separate biz vs personal money",
      "Pain: cash-flow gaps, no buffer, manual bill tracking",
      "Spend: stock/tools, data, logistics, reinvestment",
      "Digital: WhatsApp Business, IG, TikTok, X — always online"]),
]
x, y = 0.7, 1.6
for i, (t, emo, pts) in enumerate(segs):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 2.6
    card(s, cx, cy, 5.85, 2.4, WHITE)
    rect(s, cx, cy, 5.85, 0.1, [GREEN, NAVY, GREEN, NAVY][i])
    txt(s, cx+0.25, cy+0.18, 0.7, 0.5, [[R(emo, 22, DARK)]])
    txt(s, cx+0.95, cy+0.26, 4.7, 0.4, [[R(t, 15.5, NAVY, True)]])
    bullets(s, cx+0.28, cy+0.78, 5.35, 1.55, pts, size=10.2, gap=2.5,
            bullet_color=[GREEN, NAVY, GREEN, NAVY][i], line_spacing=1.0)
footer(s)
notes(s, "Segmentation by income pattern + life stage, not just demographics. Note the common thread: "
         "all four have IRREGULAR or CONSTRAINED income — that's Moni's unifying design principle and "
         "the reason 'flexible rules' beats rigid monthly debits.")

# =============================================================================
# A2c. PERCEPTUAL / POSITIONING MAP
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "A2 · COMPETITIVE INTELLIGENCE", "Positioning Map: The White Space", pnum())
# plot area
px, py, pw, ph = 2.2, 1.75, 8.9, 4.55
card(s, px, py, pw, ph, WHITE)
# axes
rect(s, px+pw/2-0.01, py+0.2, 0.02, ph-0.4, GREY_LT)
rect(s, px+0.2, py+ph/2-0.01, pw-0.4, 0.02, GREY_LT)
# axis labels
txt(s, px+0.1, py-0.02, pw-0.2, 0.3, [[R("HIGH TRUST / RELATIONSHIP", 10.5, NAVY, True)]], align=PP_ALIGN.CENTER)
txt(s, px+0.1, py+ph-0.3, pw-0.2, 0.3, [[R("LOW TRUST / TRANSACTIONAL", 10.5, GREY, True)]], align=PP_ALIGN.CENTER)
txt(s, 0.55, py+ph/2-0.5, 1.6, 1.0, [[R("SINGLE-PURPOSE", 10.5, GREY, True)], [R("(one job)", 9, GREY)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
txt(s, px+pw+0.05, py+ph/2-0.5, 1.7, 1.0, [[R("ALL-IN-ONE", 10.5, NAVY, True)], [R("COMPANION", 10.5, NAVY, True)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
# bubbles: (label, x_frac 0-1 single->allinone, y_frac 0-1 low->high trust, color, size)
def bubble(label, xf, yf, col, d=0.62, tcol=WHITE):
    bx = px + 0.35 + xf*(pw-0.9) - d/2
    by = py + 0.35 + (1-yf)*(ph-0.9) - d/2
    rect(s, bx, by, d, d, col, shape=MSO_SHAPE.OVAL)
    txt(s, bx-0.4, by+d+0.02, d+0.8, 0.3, [[R(label, 9.5, NAVY, True)]], align=PP_ALIGN.CENTER)
bubble("PiggyVest", 0.28, 0.82, GREEN_LT)
bubble("Kuda", 0.40, 0.80, NAVY_2)
bubble("Opay", 0.62, 0.45, GREY)
bubble("PalmPay", 0.55, 0.55, GOLD)
# Moni — the star, in the prized top-right
mb_d = 0.95
mbx = px + 0.35 + 0.86*(pw-0.9) - mb_d/2
mby = py + 0.35 + (1-0.88)*(ph-0.9) - mb_d/2
rect(s, mbx-0.07, mby-0.07, mb_d+0.14, mb_d+0.14, GREEN_LT, shape=MSO_SHAPE.OVAL)
rect(s, mbx, mby, mb_d, mb_d, GREEN, shape=MSO_SHAPE.OVAL)
txt(s, mbx, mby+0.28, mb_d, 0.4, [[R("MONI", 13, WHITE, True)]], align=PP_ALIGN.CENTER)
txt(s, 0.7, 6.55, 12, 0.5, [
    [R("The open quadrant:  ", 12.5, GREEN, True),
     R("no competitor occupies the high-trust, all-in-one-companion corner. That is precisely the "
       "territory Moni is built to own.", 12.5, DARK)],
])
notes(s, "This 2x2 makes the white-space argument visual and instantly memorable. X-axis = breadth "
         "(single job vs all-in-one companion); Y-axis = relationship depth (transactional vs trusted). "
         "Competitors cluster; the top-right corner is empty. Bubble placement is a strategic judgement, "
         "not precise data.")

# =============================================================================
# SECTION B DIVIDER
# =============================================================================
divider("B", "Customer Research & Personas",
        "Hearing the user before we spend a naira — then making them human.",
        ["A mixed-method customer research plan & survey design",
         "Bias-avoidance safeguards",
         "One primary + one secondary persona"], 10)

# =============================================================================
# B4. RESEARCH PLAN
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "B4 · CUSTOMER RESEARCH PLAN", "How We'll Listen Before We Launch", pnum())
card(s, 0.7, 1.6, 3.85, 4.05, WHITE)
rect(s, 0.7, 1.6, 3.85, 0.1, GREEN)
txt(s, 0.9, 1.78, 3.5, 0.4, [[R("PRIMARY RESEARCH", 12.5, GREEN, True)]])
bullets(s, 0.9, 2.2, 3.5, 3.3, [
    "In-app surveys & micro-polls (NPS, exit reasons)",
    "1:1 user interviews (10–12 per segment)",
    "Focus groups on campuses (Lagos, Ibadan)",
    "Usability tests on the savings & advance flows",
    "Diary studies: 7-day money behaviour logs",
    "Beta-user churn interviews (why did you stop?)",
], size=11, gap=6)
card(s, 4.75, 1.6, 3.85, 4.05, WHITE)
rect(s, 4.75, 1.6, 3.85, 0.1, NAVY)
txt(s, 4.95, 1.78, 3.5, 0.4, [[R("SECONDARY RESEARCH", 12.5, NAVY, True)]])
bullets(s, 4.95, 2.2, 3.5, 3.3, [
    "EFInA Access to Finance & CBN reports",
    "NBS data on youth income & employment",
    "GSMA / mobile-money penetration studies",
    "Competitor app reviews & social listening",
    "Google Trends & TikTok/X trend data",
    "Industry reports (McKinsey, Disrupt Africa)",
], size=11, gap=6, bullet_color=NAVY)
card(s, 8.8, 1.6, 3.85, 4.05, GREEN_PALE, GREEN_LT)
txt(s, 9.0, 1.78, 3.5, 0.4, [[R("AVOIDING RESEARCH BIAS", 12.5, GREEN, True)]])
bullets(s, 9.0, 2.2, 3.5, 3.3, [
    "Recruit across all 4 segments & 4 cities — not just superfans",
    "Neutral, non-leading question wording",
    "Mix qual + quant to triangulate findings",
    "Include churned & non-users, not only actives",
    "Blind/independent moderation; avoid founder bias",
    "Adequate sample size; watch sampling & confirmation bias",
], size=10.5, gap=5, bullet_color=GREEN)
txt(s, 0.7, 5.85, 12, 0.6, [
    [R("Objective:  ", 13, GREEN, True),
     R("understand why 82% of beta users churn by day 30 — and what would make them stay — before "
       "committing the ₦12m launch budget.", 13, DARK)],
])
footer(s)

# =============================================================================
# B4b. SURVEY QUESTIONS
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "B4 · RESEARCH PLAN", "Sample Survey Questions", pnum())
txt(s, 0.7, 1.5, 12, 0.4, [[R("A short, mobile-first survey (≤2 mins) across screening, behaviour, "
                              "product-fit and trust.", 13, GREY, False, True)]])
qcards = [
    ("BEHAVIOUR", GREEN, [
        "How often do you run out of money before your next income? (Always→Never)",
        "How do you currently save — if at all? (Bank / app / cash / I don't)",
        "When an emergency expense hits, where do you get money first?"]),
    ("PRODUCT FIT", NAVY, [
        "Which feature would help you most? (rank: auto-save, tracking, bills, advance, challenges)",
        "What nearly stopped you from using a finance app? (open + multiple choice)",
        "How disappointed would you be if Moni shut down? (Sean Ellis PMF test)"]),
    ("TRUST", GOLD, [
        "On 1–10, how much do you trust fintech apps with your money? Why?",
        "What single thing would make you trust Moni with savings?",
        "Have you ever lost money/been scammed via an app? What happened?"]),
    ("ACQUISITION", CORAL, [
        "How did you hear about us / similar apps? (channel attribution)",
        "Whose recommendation would make you download a money app?",
        "Net Promoter: how likely are you to recommend Moni? (0–10)"]),
]
x, y = 0.7, 2.05
for i, (t, col, qs) in enumerate(qcards):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 2.25
    card(s, cx, cy, 5.85, 2.05, WHITE)
    chip(s, cx+0.2, cy+0.18, 1.85, 0.34, t, col, WHITE, size=10.5)
    bullets(s, cx+0.25, cy+0.66, 5.4, 1.3, qs, size=10.3, gap=4, bullet_color=col, line_spacing=1.0)
footer(s)

# =============================================================================
# B5. PRIMARY PERSONA
# =============================================================================
def persona(tag, tagcol, name, age, occ, income, goals, frus, apps, buying, motiv, photo_emoji):
    s = slide(); bg(s, OFFWHITE)
    header(s, "B5 · PERSONA", tag, pnum())
    # left identity panel
    rect(s, 0.7, 1.6, 3.7, 4.95, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    rect(s, 2.0, 1.95, 1.1, 1.1, GREEN, shape=MSO_SHAPE.OVAL)
    txt(s, 2.0, 2.12, 1.1, 0.8, [[R(photo_emoji, 40, WHITE)]], align=PP_ALIGN.CENTER)
    txt(s, 0.85, 3.15, 3.4, 0.5, [[R(name, 21, WHITE, True)]], align=PP_ALIGN.CENTER)
    txt(s, 0.85, 3.6, 3.4, 0.35, [[R(f"{age} · {occ}", 12, GREEN_LT, True)]], align=PP_ALIGN.CENTER)
    rect(s, 1.1, 4.05, 2.9, 0.02, GREEN)
    txt(s, 0.95, 4.18, 3.2, 0.35, [[R("INCOME", 10, GREEN_LT, True)]], align=PP_ALIGN.CENTER)
    txt(s, 0.85, 4.45, 3.4, 0.4, [[R(income, 14.5, WHITE, True)]], align=PP_ALIGN.CENTER)
    txt(s, 0.95, 4.98, 3.2, 0.35, [[R("APPS THEY USE", 10, GREEN_LT, True)]], align=PP_ALIGN.CENTER)
    txt(s, 0.9, 5.25, 3.3, 1.1, [[R(apps, 11.5, WHITE)]], align=PP_ALIGN.CENTER, line_spacing=1.05)
    # right detail cards
    def pcard(x, y, w, h, title, col, items):
        card(s, x, y, w, h, WHITE)
        rect(s, x, y, 0.13, h, col)
        txt(s, x+0.28, y+0.13, w-0.4, 0.35, [[R(title, 12, col, True)]])
        bullets(s, x+0.3, y+0.5, w-0.5, h-0.6, items, size=10.6, gap=3.5,
                bullet_color=col, line_spacing=1.02)
    pcard(4.6, 1.6, 4.0, 2.4, "GOALS", GREEN, goals)
    pcard(8.75, 1.6, 3.9, 2.4, "FRUSTRATIONS", CORAL, frus)
    pcard(4.6, 4.15, 4.0, 2.4, "BUYING BEHAVIOUR", NAVY, buying)
    pcard(8.75, 4.15, 3.9, 2.4, "WHY MONI", GREEN, motiv)
    footer(s)
    return s

persona("Primary Persona", GREEN,
        "Tobi Adeyemi", "22", "300L Student & micro-hustler", "₦25k–₦60k / month (irregular)",
        ["Make allowance + side gigs last the full month",
         "Save ₦100k for a laptop without 'feeling' it",
         "Stop borrowing from friends before month-end"],
        ["Money vanishes — no idea where it went",
         "Allowance arrives irregularly; can't plan",
         "Existing apps assume a fixed monthly salary"],
        "WhatsApp · TikTok · Instagram · Opay · Chowdeck",
        ["Discovers apps via TikTok & friends' referrals",
         "Won't pay upfront; loves free + rewards",
         "Trusts peer word-of-mouth over ads"],
        ["Auto-save round-ups that fit gig income",
         "Goal challenges make saving feel like a game",
         "Small advance to survive to month-end"],
        "🧑🏾")
notes(prs.slides[-1],
      "Tobi is the wedge user: high TikTok reach, refers friends, but extremely retention-fragile. "
      "Win Tobi with gamified, flexible, free, peer-driven design. He is also our cheapest acquisition "
      "channel — referrals — if the product is genuinely habit-forming.")

# SECONDARY PERSONA
persona("Secondary Persona", NAVY,
        "Amaka Okonkwo", "27", "Junior marketer (young salary earner)", "₦180k–₦350k / month",
        ["Build a 3-month emergency buffer",
         "Automate savings so she isn't tempted",
         "Track black-tax & subscriptions in one place"],
        ["'Salary finished' by the second week",
         "Juggling 4 apps for money — none cohesive",
         "Worried about hidden fees & app scams"],
        "Instagram · LinkedIn · X · PiggyVest · Kuda",
        ["Researches before trusting an app with money",
         "Reads reviews; values transparency & support",
         "Will pay for convenience if trust is earned"],
        ["One companion app instead of four",
         "Transparent fees + insured partner build trust",
         "Smart nudges curb lifestyle creep"],
        "👩🏾")
notes(prs.slides[-1],
      "Amaka is the value & trust user — higher LTV, more skeptical, slower to convert. She validates "
      "the trust-first positioning and transparent-fee messaging. Tobi drives reach and referrals; "
      "Amaka drives revenue and credibility. The campaign must speak to both.")

# =============================================================================
# SECTION C DIVIDER
# =============================================================================
divider("C", "Go-To-Market Strategy",
        "Position it sharply, launch it loudly, and spend the ₦12m where it compounds.",
        ["Positioning, tagline & messaging pillars",
         "A viral, culturally-rooted launch campaign",
         "₦12m budget allocation across nine channels"], 15)

# =============================================================================
# C. CUSTOMER JOURNEY MAP
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C · STRATEGY", "Customer Journey Map", pnum())
stagesj = ["AWARENESS", "CONSIDERATION", "ONBOARDING", "FIRST SAVE", "HABIT", "ADVOCACY"]
emos = ["😐 Curious", "🤔 Skeptical", "🙂 Hopeful", "😀 Relieved", "😎 Confident", "🤩 Proud"]
colsj = [GREEN, NAVY, GREEN, NAVY, GREEN, NAVY]
n = len(stagesj); cw = 1.93; gap = 0.07; startx = 0.55
# stage header band
for i, st in enumerate(stagesj):
    cx = startx + i*(cw+gap)
    rect(s, cx, 1.55, cw, 0.5, colsj[i], shape=MSO_SHAPE.PENTAGON)
    txt(s, cx, 1.62, cw-0.18, 0.35, [[R(st, 10, WHITE, True)]], align=PP_ALIGN.CENTER)
rows_j = [
    ("USER THINKS", ["“What's this Moni?”", "“Can I trust them with my money?”", "“This setup is easy.”", "“I actually saved!”", "“My streak is growing.”", "“You need to try this.”"]),
    ("TOUCHPOINT", ["TikTok, referral, OOH", "Reviews, PR, website", "App onboarding, KYC", "Auto-save rule, bonus", "Push, streaks, community", "Referral cards, UGC"]),
    ("MONI ACTION", ["#MoniChallenge content", "Trust & fee transparency", "<3-min flow, ₦500 bonus", "Round-up + goal nudge", "Smart triggers + badges", "Give ₦1k/Get ₦1k"]),
]
ry = 2.15
rh = [1.35, 1.2, 1.2]
for ri, (rl, cells) in enumerate(rows_j):
    txt(s, 0.0, ry+rh[ri]/2-0.2, 0.5, 0.5, [[R("", 8, GREY)]])
    for i in range(n):
        cx = startx + i*(cw+gap)
        fill = WHITE if ri != 0 else GREEN_PALE
        card(s, cx, ry, cw, rh[ri]-0.1, fill)
        txt(s, cx+0.1, ry+0.08, cw-0.2, rh[ri]-0.2, [[R(cells[i], 9.3, DARK)]], line_spacing=1.0)
    # row label chip on far left overlapping
    ry += rh[ri]
# emotion strip
ey = ry + 0.02
for i in range(n):
    cx = startx + i*(cw+gap)
    rect(s, cx, ey, cw, 0.45, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    txt(s, cx, ey+0.08, cw, 0.3, [[R(emos[i], 9.5, WHITE, True)]], align=PP_ALIGN.CENTER)
txt(s, 0.55, ey+0.6, 12.2, 0.4, [
    [R("Critical moment:  ", 12, GREEN, True),
     R("the jump from Onboarding to First Save is where 82% currently drop. Every tactic above is "
       "engineered to carry the user across that gap.", 11.5, DARK)],
])
notes(s, "The journey map exposes the single highest-leverage moment: ONBOARDING → FIRST SAVE. That is "
         "the activation cliff where most churn happens. The ₦500 instant-save bonus and sub-3-minute "
         "flow exist specifically to bridge it. Emotion row keeps us honest about how the user actually "
         "feels at each step.")

# =============================================================================
# C. AARRR GROWTH FUNNEL
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C · STRATEGY", "The Growth Funnel (AARRR)", pnum())
funnel = [
    ("ACQUISITION", "Reach young Nigerians cheaply", "Referral, TikTok, campus, influencers", "CAC ₦4,200 → ₦2,600", GREEN, 7.0),
    ("ACTIVATION", "Get them to their FIRST SAVE fast", "<3-min onboarding + ₦500 bonus", "Activation 55%+", NAVY, 6.1),
    ("RETENTION", "Build a daily money habit", "Streaks, push, community, challenges", "D30 18% → 35%+", GREEN, 5.2),
    ("REFERRAL", "Turn savers into recruiters", "Give ₦1k / Get ₦1k on first save", "K-factor 0.3–0.5", NAVY, 4.3),
    ("REVENUE", "Sustainable unit economics", "Advance fees + premium + float", "LTV:CAC ≥ 3:1", GREEN, 3.4),
]
ZONE_X, ZONE_W = 0.6, 7.5          # left zone the funnel is centred within
ANN_X, ANN_W = 8.35, 4.45          # fixed right-hand annotation column
fy = 1.75
for i, (t, what, how, kpi, col, w) in enumerate(funnel):
    cx = ZONE_X + (ZONE_W - w)/2
    rect(s, cx, fy, w, 0.78, col, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    txt(s, cx, fy+0.1, w, 0.32, [[R(t, 13, WHITE, True)]], align=PP_ALIGN.CENTER)
    txt(s, cx, fy+0.43, w, 0.3, [[R(what, 9.3, WHITE)]], align=PP_ALIGN.CENTER)
    # annotations in fixed right column
    txt(s, ANN_X, fy+0.05, ANN_W, 0.4, [[R("How:  ", 9.5, col, True), R(how, 9.5, GREY)]], line_spacing=0.95)
    txt(s, ANN_X, fy+0.42, ANN_W, 0.35, [[R("Target:  ", 9.5, col, True), R(kpi, 9.5, NAVY, True)]])
    fy += 0.95
txt(s, 0.7, 6.65, 12, 0.5, [
    [R("Where the leverage is:  ", 12, GREEN, True),
     R("the funnel is widest at Acquisition but breaks at Activation & Retention. Fixing the middle is "
       "worth more than widening the top.", 11.5, DARK)],
])
notes(s, "The AARRR / pirate-metrics funnel ties the whole strategy together: each stage has a tactic "
         "AND a measurable target from the metrics section. The narrowing shape visually argues the "
         "thesis — don't widen the top of a leaky funnel; fix activation and retention first.")

# =============================================================================
# C6. POSITIONING & MESSAGING
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C6 · POSITIONING & MESSAGING", "Positioning & Messaging Architecture", pnum())
rect(s, 0.7, 1.55, 12.0, 1.35, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 1.68, 11.5, 0.35, [[R("POSITIONING STATEMENT", 11.5, GREEN_LT, True)]])
txt(s, 0.95, 2.0, 11.5, 0.85, [
    [R("For ", 14.5, WHITE), R("ambitious young Nigerians", 14.5, GREEN_LT, True),
     R(" with irregular income, ", 14.5, WHITE), R("Moni", 14.5, GREEN_LT, True),
     R(" is the everyday money companion that automatically saves, tracks, reminds and rescues — "
       "so that ", 14.5, WHITE),
     R("unlike single-purpose savings or payment apps", 14.5, GREEN_LT, True),
     R(", money anxiety never gets in the way of ambition.", 14.5, WHITE)],
], line_spacing=1.03)
# tagline
rect(s, 0.7, 3.05, 5.85, 1.1, GREEN, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 3.16, 5.4, 0.3, [[R("CAMPAIGN TAGLINE", 11, NAVY, True)]])
txt(s, 0.95, 3.45, 5.4, 0.65, [[R("“Moni Don Set You.”", 23, WHITE, True)]])
txt(s, 0.95, 4.02, 5.4, 0.3, [[R("(Naija for: Moni has you sorted / set up)", 10, NAVY, False, True)]])
# emotional + trust angle
card(s, 6.75, 3.05, 5.9, 1.1, GREEN_PALE, GREEN_LT)
txt(s, 6.95, 3.16, 5.5, 0.3, [[R("EMOTIONAL ANGLE", 11, GREEN, True)]])
txt(s, 6.95, 3.45, 5.5, 0.6, [[R("“From broke before month-end to one step ahead.” "
                                 "Dignity, calm and confidence over money.", 12, NAVY, True)]],
    line_spacing=1.0)
# pillars
txt(s, 0.7, 4.4, 12, 0.35, [[R("CORE MESSAGING PILLARS", 12, NAVY, True)]])
pillars = [
    ("Automatic", "It saves & reminds for you — discipline without willpower.", GREEN),
    ("Trustworthy", "Transparent fees, insured partner, no wahala, no hidden charges.", NAVY),
    ("For your reality", "Built for irregular income — students, NYSC, hustlers.", GREEN),
    ("Rewarding", "Challenges, streaks & referrals make progress feel good.", NAVY),
]
x = 0.7
for t, d, col in pillars:
    card(s, x, 4.8, 2.92, 1.25, WHITE)
    rect(s, x, 4.8, 2.92, 0.09, col)
    txt(s, x+0.18, 4.95, 2.6, 0.4, [[R(t, 13.5, col, True)]])
    txt(s, x+0.18, 5.35, 2.6, 0.65, [[R(d, 10.2, GREY)]], line_spacing=1.0)
    x += 3.05
# trust angle strip
rect(s, 0.7, 6.2, 12.0, 0.62, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 6.3, 11.6, 0.45, [
    [R("TRUST-BUILDING ANGLE:  ", 11.5, GREEN_LT, True),
     R("“Your money is insured and your fees are written in plain language — see every kobo "
       "before you tap.”  Real users, real receipts, real support.", 11.5, WHITE)],
])
notes(s, "Positioning follows the classic 'For/who/is/that/unlike' formula. Tagline 'Moni Don Set You' "
         "is culturally rooted, memorable, and works as a referral phrase. The trust angle is critical "
         "given sector scam anxiety — lead with insurance + fee transparency, proven by real receipts.")

# =============================================================================
# C7. CREATIVE CAMPAIGN — CONCEPT
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C7 · CREATIVE CAMPAIGN", "Launch Campaign:  #MoniChallenge", pnum())
rect(s, 0.7, 1.55, 12.0, 1.4, GREEN, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 1.7, 11.5, 0.4, [[R("THE BIG IDEA", 12, NAVY, True)]])
txt(s, 0.95, 2.05, 11.5, 0.9, [
    [R("“From Broke to Set in 30 Days.”  ", 16, WHITE, True),
     R("A public 30-day savings challenge where young Nigerians post their Day 1 vs Day 30 "
       "'Moni glow-up' — turning a private money struggle into a shared, gamified win with bragging "
       "rights, streaks and prizes.", 14, WHITE)],
], line_spacing=1.03)
cols = [
    ("📱 SOCIAL EXECUTION", GREEN, [
        "TikTok/Reels 'Day 1 vs Day 30' transformation trend",
        "Original sound + on-screen savings counter",
        "X threads: 'How I saved ₦50k on stipend' stories",
        "Weekly leaderboard & badge reveals"]),
    ("⭐ INFLUENCERS", NAVY, [
        "3–4 mid-tier creators (finance/comedy/campus, 50k–300k)",
        "20–30 nano campus creators (₦ + free premium)",
        "Authentic 'I tried Moni for 30 days' content, not ads",
        "Skit-makers for relatable 'broke before month-end' humour"]),
    ("🎓 CAMPUS ACTIVATION", GREEN, [
        "'Moni on Campus' pop-ups at UNILAG, UI, UNIBEN",
        "Live sign-up + instant ₦500 save bonus",
        "Brand ambassadors run hostel challenges",
        "Class-vs-class & faculty savings leaderboards"]),
    ("🔁 REFERRAL & OFFLINE", NAVY, [
        "Give ₦1,000 / Get ₦1,000 on referee's first save",
        "Shareable referral cards with personal streak",
        "Branded danfo/keke wraps & campus billboards",
        "Market & NYSC camp activations with QR sign-up"]),
]
x, y = 0.7, 3.1
for i, (t, col, items) in enumerate(cols):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 1.78
    card(s, cx, cy, 5.85, 1.6, WHITE)
    txt(s, cx+0.2, cy+0.13, 5.5, 0.35, [[R(t, 12, col, True)]])
    bullets(s, cx+0.25, cy+0.52, 5.4, 1.0, items, size=9.6, gap=2, bullet_color=col, line_spacing=0.98)
notes(s, "The campaign converts a private, shameful problem (being broke) into a public, aspirational "
         "win (the glow-up). That's what makes it shareable. Note the referral mechanic only pays out "
         "on the referee's FIRST SAVE, not signup — this ties spend to activation, protecting CAC and "
         "filtering bonus-hunters.")

# =============================================================================
# C8. BUDGET ALLOCATION — CHART + TABLE
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C8 · CHANNELS & BUDGET", "Allocating the ₦12,000,000 Launch Budget", pnum())
# data: channel, amount (m), reason short, est outcome
budget = [
    ("Referral rewards", 2.4, "Lowest-CAC, compounding word-of-mouth", "~3,000 activated installs"),
    ("Influencer marketing", 2.2, "Trust by association; mid + nano creators", "4–6m views; ~2,500 installs"),
    ("Campus activations", 1.8, "Face-to-face trust; high-intent sign-ups", "12 campuses; ~3,000 sign-ups"),
    ("TikTok ads", 1.5, "Cheapest reach to Gen-Z; #MoniChallenge fuel", "5–7m impressions"),
    ("Instagram ads", 1.2, "Polished retargeting & lookalikes", "3–4m impressions"),
    ("Community marketing", 1.0, "Retention engine: WhatsApp/Telegram groups", "Higher D30 retention"),
    ("X (Twitter)", 0.7, "Fintech Twitter buzz, threads, trust talk", "Earned reach & credibility"),
    ("PR & media", 0.7, "Legitimacy via TechCabal, press, NDIC story", "Trust signal & backlinks"),
    ("OOH / offline", 0.5, "Local salience: campus boards, transport wraps", "Geo-targeted awareness"),
]
# donut/pie chart
chart_data = CategoryChartData()
chart_data.categories = [b[0] for b in budget]
chart_data.add_series("Budget (₦m)", [b[1] for b in budget])
gf = s.shapes.add_chart(XL_CHART_TYPE.DOUGHNUT, Inches(0.55), Inches(1.7),
                        Inches(4.7), Inches(4.7), chart_data)
chart = gf.chart
chart.has_legend = True
chart.legend.position = XL_LEGEND_POSITION.RIGHT
chart.legend.include_in_layout = False
chart.legend.font.size = Pt(8.5)
plot = chart.plots[0]
plot.has_data_labels = True
plot.data_labels.number_format = '0.0"m"'
plot.data_labels.number_format_is_linked = False
plot.data_labels.font.size = Pt(8)
plot.data_labels.font.bold = True
plot.data_labels.font.color.rgb = WHITE
pie_cols = [GREEN, NAVY, GREEN_LT, GOLD, CORAL, NAVY_2,
            RGBColor(0x3D,0x8B,0x6E), RGBColor(0x7A,0x90,0xA8), RGBColor(0xC0,0xCA,0xC6)]
for i, pt in enumerate(plot.series[0].points):
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = pie_cols[i % len(pie_cols)]
chart.has_title = False
# table on right
tdata = [["Channel", "₦", "Why it matters", "Expected outcome"]]
for name, amt, why, out in budget:
    tdata.append([name, f"{amt:.1f}m", why, out])
tdata.append(["TOTAL", "12.0m", "Compounding-first mix (61% earned/owned-leaning)", "≈ 10–14k activated installs"])
tbl = make_table(s, 5.45, 1.7, 7.35, tdata,
                 col_widths=[1.35, 0.6, 2.5, 2.0],
                 row_h=0.43, header_h=0.36, body_size=8.7, header_size=9.8)
# bold the total row
for ci in range(4):
    cell = tbl.cell(len(tdata)-1, ci)
    cell.fill.solid(); cell.fill.fore_color.rgb = GREEN_PALE
    for p in cell.text_frame.paragraphs:
        for r in p.runs:
            r.font.bold = True; r.font.color.rgb = NAVY
txt(s, 0.55, 6.65, 12.3, 0.5, [
    [R("Logic:  ", 12, GREEN, True),
     R("over-index on channels that compound and build trust (referral, influencers, campus, community "
       "= 61%) and use paid social as accelerant, not crutch — the path to driving CAC from ₦4,200 "
       "toward ₦2,600.", 11.5, DARK)],
])
notes(s, "Budget philosophy: paid ads rent attention and stop the moment you stop paying; referral, "
         "community and campus build owned, compounding assets that keep working. 61% goes to "
         "compounding/trust channels. All reach/outcome figures are illustrative planning estimates "
         "to be validated against early CAC data, then reallocated weekly toward winners.")

# =============================================================================
# C. GTM LAUNCH TIMELINE
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "C · GO-TO-MARKET", "Launch Roadmap: 3 Phases", pnum())
phases = [
    ("PHASE 1 · PRE-LAUNCH", "Weeks -4 → 0", GREEN,
     ["Finish research & finalise personas", "Lock positioning, creative & assets", "Recruit influencers & 30 campus ambassadors", "Seed WhatsApp/Telegram communities", "Set up analytics, events & dashboard", "Brief PR; line up launch coverage"],
     "Goal: ready to launch with trust assets & tracking live"),
    ("PHASE 2 · LAUNCH", "Weeks 1 → 4", NAVY,
     ["Kick off #MoniChallenge across all channels", "Campus activations in 12 schools", "Influencer + paid social go live", "Daily content per the calendar", "Run first A/B tests (creative, CTA)", "Daily CAC & activation monitoring"],
     "Goal: maximise awareness + first-save activation"),
    ("PHASE 3 · SCALE & OPTIMISE", "Weeks 5 → 12", GREEN,
     ["Double down on winning channels (low CAC)", "Referral engine front-and-centre", "Retention pushes & resurrection campaigns", "Continuous A/B testing cadence", "Monthly investor & stakeholder reports", "Reallocate budget toward LTV:CAC ≥ 3:1"],
     "Goal: drive CAC down, retention up, prove unit economics"),
]
x = 0.7
for i, (t, wk, col, items, goal) in enumerate(phases):
    cx = 0.7 + i*4.03
    card(s, cx, 1.6, 3.85, 4.55, WHITE)
    rect(s, cx, 1.6, 3.85, 0.78, col, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    rect(s, cx, 2.0, 3.85, 0.38, col)
    txt(s, cx+0.18, 1.7, 3.5, 0.35, [[R(t, 11.5, WHITE, True)]])
    txt(s, cx+0.18, 2.04, 3.5, 0.3, [[R(wk, 10.5, WHITE)]])
    bullets(s, cx+0.22, 2.55, 3.45, 2.6, items, size=9.8, gap=4.5, bullet_color=col, line_spacing=1.0)
    rect(s, cx+0.18, 5.5, 3.5, 0.55, GREEN_PALE, GREEN_LT)
    txt(s, cx+0.3, 5.57, 3.3, 0.45, [[R(goal, 9, NAVY, True)]], line_spacing=0.95)
    if i < 2:
        txt(s, cx+3.78, 3.5, 0.35, 0.5, [[R("→", 18, GREEN, True)]], align=PP_ALIGN.CENTER)
footer(s)

# =============================================================================
# SECTION D DIVIDER
# =============================================================================
divider("D", "Metrics, Data & Optimization",
        "What we measure, the dashboard we watch, and how we test our way to lower CAC.",
        ["The KPI set: before vs after launch & why each matters",
         "A live metrics dashboard outline",
         "A full A/B testing framework across five levers"], 15)

# =============================================================================
# D9. METRICS
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "D9 · PRODUCT MARKETING METRICS", "The Metrics That Matter", pnum())
mdata = [
    ["Metric", "Now (baseline)", "90-day target", "Why it matters"],
    ["CAC", "₦4,200", "₦2,600", "Efficiency of spend; lower CAC = scalable growth"],
    ["Activation rate", "~ n/a (track)", "55%+", "% who complete first save — the real 'aha' moment"],
    ["30-day retention", "18%", "35%+", "The core problem; proves habit & product value"],
    ["Churn rate (D30)", "82%", "<65%", "Inverse of retention; flags leaks to fix fast"],
    ["DAU / WAU", "640 WAU", "6,000+ WAU", "Daily habit & engagement health"],
    ["Conversion rate", "track", "8–12%", "Install → funded account; funnel efficiency"],
    ["Referral rate (K)", "track", "0.3–0.5", "Virality; each user brings ~0.3–0.5 more = lower CAC"],
    ["LTV  &  LTV:CAC", "track", "≥ 3:1", "Profitability; sustainable unit economics"],
]
make_table(s, 0.7, 1.6, 11.95, mdata,
           col_widths=[1.45, 1.4, 1.3, 3.6],
           row_h=0.49, header_h=0.4, body_size=10.3, header_size=11)
txt(s, 0.7, 6.55, 12, 0.6, [
    [R("North-star metric:  ", 12.5, GREEN, True),
     R("weekly count of users who hit a savings streak ≥ 7 days", 12.5, NAVY, True),
     R(" — it captures activation, habit and retention in one number.", 12.5, DARK)],
])
notes(s, "Sequence the metrics as a funnel: CAC (acquire) → activation (first save) → retention/churn "
         "(habit) → DAU (engagement) → referral (compounding) → LTV:CAC (sustainability). Activation is "
         "the priority lever: fixing the first-save completion rate cascades into retention and lowers "
         "effective CAC. The 3:1 LTV:CAC rule is the standard for healthy fintech unit economics.")

# =============================================================================
# D9b. DASHBOARD OUTLINE
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "D9 · METRICS DASHBOARD", "Weekly Growth Dashboard (Outline)", pnum())
txt(s, 0.7, 1.5, 12, 0.4, [[R("One screen, reviewed every Monday — built in Mixpanel/Amplitude + "
                              "Looker Studio, fed by app events & ad platforms.", 12.5, GREY, False, True)]])
panels = [
    ("ACQUISITION", GREEN, ["Installs by channel", "CAC by channel", "Spend pacing vs budget", "CPM / CPC trends"]),
    ("ACTIVATION", NAVY, ["First-save rate", "Time-to-first-save", "Onboarding drop-off funnel", "KYC completion"]),
    ("ENGAGEMENT", GOLD, ["DAU / WAU / MAU", "Feature usage mix", "Streak distribution", "Session frequency"]),
    ("RETENTION", CORAL, ["D1 / D7 / D30 cohorts", "Churn rate & reasons", "Resurrection rate", "NPS trend"]),
    ("VIRALITY", GREEN, ["Referral rate (K-factor)", "Invites sent vs converted", "Referral CAC", "Share-of-installs"]),
    ("UNIT ECONOMICS", NAVY, ["LTV", "LTV:CAC ratio", "Payback period", "Revenue per user"]),
]
x, y = 0.7, 2.1
for i, (t, col, items) in enumerate(panels):
    cx = x + (i % 3) * 4.03
    cy = y + (i // 3) * 2.2
    card(s, cx, cy, 3.85, 2.0, WHITE)
    rect(s, cx, cy, 3.85, 0.5, col, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    rect(s, cx, cy+0.25, 3.85, 0.25, col)
    txt(s, cx+0.2, cy+0.1, 3.5, 0.35, [[R(t, 12.5, WHITE, True)]])
    bullets(s, cx+0.25, cy+0.62, 3.4, 1.3, items, size=10.3, gap=3.5, bullet_color=col)
footer(s)

# =============================================================================
# D10. A/B TESTING FRAMEWORK
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "D10 · A/B TESTING", "An Always-On A/B Testing Engine", pnum())
# process strip
steps = ["Hypothesis", "Single variable", "Split traffic 50/50", "Reach significance (95%)", "Ship winner, iterate"]
x = 0.7
for i, st in enumerate(steps):
    chip(s, x, 1.55, 2.15, 0.55, f"{i+1}. {st}", NAVY if i % 2 == 0 else GREEN, WHITE, size=10)
    if i < len(steps)-1:
        txt(s, x+2.15, 1.55, 0.32, 0.55, [[R("→", 18, GREEN, True)]], align=PP_ALIGN.CENTER,
            anchor=MSO_ANCHOR.MIDDLE)
    x += 2.47
abdata = [
    ["What we test", "Variant A", "Variant B", "Primary KPI (winner)", "Success looks like"],
    ["Ad creative", "Aspirational glow-up", "Comedy/skit 'broke' humour", "CTR & CAC", "≥20% lower CAC at equal CTR"],
    ["Messaging", "“Save automatically”", "“Never be broke before month-end”", "Install conv. rate", "≥15% lift in install→signup"],
    ["Call-to-action", "“Start Saving”", "“Set Yourself”", "Tap-through rate", "Higher CTR at 95% confidence"],
    ["Referral incentive", "Give ₦1k / Get ₦1k", "Give 2 weeks Premium", "Referral rate & ref-CAC", "Higher K-factor at lower cost"],
    ["Push notification", "Plain reminder", "Personalised + emoji streak", "Open & D7 retention", "≥10% higher open & D7 keep"],
]
make_table(s, 0.7, 2.4, 11.95, abdata,
           col_widths=[1.4, 1.75, 1.95, 1.65, 2.1],
           row_h=0.58, header_h=0.45, body_size=10, header_size=10.5)
txt(s, 0.7, 6.55, 12, 0.6, [
    [R("Discipline:  ", 12.5, GREEN, True),
     R("one variable per test, pre-declared KPI & sample size, run to statistical significance before "
       "calling a winner — then fold the winner into the next test. Compounding small wins is how CAC "
       "falls week over week.", 12, DARK)],
])
notes(s, "Stress the rigour: change one variable, pre-register the hypothesis and success threshold, "
         "run to 95% significance with adequate sample, avoid peeking. Each test names ONE primary KPI "
         "that decides the winner (guardrail metrics watched but not deciding). The referral test is "
         "highest-leverage because it directly attacks CAC. This is a continuous engine, not a one-off.")

# =============================================================================
# SECTION E DIVIDER
# =============================================================================
divider("E", "Execution & Stakeholder Management",
        "Turning strategy into a calendar, relationships and a reporting rhythm.",
        ["A 2-week content & editorial calendar",
         "Stakeholder relationship management plan",
         "Documentation & reporting system"], 10)

# =============================================================================
# E11. CONTENT CALENDAR — WEEK 1
# =============================================================================
def calendar(week_label, rows, num):
    s = slide(); bg(s, OFFWHITE)
    header(s, "E11 · CONTENT STRATEGY", f"2-Week Content Calendar — {week_label}", num)
    data = [["Day", "Theme", "Content idea / format", "Channel", "Goal"]] + rows
    tbl = make_table(s, 0.55, 1.6, 12.25, data,
                     col_widths=[0.95, 1.5, 4.1, 1.4, 1.3],
                     row_h=0.66, header_h=0.4, body_size=9.5, header_size=10.5)
    return s

w1 = [
    ["Mon", "Launch / Awareness", "Teaser reveal: '#MoniChallenge starts now' hype video", "TikTok, IG, X", "Awareness"],
    ["Tue", "Education", "Carousel: '5 reasons you're broke before month-end' (+fix)", "IG, X", "Educate"],
    ["Wed", "Influencer", "Comedy creator skit: 'POV: your money before vs after Moni'", "TikTok, IG", "Reach"],
    ["Thu", "Community", "WhatsApp/Telegram group launch + Day-1 challenge prompt", "Community", "Activate"],
    ["Fri", "Trust", "Founder talk: 'Your money is insured — here's how' explainer", "X, IG, PR", "Trust"],
    ["Sat", "Engagement", "Poll + UGC repost: 'What are you saving for?'", "IG Stories, X", "Engage"],
    ["Sun", "Inspiration", "Goal spotlight: real user's savings target & streak", "IG, TikTok", "Retain"],
]
calendar("Week 1: Launch & Awareness", w1, pnum())
notes(prs.slides[-1],
      "Week 1 is about loud awareness + immediate activation (joining the challenge & first save), with "
      "a deliberate trust beat on Friday to pre-empt scam skepticism. Mix of owned, influencer and "
      "community content so we're not reliant on paid reach alone.")

w2 = [
    ["Mon", "Progress", "Leaderboard reveal + badge drops for top savers", "IG, TikTok", "Retain"],
    ["Tue", "Education", "Reel: 'How auto-save round-ups actually work' (60s)", "TikTok, IG", "Educate"],
    ["Wed", "Influencer", "Finance creator: 'I saved ₦50k on my stipend — here's how'", "X thread, IG", "Convert"],
    ["Thu", "Referral push", "Referral week: 'Give ₦1k, Get ₦1k' shareable cards", "All channels", "Referral"],
    ["Fri", "Trust / PR", "Press feature + user testimonials with real receipts", "PR, X, IG", "Trust"],
    ["Sat", "Campus", "Campus activation recap + class-vs-class leaderboard", "TikTok, IG", "Awareness"],
    ["Sun", "Celebrate", "Day-30 'glow-up' winners + prize reveal, CTA to join next", "All channels", "Loop"],
]
calendar("Week 2: Momentum, Referral & Proof", w2, pnum())
notes(prs.slides[-1],
      "Week 2 shifts from awareness to conversion, referral and social proof. Thursday's referral push "
      "and Friday's receipts-based testimonials are the CAC-lowering and trust-building beats. Sunday "
      "closes the loop and recruits the next cohort — making the challenge evergreen.")

# =============================================================================
# E12. STAKEHOLDER MANAGEMENT
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "E12 · STAKEHOLDER MANAGEMENT", "Managing Key Relationships", pnum())
stake = [
    ("Influencers", "🎤", "Clear briefs + creative freedom; fair & on-time pay; long-term partners over one-offs; track performance, reward top performers."),
    ("Campus ambassadors", "🎓", "Structured program, training & swag; tiered incentives & leaderboards; WhatsApp community; monthly recognition & growth paths."),
    ("Media platforms", "📰", "Build genuine PR relationships; exclusive data/stories; press kit ready; respond fast; pitch the 'trust-first fintech' angle."),
    ("Internal product team", "🛠️", "Shared roadmap & weekly syncs; feed user/market insights back; align launch & feature timing; one source of truth."),
    ("Customer support", "💬", "Equip with FAQs & macros; tight feedback loop to product; SLA on response; support is a trust-builder, not a cost centre."),
    ("Investors", "📈", "Monthly KPI updates (CAC, retention, LTV:CAC); transparent on wins & misses; tie spend to metrics; manage expectations honestly."),
]
x, y = 0.7, 1.6
for i, (t, emo, d) in enumerate(stake):
    cx = x + (i % 3) * 4.03
    cy = y + (i // 3) * 2.45
    card(s, cx, cy, 3.85, 2.25, WHITE)
    rect(s, cx, cy, 0.13, 2.25, [GREEN, NAVY, GOLD, GREEN, NAVY, GOLD][i])
    txt(s, cx+0.28, cy+0.16, 0.7, 0.5, [[R(emo, 20, DARK)]])
    txt(s, cx+0.95, cy+0.24, 2.85, 0.5, [[R(t, 13, NAVY, True)]])
    txt(s, cx+0.3, cy+0.85, 3.4, 1.35, [[R(d, 10.3, GREY)]], line_spacing=1.05)
footer(s)

# =============================================================================
# E13. DOCUMENTATION & REPORTING
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "E13 · DOCUMENTATION & REPORTING", "How We Document & Report", pnum())
doc = [
    ("Campaign performance", GREEN, "Live Looker Studio dashboard + weekly one-pager: spend, CAC, installs, conversions by channel."),
    ("Research findings", NAVY, "Central research repo (Notion): interview notes, survey results, insight summaries, persona updates."),
    ("Marketing learnings", GOLD, "A/B test log: hypothesis, result, decision, next step — a growing 'what works' playbook."),
    ("Customer feedback", CORAL, "Tagged feedback from support, reviews & social, routed to product; closed-loop tracking."),
]
x, y = 0.7, 1.65
for i, (t, col, d) in enumerate(doc):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 1.55
    card(s, cx, cy, 5.85, 1.4, WHITE)
    rect(s, cx, cy, 0.13, 1.4, col)
    txt(s, cx+0.3, cy+0.17, 5.4, 0.4, [[R(t, 13.5, NAVY, True)]])
    txt(s, cx+0.3, cy+0.6, 5.4, 0.7, [[R(d, 10.8, GREY)]], line_spacing=1.04)
# reporting rhythm
rect(s, 0.7, 4.95, 12.0, 1.7, NAVY, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 5.1, 11.5, 0.4, [[R("REPORTING RHYTHM", 12, GREEN_LT, True)]])
rhythm = [
    ("Daily", "Auto dashboard check: spend pacing, CAC, anomalies"),
    ("Weekly", "Growth review: KPIs vs target, A/B results, reallocate budget"),
    ("Monthly", "Stakeholder + investor report: trends, learnings, next-month plan"),
]
x = 1.0
for tlabel, d in rhythm:
    chip(s, x, 5.5, 1.5, 0.42, tlabel, GREEN, WHITE, size=12)
    txt(s, x, 6.02, 3.6, 0.55, [[R(d, 10.3, WHITE)]], line_spacing=1.0)
    x += 3.9
footer(s)

# =============================================================================
# RETENTION STRATEGY (bonus depth — final deliverable item)
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "RETENTION", "The Retention Engine (Fixing the 18%)", pnum())
txt(s, 0.7, 1.5, 12, 0.45, [[R("Retention is Moni's #1 problem — and its biggest growth lever. "
                               "We attack it across the full lifecycle.", 13.5, DARK, True)]])
stages = [
    ("ONBOARD", GREEN, ["Get to first save in <3 mins", "₦500 instant save bonus", "Pick a goal during signup", "Plain-language trust screen"]),
    ("HABIT (D1–D7)", NAVY, ["Smart push at payday/spend", "7-day streak challenge", "Round-up auto-save on", "Bill reminder quick-wins"]),
    ("ENGAGE (D7–D30)", GOLD, ["Goal challenges & badges", "Community leaderboards", "Weekly progress recap", "Unlock advance eligibility"]),
    ("LOYAL (D30+)", CORAL, ["Referral rewards", "Premium perks & streaks", "Milestone celebrations", "Resurrect lapsed via offers"]),
]
x = 0.7
for i, (t, col, items) in enumerate(stages):
    cx = 0.7 + i*3.05
    card(s, cx, 2.2, 2.92, 3.5, WHITE)
    rect(s, cx, 2.2, 2.92, 0.55, col, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    rect(s, cx, 2.45, 2.92, 0.3, col)
    txt(s, cx, 2.3, 2.92, 0.4, [[R(t, 12, WHITE, True)]], align=PP_ALIGN.CENTER)
    bullets(s, cx+0.22, 2.95, 2.55, 2.6, items, size=10.3, gap=6, bullet_color=col)
    if i < 3:
        txt(s, cx+2.78, 3.6, 0.35, 0.5, [[R("→", 16, GREEN, True)]], align=PP_ALIGN.CENTER)
    x += 3.05
rect(s, 0.7, 5.95, 12.0, 0.72, GREEN, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, 0.95, 6.06, 11.6, 0.5, [
    [R("Habit beats willpower:  ", 12.5, NAVY, True),
     R("automation + streaks + community + emotional reward turn a one-time saver into a daily user — "
       "moving D30 retention from 18% toward 35%+.", 12.5, WHITE)],
])
notes(s, "This slide directly answers the founders' core fear (users churn fast). The mechanism: reduce "
         "time-to-value (first save fast), then build habit via behavioural triggers (streaks, push, "
         "community), then convert habit to loyalty (referrals, perks). Each stage maps to a measured "
         "cohort in the dashboard.")

# =============================================================================
# FINAL RECOMMENDATIONS
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "CLOSE", "Final Recommendations", pnum())
recs = [
    ("Fix the funnel before scaling spend", "Prioritise activation (first save) & D30 retention — pour budget into a leaky bucket and CAC stays high."),
    ("Win on trust & habit, not features", "Own the 'everyday companion + transparent, insured' narrative no competitor holds."),
    ("Spend where it compounds", "61% of the ₦12m into referral, influencers, campus & community; paid social as accelerant."),
    ("Make saving social & fun", "#MoniChallenge turns a private struggle into a public glow-up — built-in virality."),
    ("Test relentlessly", "An always-on A/B engine drives CAC from ₦4,200 toward ₦2,600 through compounding wins."),
    ("Report on what matters", "Run the business on activation, retention, referral & LTV:CAC — not vanity installs."),
]
x, y = 0.7, 1.65
for i, (t, d) in enumerate(recs):
    cx = x + (i % 2) * 6.05
    cy = y + (i // 2) * 1.55
    card(s, cx, cy, 5.85, 1.4, WHITE)
    chip(s, cx+0.18, cy+0.45, 0.5, 0.5, str(i+1), GREEN if i%2==0 else NAVY, WHITE, size=18)
    txt(s, cx+0.85, cy+0.16, 4.85, 0.5, [[R(t, 12.8, NAVY, True)]])
    txt(s, cx+0.85, cy+0.62, 4.85, 0.7, [[R(d, 10.3, GREY)]], line_spacing=1.03)
footer(s)
notes(s, "Land the plane: the strategy is coherent because every part serves one thesis — Moni doesn't "
         "have an acquisition problem, it has a retention & trust problem, and fixing that is what makes "
         "acquisition cheap. Close with confidence on the targets.")

# =============================================================================
# APPENDIX — METHODOLOGY & ASSUMPTIONS
# =============================================================================
s = slide(); bg(s, OFFWHITE)
header(s, "APPENDIX", "Methodology, Assumptions & Sources", pnum())
card(s, 0.7, 1.6, 5.85, 4.7, WHITE)
rect(s, 0.7, 1.6, 5.85, 0.1, GREEN)
txt(s, 0.95, 1.78, 5.4, 0.4, [[R("DATA & ASSUMPTIONS", 12.5, GREEN, True)]])
bullets(s, 0.95, 2.25, 5.4, 3.9, [
    "Baseline figures (2,350 users, 640 WAU, ₦4,200 CAC, 18% D30, ₦12m budget) are taken directly from the brief.",
    "Targets, reach estimates, conversion rates and market-context stats are illustrative planning assumptions, clearly labelled, to be validated with live data post-launch.",
    "Budget split is a starting allocation; ~20% is held flexible to shift weekly toward the lowest-CAC channels.",
    "Benchmarks (LTV:CAC ≥ 3:1, ~35% retention, K-factor) reflect typical fintech/consumer-app standards.",
], size=11, gap=8)
card(s, 6.75, 1.6, 5.9, 4.7, WHITE)
rect(s, 6.75, 1.6, 5.9, 0.1, NAVY)
txt(s, 7.0, 1.78, 5.5, 0.4, [[R("RESEARCH SOURCES (SECONDARY)", 12.5, NAVY, True)]])
bullets(s, 7.0, 2.25, 5.45, 3.9, [
    "EFInA Access to Financial Services in Nigeria surveys",
    "Central Bank of Nigeria (CBN) financial-inclusion data",
    "National Bureau of Statistics (NBS) — youth & income data",
    "GSMA State of Mobile Money in Sub-Saharan Africa",
    "Disrupt Africa & TechCabal Nigerian fintech reporting",
    "Public competitor app-store reviews & social listening",
    "Google Trends, TikTok & X trend data",
], size=11, gap=7, bullet_color=NAVY)
txt(s, 0.7, 6.5, 12, 0.5, [
    [R("Note:  ", 12, GREEN, True),
     R("AI tools assisted research and ideation; the strategic framework, prioritisation and creative "
       "direction are original to this submission.", 11.5, GREY, False, True)],
])
footer(s)

# =============================================================================
# THANK YOU
# =============================================================================
s = slide(); bg(s, NAVY)
rect(s, 0, 0, 13.333, 7.5, NAVY)
rect(s, 9.5, -2.2, 6.5, 6.5, NAVY_2, shape=MSO_SHAPE.OVAL)
rect(s, 0.9, 2.5, 0.18, 2.3, GREEN)
chip(s, 1.3, 2.45, 1.5, 0.6, "moni", GREEN, WHITE, size=22)
txt(s, 1.3, 3.25, 10.5, 1.0, [[R("Thank You.", 46, WHITE, True)]])
txt(s, 1.33, 4.35, 10.5, 0.5, [[R("“Moni Don Set You.”  The everyday money companion for "
                                  "ambitious young Nigerians.", 16, GREEN_LT, False, True)]])
rect(s, 1.33, 5.15, 5.5, 0.02, GREEN)
txt(s, 1.33, 5.35, 11, 1.0, [
    [R("Samuel Oluwafemi Afariogun", 15, WHITE, True)],
    [R("Product Marketing Consultant  ·  AltSchool of Product Marketing, Karatu 2025", 12.5, GREY_LT)],
    [R("Capstone Final Assessment  ·  60 Marks", 11.5, GREEN_LT)],
], space_after=4)

# ----------------------------------------------------------------------------- save
out = "/home/user/SparqAI/Moni_GTM_Strategy_Samuel_Afariogun.pptx"
prs.save(out)
print("Saved:", out)
print("Total slides:", len(prs.slides._sldIdLst))
