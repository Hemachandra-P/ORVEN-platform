from io import StringIO
import csv


def generate_evaluation_csv(report):

    output = StringIO()

    writer = csv.writer(output)

    writer.writerow(["Evaluation Report"])
    writer.writerow([])

    writer.writerow(["Evaluation", report.evaluation_name])
    writer.writerow(["Project", report.project_name])
    writer.writerow(["Dataset", report.dataset_name])
    writer.writerow(["Model", report.model_name])
    writer.writerow(["Status", report.status])

    writer.writerow([])

    writer.writerow(["Summary"])

    summary = report.summary

    writer.writerow(["Total Prompts", summary.total_prompts])
    writer.writerow(["Passed", summary.passed_prompts])
    writer.writerow(["Failed", summary.failed_prompts])
    writer.writerow(["Success Rate", summary.success_rate])
    writer.writerow(["Average Latency", summary.average_latency])
    writer.writerow(["Total Tokens", summary.total_tokens])
    writer.writerow(["Total Cost", summary.total_cost])

    writer.writerow([])
    writer.writerow(["Results"])
    writer.writerow(
        [
            "Prompt",
            "Expected Answer",
            "Model Response",
            "Score",
            "Passed",
            "Latency",
            "Total Tokens",
        ]
    )

    for result in report.results:
        writer.writerow(
            [
                result.prompt,
                result.expected_answer,
                result.model_response,
                result.score,
                result.passed,
                result.latency,
                result.total_tokens,
            ]
        )

    return output.getvalue()