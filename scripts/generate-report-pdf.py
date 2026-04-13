#!/usr/bin/env python3
"""
DHLM Studio — Dynamic Report PDF Generator
Uses reportlab Platypus to produce print-quality PDFs.

Usage:
    python scripts/generate-report-pdf.py [slug]

Input:  src/content/reports/[slug].md
Output: public/pdf/[slug].pdf
"""

import sys
import os
import re
from datetime import datetime

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.colors import HexColor, white
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        KeepTogether, HRFlowable
    )
except ImportError:
    print("Error: reportlab not installed. Run: pip install reportlab")
    sys.exit(1)

# ── Colors ────────────────────────────────────────────────────────────────────
NAVY        = HexColor("#1B2A4A")
DARK_TEXT   = HexColor("#1a1a1a")
GRAY_TEXT   = HexColor("#666666")
LIGHT_GRAY  = HexColor("#F5F7FA")
MID_GRAY    = HexColor("#CCCCCC")
BORDER_GRAY = HexColor("#DDDDDD")
WHITE       = white

# ── Page geometry ─────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
CW = PAGE_W - 2 * MARGIN  # content width

# ── Paragraph styles ──────────────────────────────────────────────────────────
_base = getSampleStyleSheet()

style_h1 = ParagraphStyle(
    'H1', parent=_base['Heading1'],
    fontName='Helvetica-Bold', fontSize=16, leading=20,
    textColor=NAVY, spaceBefore=10 * mm, spaceAfter=4 * mm,
)
style_h2 = ParagraphStyle(
    'H2', parent=_base['Heading2'],
    fontName='Helvetica-Bold', fontSize=13, leading=17,
    textColor=NAVY, spaceBefore=6 * mm, spaceAfter=3 * mm,
)
style_body = ParagraphStyle(
    'Body', parent=_base['Normal'],
    fontName='Times-Roman', fontSize=10.5, leading=16,
    textColor=DARK_TEXT, alignment=TA_JUSTIFY,
    spaceBefore=1 * mm, spaceAfter=3 * mm,
)
style_verdict = ParagraphStyle(
    'Verdict', parent=style_body,
    fontName='Times-Bold', fontSize=11.5, leading=17,
    textColor=NAVY, alignment=TA_LEFT,
    spaceBefore=3 * mm, spaceAfter=3 * mm,
    leftIndent=5 * mm, rightIndent=5 * mm,
)
style_source = ParagraphStyle(
    'Source', parent=_base['Normal'],
    fontName='Helvetica', fontSize=8, leading=11,
    textColor=GRAY_TEXT, alignment=TA_LEFT,
    spaceBefore=1 * mm, spaceAfter=1 * mm,
)
style_disclaimer = ParagraphStyle(
    'Disclaimer', parent=_base['Normal'],
    fontName='Helvetica-Oblique', fontSize=8.5, leading=12,
    textColor=GRAY_TEXT, alignment=TA_CENTER,
    spaceBefore=5 * mm,
)
style_table_note = ParagraphStyle(
    'TableNote', parent=_base['Normal'],
    fontName='Helvetica-Oblique', fontSize=8, leading=11,
    textColor=GRAY_TEXT, spaceAfter=4 * mm,
)


# ── Inline markdown → reportlab XML ──────────────────────────────────────────
def md_to_rl(text):
    """Convert **bold**, *italic*, `code` to reportlab Paragraph XML tags."""
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    # Bold+italic
    text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    # Code
    text = re.sub(r'`(.+?)`', r'<font name="Courier">\1</font>', text)
    return text


# ── Page callbacks ────────────────────────────────────────────────────────────
def no_header(canvas, doc):
    """First page: no running header."""
    pass


def running_hf(canvas, doc):
    """Pages 2+: DHLM STUDIO header + dhlm-studio.com footer."""
    canvas.saveState()
    # Header
    canvas.setFont('Helvetica-Bold', 9)
    canvas.setFillColor(NAVY)
    canvas.drawString(MARGIN, PAGE_H - 12 * mm, "DHLM STUDIO")
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GRAY_TEXT)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12 * mm, "dhlm-studio.com")
    canvas.setStrokeColor(NAVY)
    canvas.setLineWidth(0.8)
    canvas.line(MARGIN, PAGE_H - 14 * mm, PAGE_W - MARGIN, PAGE_H - 14 * mm)
    # Footer
    canvas.setStrokeColor(MID_GRAY)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(GRAY_TEXT)
    canvas.drawString(
        MARGIN, 10 * mm,
        "dhlm-studio.com  \u00b7  For informational and educational purposes only"
        "  \u00b7  NOT investment advice"
    )
    canvas.drawRightString(PAGE_W - MARGIN, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


# ── Table builder ─────────────────────────────────────────────────────────────
def make_table(headers, rows, col_widths=None):
    if col_widths is None:
        col_widths = [CW / len(headers)] * len(headers)

    th_style = ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9,
                              leading=12, textColor=WHITE)
    td_style = ParagraphStyle('TD', fontName='Helvetica', fontSize=9,
                              leading=12, textColor=DARK_TEXT)
    td_bold  = ParagraphStyle('TDB', fontName='Helvetica-Bold', fontSize=9,
                              leading=12, textColor=DARK_TEXT)

    data = [[Paragraph(md_to_rl(h.strip()), th_style) for h in headers]]
    for row in rows:
        cells = []
        for idx, cell in enumerate(row):
            st = td_bold if idx == 0 else td_style
            cells.append(Paragraph(md_to_rl(cell.strip()), st))
        data.append(cells)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    cmds = [
        ('BACKGROUND',    (0, 0), (-1,  0), NAVY),
        ('TEXTCOLOR',     (0, 0), (-1,  0), WHITE),
        ('FONTNAME',      (0, 0), (-1,  0), 'Helvetica-Bold'),
        ('FONTSIZE',      (0, 0), (-1,  0), 9),
        ('TOPPADDING',    (0, 0), (-1,  0), 8),
        ('BOTTOMPADDING', (0, 0), (-1,  0), 8),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 8),
        ('GRID',          (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
    ]
    for i in range(1, len(data)):
        bg = LIGHT_GRAY if i % 2 == 0 else WHITE
        cmds += [
            ('BACKGROUND',    (0, i), (-1, i), bg),
            ('TOPPADDING',    (0, i), (-1, i), 6),
            ('BOTTOMPADDING', (0, i), (-1, i), 6),
        ]
    t.setStyle(TableStyle(cmds))
    return t


def auto_col_widths(ncols):
    if ncols == 2:
        return [CW * 0.35, CW * 0.65]
    if ncols == 3:
        return [CW * 0.28, CW * 0.22, CW * 0.50]
    if ncols == 4:
        return [CW * 0.13, CW * 0.10, CW * 0.18, CW * 0.59]
    return [CW / ncols] * ncols


# ── Helpers ───────────────────────────────────────────────────────────────────
def hr():
    return HRFlowable(width="100%", thickness=0.5, color=MID_GRAY,
                      spaceAfter=3 * mm, spaceBefore=3 * mm)


def desc_box(text):
    """Gray left-bar callout box for the report description."""
    desc_data = [[
        Paragraph("", ParagraphStyle('Bar', fontSize=1)),
        Paragraph(
            md_to_rl(text),
            ParagraphStyle('DescText', fontName='Helvetica', fontSize=10,
                           leading=15, textColor=DARK_TEXT)
        )
    ]]
    t = Table(desc_data, colWidths=[3 * mm, CW - 3 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (0, 0), MID_GRAY),
        ('LEFTPADDING',   (0, 0), (0, 0), 0),
        ('RIGHTPADDING',  (0, 0), (0, 0), 0),
        ('LEFTPADDING',   (1, 0), (1, 0), 10),
        ('RIGHTPADDING',  (1, 0), (1, 0), 5),
        ('TOPPADDING',    (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


def is_verdict_section(text):
    low = text.lower()
    return 'verdict' in low or 'brutal edge' in low


def is_entirely_bold(text):
    """Paragraph is entirely wrapped in **...**  (verdict-style statement)."""
    s = text.strip()
    return (
        s.startswith('**') and s.endswith('**')
        and s.count('**') == 2
        and len(s) > 4
    )


def is_sources_section(text):
    low = text.lower()
    return 'source' in low or 'methodology' in low


# ── Markdown frontmatter parser ───────────────────────────────────────────────
def parse_frontmatter(content):
    m = re.match(r'^---\n([\s\S]*?)\n---\n([\s\S]*)$', content, re.MULTILINE)
    if not m:
        return {}, content
    fm_raw, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_raw.split('\n'):
        kv = re.match(r'^(\w+):\s*(.+)$', line)
        if not kv:
            continue
        key, val = kv.group(1), kv.group(2).strip()
        if (val.startswith('"') and val.endswith('"')) or \
           (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]
        fm[key] = val
    return fm, body


# ── Markdown body parser ──────────────────────────────────────────────────────
def parse_blocks(body):
    """
    Returns list of block dicts:
      {type: 'h1'|'h2'|'para'|'bullet'|'table'|'hr'|'italic_para', ...}
    """
    lines = body.split('\n')
    blocks = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Blank line
        if not line.strip():
            i += 1
            continue

        # Horizontal rule (must not be a table separator)
        if re.match(r'^-{3,}\s*$', line):
            blocks.append({'type': 'hr'})
            i += 1
            continue

        # H1: exactly ##
        if re.match(r'^##\s+(?!#)', line):
            blocks.append({'type': 'h1', 'text': line.lstrip('#').strip()})
            i += 1
            continue

        # H2: exactly ###
        if re.match(r'^###\s+(?!#)', line):
            blocks.append({'type': 'h2', 'text': line.lstrip('#').strip()})
            i += 1
            continue

        # H3: #### or deeper
        if re.match(r'^#{4,}\s+', line):
            blocks.append({'type': 'h2', 'text': line.lstrip('#').strip()})
            i += 1
            continue

        # Table: line starts with |
        if line.strip().startswith('|'):
            tbl_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                tbl_lines.append(lines[i])
                i += 1
            # Skip blank lines and check for a note (*italic*)
            note = ''
            j = i
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines) and re.match(r'^\*[^*]', lines[j].strip()):
                note_raw = lines[j].strip()
                note = note_raw.strip('*').strip()
                i = j + 1
            headers, rows = _parse_md_table(tbl_lines)
            blocks.append({'type': 'table', 'headers': headers,
                           'rows': rows, 'note': note})
            continue

        # Bullet: starts with - or * followed by space
        if re.match(r'^[-*]\s+', line):
            text = re.sub(r'^[-*]\s+', '', line)
            blocks.append({'type': 'bullet', 'text': text})
            i += 1
            continue

        # Italic paragraph: whole line wrapped in *...*  (not **)
        stripped = line.strip()
        if (stripped.startswith('*') and not stripped.startswith('**')
                and stripped.endswith('*') and not stripped.endswith('**')
                and len(stripped) > 2):
            blocks.append({'type': 'italic_para', 'text': stripped[1:-1]})
            i += 1
            continue

        # Regular paragraph: collect until blank line or block-level element
        para_lines = []
        while i < len(lines):
            l = lines[i]
            if not l.strip():
                break
            if (re.match(r'^#{1,}\s+', l)
                    or l.strip().startswith('|')
                    or re.match(r'^[-*]\s+', l)
                    or re.match(r'^-{3,}\s*$', l)):
                break
            para_lines.append(l)
            i += 1
        if para_lines:
            text = ' '.join(para_lines)
            blocks.append({'type': 'para', 'text': text})
        continue

    return blocks


def _parse_md_table(lines):
    headers = []
    rows = []
    for line in lines:
        # Skip separator rows like |---|---|
        if re.match(r'^\s*\|[-:\s|]+\|\s*$', line):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if not headers:
            headers = cells
        else:
            rows.append(cells)
    return headers, rows


# ── Build PDF story ────────────────────────────────────────────────────────────
def build_story(fm, blocks):
    story = []

    # ── Format category + date ───────────────────────────────────────────────
    cat      = fm.get('category', '').upper()
    date_raw = fm.get('date', '')
    try:
        dt       = datetime.strptime(date_raw, '%Y-%m-%d')
        date_str = dt.strftime('%B %d, %Y').upper()
    except Exception:
        date_str = date_raw.upper()
    cat_date = f"{cat}  \u00b7  {date_str}" if cat else date_str

    title       = fm.get('title', '')
    description = fm.get('description', '')

    # ── Cover block ──────────────────────────────────────────────────────────
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<b>DHLM STUDIO</b>",
        ParagraphStyle('Logo', fontName='Helvetica-Bold', fontSize=22,
                       textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=2 * mm)
    ))
    story.append(Paragraph(
        "Brutal Edge\u2122 Analysis",
        ParagraphStyle('Brand', fontName='Helvetica', fontSize=9,
                       textColor=GRAY_TEXT, alignment=TA_LEFT, spaceAfter=0)
    ))
    story.append(HRFlowable(width="100%", thickness=2.5, color=NAVY,
                            spaceAfter=6 * mm, spaceBefore=4 * mm))
    story.append(Paragraph(
        cat_date,
        ParagraphStyle('CoverCat', fontName='Helvetica', fontSize=9,
                       textColor=GRAY_TEXT, alignment=TA_LEFT, spaceAfter=5 * mm)
    ))
    story.append(Paragraph(
        md_to_rl(title),
        ParagraphStyle('CoverTitle', fontName='Helvetica-Bold', fontSize=26,
                       leading=32, textColor=DARK_TEXT, alignment=TA_LEFT,
                       spaceAfter=6 * mm)
    ))
    if description:
        story.append(desc_box(description))

    story.append(hr())

    # ── Body blocks ──────────────────────────────────────────────────────────
    in_verdict  = False
    in_sources  = False
    first_h1    = True    # suppress hr before very first section

    for block in blocks:
        btype = block['type']

        if btype == 'hr':
            story.append(hr())

        elif btype == 'h1':
            # Add separator before every section except the first
            if not first_h1:
                story.append(hr())
            first_h1   = False
            in_verdict = is_verdict_section(block['text'])
            in_sources = is_sources_section(block['text'])
            story.append(Paragraph(md_to_rl(block['text']), style_h1))

        elif btype == 'h2':
            story.append(Paragraph(md_to_rl(block['text']), style_h2))

        elif btype == 'table':
            headers = block['headers']
            rows    = block['rows']
            widths  = auto_col_widths(len(headers))
            items   = [make_table(headers, rows, widths), Spacer(1, 2 * mm)]
            if block.get('note'):
                items.append(Paragraph(md_to_rl(block['note']), style_table_note))
            story.append(KeepTogether(items))

        elif btype == 'bullet':
            text = '\u2022 ' + md_to_rl(block['text'])
            story.append(Paragraph(text, style_body))

        elif btype == 'italic_para':
            story.append(Paragraph(md_to_rl(block['text']), style_disclaimer))

        elif btype == 'para':
            text = block['text']
            if in_verdict and is_entirely_bold(text):
                story.append(Spacer(1, 2 * mm))
                story.append(Paragraph(md_to_rl(text), style_verdict))
                story.append(Spacer(1, 2 * mm))
            elif in_sources:
                story.append(Paragraph(md_to_rl(text), style_source))
            else:
                story.append(Paragraph(md_to_rl(text), style_body))

    # ── Closing footer ────────────────────────────────────────────────────────
    story.append(Spacer(1, 5 * mm))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=3 * mm))
    story.append(Paragraph(
        "\u00a9 DHLM Studio 2026  \u00b7  Brutal Edge\u2122 Analysis  \u00b7  All rights reserved",
        ParagraphStyle('EndFooter', fontName='Helvetica', fontSize=8,
                       textColor=GRAY_TEXT, alignment=TA_CENTER)
    ))

    return story


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/generate-report-pdf.py [slug]")
        sys.exit(1)

    slug         = sys.argv[1]
    script_dir   = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    md_path  = os.path.join(project_root, 'src', 'content', 'reports', f'{slug}.md')
    out_dir  = os.path.join(project_root, 'public', 'pdf')
    out_path = os.path.join(out_dir, f'{slug}.pdf')

    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found")
        sys.exit(1)

    os.makedirs(out_dir, exist_ok=True)

    with open(md_path, encoding='utf-8') as f:
        content = f.read()

    fm, body_text = parse_frontmatter(content)
    blocks        = parse_blocks(body_text)
    story         = build_story(fm, blocks)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=A4,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        title=fm.get('title', slug),
        author="DHLM Studio",
    )
    doc.build(story, onFirstPage=no_header, onLaterPages=running_hf)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"OK  PDF saved -> {out_path}")
    print(f"   Size: {size_kb:.1f} KB")


if __name__ == '__main__':
    main()
