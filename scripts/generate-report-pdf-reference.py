#!/usr/bin/env python3
"""
DHLM Studio — ETH Special Report PDF Generator
Reference implementation (static, hardcoded content).
Dynamic version: generate-report-pdf.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib import colors
import os

NAVY = HexColor("#1B2A4A")
DARK_TEXT = HexColor("#1a1a1a")
GRAY_TEXT = HexColor("#666666")
LIGHT_GRAY = HexColor("#F5F7FA")
MID_GRAY = HexColor("#CCCCCC")
BORDER_GRAY = HexColor("#DDDDDD")
WHITE = white

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
OUTPUT_PATH = "public/pdf/ethereum-special-report-april-2026-reference.pdf"

styles = getSampleStyleSheet()

style_h1 = ParagraphStyle('H1', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=16, leading=20, textColor=NAVY, spaceBefore=10*mm, spaceAfter=4*mm)
style_h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=NAVY, spaceBefore=6*mm, spaceAfter=3*mm)
style_body = ParagraphStyle('Body', parent=styles['Normal'], fontName='Times-Roman', fontSize=10.5, leading=16, textColor=DARK_TEXT, alignment=TA_JUSTIFY, spaceBefore=1*mm, spaceAfter=3*mm)
style_verdict = ParagraphStyle('Verdict', parent=style_body, fontName='Times-Bold', fontSize=11.5, leading=17, textColor=NAVY, alignment=TA_LEFT, spaceBefore=3*mm, spaceAfter=3*mm, leftIndent=5*mm, rightIndent=5*mm)
style_source = ParagraphStyle('Source', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=GRAY_TEXT, alignment=TA_LEFT, spaceBefore=1*mm, spaceAfter=1*mm)
style_disclaimer = ParagraphStyle('Disclaimer', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8.5, leading=12, textColor=GRAY_TEXT, alignment=TA_CENTER, spaceBefore=5*mm)
style_table_note = ParagraphStyle('TableNote', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=GRAY_TEXT, spaceAfter=4*mm)

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica-Bold', 9); canvas.setFillColor(NAVY)
    canvas.drawString(MARGIN, PAGE_H - 12*mm, "DHLM STUDIO")
    canvas.setFont('Helvetica', 8); canvas.setFillColor(GRAY_TEXT)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12*mm, "dhlm-studio.com")
    canvas.setStrokeColor(NAVY); canvas.setLineWidth(0.8)
    canvas.line(MARGIN, PAGE_H - 14*mm, PAGE_W - MARGIN, PAGE_H - 14*mm)
    canvas.setStrokeColor(MID_GRAY); canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 14*mm, PAGE_W - MARGIN, 14*mm)
    canvas.setFont('Helvetica', 7.5); canvas.setFillColor(GRAY_TEXT)
    canvas.drawString(MARGIN, 10*mm, "dhlm-studio.com  \u00b7  For informational and educational purposes only  \u00b7  NOT investment advice")
    canvas.drawRightString(PAGE_W - MARGIN, 10*mm, f"Page {doc.page}")
    canvas.restoreState()

def no_header(canvas, doc): pass

def make_table(headers, rows, col_widths=None):
    CW = PAGE_W - 2 * MARGIN
    if col_widths is None:
        col_widths = [CW / len(headers)] * len(headers)
    th_st = ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=WHITE)
    td_st = ParagraphStyle('TD', fontName='Helvetica', fontSize=9, leading=12, textColor=DARK_TEXT)
    td_b  = ParagraphStyle('TDB', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=DARK_TEXT)
    data = [[Paragraph(h, th_st) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), td_b if i==0 else td_st) for i,c in enumerate(row)])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    cmds = [('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),WHITE),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('FONTSIZE',(0,0),(-1,0),9),('BOTTOMPADDING',(0,0),(-1,0),8),('TOPPADDING',(0,0),(-1,0),8),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('GRID',(0,0),(-1,-1),0.5,BORDER_GRAY),('VALIGN',(0,0),(-1,-1),'TOP')]
    for i in range(1,len(data)):
        bg = LIGHT_GRAY if i%2==0 else WHITE
        cmds += [('BACKGROUND',(0,i),(-1,i),bg),('BOTTOMPADDING',(0,i),(-1,i),6),('TOPPADDING',(0,i),(-1,i),6)]
    t.setStyle(TableStyle(cmds))
    return t

def hr(): return HRFlowable(width="100%", thickness=0.5, color=MID_GRAY, spaceAfter=3*mm, spaceBefore=3*mm)
def body(t): return Paragraph(t, style_body)

CW = PAGE_W - 2 * MARGIN
story = []
story.append(Spacer(1, 2*mm))
story.append(Paragraph("<b>DHLM STUDIO</b>", ParagraphStyle('Logo', fontName='Helvetica-Bold', fontSize=22, textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=8*mm)))
story.append(Paragraph("Brutal Edge\u2122 Analysis", ParagraphStyle('Brand', fontName='Helvetica', fontSize=9, textColor=GRAY_TEXT, alignment=TA_LEFT, spaceAfter=0)))
story.append(HRFlowable(width="100%", thickness=2.5, color=NAVY, spaceAfter=6*mm, spaceBefore=4*mm))
story.append(Paragraph("CRYPTO  \u00b7  APRIL 14, 2026", ParagraphStyle('CoverCat', fontName='Helvetica', fontSize=9, textColor=GRAY_TEXT, alignment=TA_LEFT, spaceAfter=5*mm)))
story.append(Paragraph("Ethereum Special Report: Is ETH a Recovery Asset or a Re-Rating Asset in 2026?", ParagraphStyle('CoverTitle', fontName='Helvetica-Bold', fontSize=26, leading=32, textColor=DARK_TEXT, alignment=TA_LEFT, spaceAfter=6*mm)))
desc_data = [[Paragraph("",ParagraphStyle('Bar',fontSize=1)),Paragraph("ETH at $2,220 \u2014 55% below ATH. Special report covering ETF flows, staking wrappers, macro environment, Pectra protocol upgrades, L2 value capture problem, and year-end scenarios. Is ETH repricing or re-rating?",ParagraphStyle('DescText',fontName='Helvetica',fontSize=10,leading=15,textColor=DARK_TEXT))]]
dt = Table(desc_data, colWidths=[3*mm, CW-3*mm])
dt.setStyle(TableStyle([('BACKGROUND',(0,0),(0,0),MID_GRAY),('LEFTPADDING',(0,0),(0,0),0),('RIGHTPADDING',(0,0),(0,0),0),('LEFTPADDING',(1,0),(1,0),10),('RIGHTPADDING',(1,0),(1,0),5),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('VALIGN',(0,0),(-1,-1),'TOP')]))
story.append(dt)
story.append(hr())

# (Reference script continues with hardcoded sections — see generate-report-pdf.py for the dynamic version)
print("Reference script: use generate-report-pdf.py for dynamic generation.")
print("To generate ETH report: python scripts/generate-report-pdf.py ethereum-special-report-april-2026")
