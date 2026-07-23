from io import BytesIO

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph


def generate_evaluation_pdf(report):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>Evaluation Report</b>", styles["Title"]))

    story.append(
        Paragraph(
            f"<b>Evaluation:</b> {report.evaluation_name}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Project:</b> {report.project_name}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Dataset:</b> {report.dataset_name}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Model:</b> {report.model_name}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Status:</b> {report.status}",
            styles["Normal"],
        )
    )

    story.append(Paragraph("<br/><b>Summary</b>", styles["Heading2"]))

    summary = report.summary

    story.append(
        Paragraph(
            f"Total Prompts: {summary.total_prompts}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Passed: {summary.passed_prompts}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Failed: {summary.failed_prompts}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Success Rate: {summary.success_rate}%",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Average Latency: {summary.average_latency}s",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Total Tokens: {summary.total_tokens}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"Total Cost: ${summary.total_cost}",
            styles["Normal"],
        )
    )

    doc.build(story)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf