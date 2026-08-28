from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"

NAVY = colors.HexColor("#0A2342")
BLUE = colors.HexColor("#0B5CAD")
TEAL = colors.HexColor("#2B8797")
INK = colors.HexColor("#1E2936")
MUTED = colors.HexColor("#5D6B7A")
LINE = colors.HexColor("#D8E1E8")
PALE = colors.HexColor("#F1F6FA")
PALE_BLUE = colors.HexColor("#E8F2FB")
WHITE = colors.white


def register_fonts() -> None:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ReportSans", str(regular)))
        pdfmetrics.registerFont(TTFont("ReportSans-Bold", str(bold)))
    else:
        pdfmetrics.registerFont(TTFont("ReportSans", "Helvetica"))
        pdfmetrics.registerFont(TTFont("ReportSans-Bold", "Helvetica-Bold"))


FONT = "ReportSans"
FONT_BOLD = "ReportSans-Bold"


def plain_text(value: str) -> str:
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2011": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def inline_markup(value: str) -> str:
    value = plain_text(value)
    value = html.escape(value, quote=False)
    value = re.sub(r"`([^`]+)`", rf'<font name="Courier">\1</font>', value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", value)
    return value


def parse_markdown(path: Path) -> list[dict]:
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks: list[dict] = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        heading = re.match(r"^(#{1,3})\s+(.+?)\s*$", line)
        if heading:
            blocks.append({"kind": "heading", "level": len(heading.group(1)), "text": heading.group(2)})
            i += 1
            continue

        if line.startswith("```"):
            code: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            if i < len(lines):
                i += 1
            blocks.append({"kind": "code", "text": "\n".join(code)})
            continue

        if line.startswith("|"):
            rows: list[list[str]] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                raw = lines[i].strip().strip("|")
                cells = [cell.strip() for cell in raw.split("|")]
                if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
                    rows.append(cells)
                i += 1
            if rows:
                blocks.append({"kind": "table", "rows": rows})
            continue

        if re.match(r"^[-*]\s+", line):
            items: list[str] = []
            while i < len(lines):
                match = re.match(r"^[-*]\s+(.+)$", lines[i].strip())
                if not match:
                    break
                items.append(match.group(1))
                i += 1
            blocks.append({"kind": "bullets", "items": items})
            continue

        if re.match(r"^\d+\.\s+", line):
            items = []
            while i < len(lines):
                match = re.match(r"^\d+\.\s+(.+)$", lines[i].strip())
                if not match:
                    break
                items.append(match.group(1))
                i += 1
            blocks.append({"kind": "numbers", "items": items})
            continue

        if line.startswith(">"):
            quote: list[str] = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote.append(re.sub(r"^>\s?", "", lines[i].strip()))
                i += 1
            blocks.append({"kind": "quote", "text": " ".join(quote)})
            continue

        paragraph = [line]
        i += 1
        while i < len(lines):
            candidate = lines[i].strip()
            if not candidate or re.match(r"^(#{1,3})\s+", candidate) or candidate.startswith("```"):
                break
            if candidate.startswith("|") or re.match(r"^[-*]\s+", candidate) or re.match(r"^\d+\.\s+", candidate):
                break
            paragraph.append(candidate)
            i += 1
        blocks.append({"kind": "paragraph", "text": " ".join(paragraph)})

    return blocks


def after_first_section(blocks: list[dict]) -> list[dict]:
    first_h2 = next((i for i, block in enumerate(blocks) if block.get("kind") == "heading" and block.get("level") == 2), None)
    if first_h2 is None:
        return blocks
    next_h2 = next(
        (i for i in range(first_h2 + 1, len(blocks)) if blocks[i].get("kind") == "heading" and blocks[i].get("level") == 2),
        len(blocks),
    )
    return blocks[next_h2:]


def first_section_content(blocks: list[dict], max_paragraphs: int) -> list[str]:
    first_h2 = next((i for i, block in enumerate(blocks) if block.get("kind") == "heading" and block.get("level") == 2), None)
    if first_h2 is None:
        return []
    next_h2 = next(
        (i for i in range(first_h2 + 1, len(blocks)) if blocks[i].get("kind") == "heading" and blocks[i].get("level") == 2),
        len(blocks),
    )
    return [block["text"] for block in blocks[first_h2 + 1 : next_h2] if block.get("kind") == "paragraph"][:max_paragraphs]


class AccentRule(Flowable):
    def __init__(self, width: float = 18 * mm, thickness: float = 2.4):
        super().__init__()
        self.width = width
        self.height = thickness + 2
        self.thickness = thickness
        self.keepWithNext = 1

    def draw(self) -> None:
        self.canv.setFillColor(TEAL)
        self.canv.roundRect(0, 0, self.width, self.thickness, self.thickness / 2, stroke=0, fill=1)


class CoverMark(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 27 * mm
        self.height = 11 * mm

    def draw(self) -> None:
        self.canv.setFillColor(BLUE)
        self.canv.roundRect(0, 0, self.width, self.height, 3 * mm, stroke=0, fill=1)
        self.canv.setFillColor(WHITE)
        self.canv.setFont(FONT_BOLD, 10)
        self.canv.drawCentredString(self.width / 2, 3.7 * mm, "CCZ")


class ReportDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, report_label: str, **kwargs):
        super().__init__(filename, **kwargs)
        self.report_label = report_label
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([
            PageTemplate(id="first", frames=frame, onPage=self.draw_first_page),
            PageTemplate(id="later", frames=frame, onPage=self.draw_later_page),
        ])

    def afterPage(self) -> None:
        if self.page == 1:
            self.handle_nextPageTemplate("later")

    def draw_first_page(self, canvas, doc) -> None:
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, A4[1] - 24 * mm, A4[0], 24 * mm, stroke=0, fill=1)
        canvas.setFillColor(TEAL)
        canvas.rect(0, A4[1] - 24 * mm, 52 * mm, 2.5 * mm, stroke=0, fill=1)
        canvas.setFillColor(WHITE)
        canvas.setFont(FONT_BOLD, 8.2)
        canvas.drawString(doc.leftMargin, A4[1] - 14 * mm, "CCZ MOSSORÓ  /  SITE INSTITUCIONAL")
        canvas.setFont(FONT, 7.5)
        canvas.setFillColor(colors.HexColor("#C8D8E8"))
        canvas.drawRightString(A4[0] - doc.rightMargin, A4[1] - 14 * mm, self.report_label.upper())
        canvas.restoreState()

    def draw_later_page(self, canvas, doc) -> None:
        canvas.saveState()
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.6)
        canvas.line(doc.leftMargin, A4[1] - 17 * mm, A4[0] - doc.rightMargin, A4[1] - 17 * mm)
        canvas.setFillColor(NAVY)
        canvas.setFont(FONT_BOLD, 7.5)
        canvas.drawString(doc.leftMargin, A4[1] - 12 * mm, "CCZ MOSSORÓ")
        canvas.setFillColor(MUTED)
        canvas.setFont(FONT, 7.5)
        canvas.drawRightString(A4[0] - doc.rightMargin, A4[1] - 12 * mm, self.report_label.upper())
        canvas.setStrokeColor(LINE)
        canvas.line(doc.leftMargin, 15 * mm, A4[0] - doc.rightMargin, 15 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont(FONT, 7.4)
        canvas.drawString(doc.leftMargin, 9.5 * mm, "Projeto SigCCZ  |  Programa de Educação Tutorial")
        canvas.drawRightString(A4[0] - doc.rightMargin, 9.5 * mm, f"{doc.page:02d}")
        canvas.restoreState()


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle("cover_kicker", parent=base["Normal"], fontName=FONT_BOLD, fontSize=8.5, leading=11, textColor=TEAL, tracking=1.4, spaceAfter=4),
        "cover_title": ParagraphStyle("cover_title", parent=base["Title"], fontName=FONT_BOLD, fontSize=29, leading=31, textColor=NAVY, alignment=TA_LEFT, spaceAfter=6),
        "cover_subtitle": ParagraphStyle("cover_subtitle", parent=base["Normal"], fontName=FONT, fontSize=11.2, leading=16, textColor=MUTED, spaceAfter=13),
        "meta_label": ParagraphStyle("meta_label", parent=base["Normal"], fontName=FONT_BOLD, fontSize=7.2, leading=9, textColor=BLUE),
        "meta_value": ParagraphStyle("meta_value", parent=base["Normal"], fontName=FONT, fontSize=8.7, leading=11, textColor=INK),
        "cover_summary_label": ParagraphStyle("cover_summary_label", parent=base["Normal"], fontName=FONT_BOLD, fontSize=8, leading=10, textColor=BLUE, tracking=1.0),
        "cover_summary": ParagraphStyle("cover_summary", parent=base["BodyText"], fontName=FONT, fontSize=10.2, leading=15, textColor=INK, spaceAfter=0),
        "h2": ParagraphStyle("h2", parent=base["Heading2"], fontName=FONT_BOLD, fontSize=15.5, leading=18, textColor=NAVY, spaceBefore=13, spaceAfter=5, keepWithNext=True),
        "h3": ParagraphStyle("h3", parent=base["Heading3"], fontName=FONT_BOLD, fontSize=10.7, leading=13, textColor=BLUE, spaceBefore=8, spaceAfter=4, keepWithNext=True),
        "body": ParagraphStyle("body", parent=base["BodyText"], fontName=FONT, fontSize=9.35, leading=13.4, textColor=INK, spaceAfter=7),
        "bullet": ParagraphStyle("bullet", parent=base["BodyText"], fontName=FONT, fontSize=9.25, leading=13, textColor=INK, leftIndent=13, firstLineIndent=-9, spaceAfter=3),
        "number": ParagraphStyle("number", parent=base["BodyText"], fontName=FONT, fontSize=9.25, leading=13, textColor=INK, leftIndent=18, firstLineIndent=-14, spaceAfter=3),
        "quote": ParagraphStyle("quote", parent=base["BodyText"], fontName=FONT, fontSize=9.3, leading=13, textColor=NAVY, leftIndent=12, rightIndent=8, borderColor=TEAL, borderWidth=2, borderPadding=8, spaceBefore=3, spaceAfter=8, backColor=PALE),
        "code": ParagraphStyle("code", parent=base["Code"], fontName="Courier", fontSize=7.8, leading=10.2, textColor=NAVY, leftIndent=6, spaceAfter=0),
        "table_header": ParagraphStyle("table_header", parent=base["Normal"], fontName=FONT_BOLD, fontSize=7.8, leading=10, textColor=WHITE),
        "table_body": ParagraphStyle("table_body", parent=base["Normal"], fontName=FONT, fontSize=7.8, leading=10.5, textColor=INK),
        "small": ParagraphStyle("small", parent=base["Normal"], fontName=FONT, fontSize=7.7, leading=10, textColor=MUTED),
    }


def meta_card(label: str, value: str, st: dict[str, ParagraphStyle]) -> Table:
    data = [[Paragraph(label.upper(), st["meta_label"])], [Paragraph(inline_markup(value), st["meta_value"])]]
    table = Table(data, colWidths=[58 * mm], rowHeights=None)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, 0), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
    ]))
    return table


def render_table(rows: list[list[str]], st: dict[str, ParagraphStyle]) -> Table:
    count = max(len(row) for row in rows)
    normalized = [row + [""] * (count - len(row)) for row in rows]
    data = []
    for index, row in enumerate(normalized):
        style = st["table_header"] if index == 0 else st["table_body"]
        data.append([Paragraph(inline_markup(cell), style) for cell in row])
    total = 175 * mm
    widths = [total / count] * count
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("BACKGROUND", (0, 1), (-1, -1), WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, PALE]),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def render_blocks(blocks: list[dict], st: dict[str, ParagraphStyle]) -> list[Flowable]:
    story: list[Flowable] = []
    for block in blocks:
        kind = block["kind"]
        if kind == "heading":
            if block["level"] == 2:
                story.extend([Spacer(1, 5), AccentRule(), Paragraph(inline_markup(block["text"]), st["h2"])])
            elif block["level"] == 3:
                story.append(Paragraph(inline_markup(block["text"]), st["h3"]))
        elif kind == "paragraph":
            story.append(Paragraph(inline_markup(block["text"]), st["body"]))
        elif kind == "bullets":
            story.extend(Paragraph("• " + inline_markup(item), st["bullet"]) for item in block["items"])
            story.append(Spacer(1, 2))
        elif kind == "numbers":
            story.extend(Paragraph(f"{index}. {inline_markup(item)}", st["number"]) for index, item in enumerate(block["items"], 1))
            story.append(Spacer(1, 2))
        elif kind == "quote":
            story.append(Paragraph(inline_markup(block["text"]), st["quote"]))
        elif kind == "code":
            code_rows = [[Paragraph(inline_markup(line) or " ", st["code"])] for line in block["text"].splitlines() or [""]]
            table = Table(code_rows, colWidths=[175 * mm])
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), PALE_BLUE),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C7DDED")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.extend([table, Spacer(1, 7)])
        elif kind == "table":
            story.extend([Spacer(1, 3), render_table(block["rows"], st), Spacer(1, 8)])
    return story


def build_pdf(md_path: Path, filename: str, label: str, title: str, subtitle: str, meta: list[tuple[str, str]], key_line: str) -> None:
    blocks = parse_markdown(md_path)
    st = styles()
    pdf_paths = [ROOT / filename, OUTPUT / filename]
    for pdf_path in pdf_paths:
        pdf_path.parent.mkdir(parents=True, exist_ok=True)
        doc = ReportDocTemplate(
            str(pdf_path),
            report_label=label,
            pagesize=A4,
            leftMargin=17.5 * mm,
            rightMargin=17.5 * mm,
            topMargin=23 * mm,
            bottomMargin=21 * mm,
            title=title,
            author="Fábio Roberto Dantas Gurgel Filho",
            subject="Site institucional do CCZ Mossoró",
        )

        cover: list[Flowable] = [
            Spacer(1, 18 * mm),
            CoverMark(),
            Spacer(1, 15 * mm),
            Paragraph(label.upper(), st["cover_kicker"]),
            Paragraph(title, st["cover_title"]),
            Paragraph(subtitle, st["cover_subtitle"]),
            AccentRule(21 * mm, 2.7),
            Spacer(1, 9 * mm),
        ]
        meta_tables = [meta_card(label, value, st) for label, value in meta]
        cover.append(Table([meta_tables[:2], meta_tables[2:]], colWidths=[84 * mm, 84 * mm], style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])))
        cover.extend([
            Spacer(1, 9 * mm),
            Paragraph("LEITURA RÁPIDA", st["cover_summary_label"]),
            Spacer(1, 2 * mm),
            Paragraph(inline_markup(key_line), st["cover_summary"]),
            Spacer(1, 9 * mm),
        ])
        summary = first_section_content(blocks, 2)
        if summary:
            cover.append(Paragraph(inline_markup(summary[0]), st["cover_summary"]))
            if len(summary) > 1:
                cover.extend([Spacer(1, 4 * mm), Paragraph(inline_markup(summary[1]), st["small"])])
        cover.extend([
            Spacer(1, 13 * mm),
            Paragraph("DOCUMENTO DE TRABALHO", st["meta_label"]),
            Paragraph("Projeto SigCCZ / Site Institucional do CCZ Mossoró", st["small"]),
            PageBreak(),
        ])

        story = cover + render_blocks(after_first_section(blocks), st)
        doc.build(story)


def main() -> None:
    register_fonts()
    build_pdf(
        ROOT / "Relatorio-Semanal-CMS-Conteudo.md",
        "Relatorio-Semanal-CMS-Conteudo.pdf",
        "Relatório semanal",
        "CMS, artigos e notícias",
        "Evolução do frontend e do fluxo editorial do Site Institucional do CCZ Mossoró",
        [
            ("Monitor", "Fábio Roberto Dantas Gurgel Filho"),
            ("Atuação", "Frontend, integração e conteúdo"),
            ("Projeto", "Site institucional do CCZ Mossoró"),
            ("Programa", "PET / Projeto SigCCZ"),
        ],
        "Integração do Tina CMS ao frontend, com conteúdo versionado em Markdown e publicação compatível com a estratégia de site estático.",
    )
    build_pdf(
        ROOT / "Relato-Experiencia-PET-SiteInstitucional.md",
        "Relato-Experiencia-PET-SiteInstitucional.pdf",
        "Relato de experiência",
        "Desenvolvimento do frontend",
        "Autoria da interface, experiência do usuário e integração do Site Institucional do CCZ Mossoró",
        [
            ("Autor", "Fábio Roberto Dantas Gurgel Filho"),
            ("Área", "Frontend e integração ponta a ponta"),
            ("Projeto", "SigCCZ / Site institucional"),
            ("Vínculo", "Programa de Educação Tutorial"),
        ],
        "O frontend foi desenvolvido integralmente por mim: da identidade visual e das páginas à integração com o backend, ao conteúdo, à acessibilidade e à entrega estática.",
    )
    build_pdf(
        ROOT / "Relato-Experiencia-GAT4-Frontend.md",
        "Relato-Experiencia-GAT4-Frontend.pdf",
        "Relato de experiência GAT 4",
        "Interface, acessibilidade e autonomia editorial",
        "Desenvolvimento do front-end do portal institucional do CCZ de Mossoró-RN no âmbito do PET-Saúde Digital",
        [
            ("Autores", "Fábio Gurgel Filho e Vinícius Gabriel L. de Oliveira"),
            ("Tutoria", "Louise H. de F. Ribeiro e Fábio F. da C. Fontes"),
            ("Programa", "PET-Saúde/I&SD. Conecta Mossoró"),
            ("Grupo", "Grupo de Aprendizagem Tutorial 4"),
        ],
        "Relato da construção da camada de apresentação do portal: exportação estática, integração com a API de denúncias, acessibilidade digital e um editor próprio que devolve a autonomia editorial ao órgão.",
    )
    print("Relatórios gerados em:")
    print(ROOT / "Relatorio-Semanal-CMS-Conteudo.pdf")
    print(ROOT / "Relato-Experiencia-PET-SiteInstitucional.pdf")
    print(ROOT / "Relato-Experiencia-GAT4-Frontend.pdf")
    print(OUTPUT)


if __name__ == "__main__":
    main()
