import csv
import io
import math
import shutil
import tempfile
import urllib.request
import zipfile
from contextlib import contextmanager
from pathlib import Path
from typing import Callable, Iterator


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "public" / "real-data"
ROW_LIMIT = 1500
OUTPUT_FIELDS = [
    "facility",
    "reporting_period",
    "activity_name",
    "quantity",
    "unit",
    "source_dataset",
    "source_timestamp",
]


@contextmanager
def archive_text(url: str, member_suffix: str, delimiter: str) -> Iterator[csv.DictReader]:
    with tempfile.TemporaryDirectory(prefix="carbon-compass-data-") as temp_dir:
        archive_path = Path(temp_dir) / "source.zip"
        request = urllib.request.Request(url, headers={"User-Agent": "CarbonCompassDemoData/1.0"})
        with urllib.request.urlopen(request, timeout=180) as response, archive_path.open("wb") as destination:
            shutil.copyfileobj(response, destination)

        with zipfile.ZipFile(archive_path) as archive:
            member = next((name for name in archive.namelist() if name.endswith(member_suffix)), None)
            if member is None:
                raise RuntimeError(f"Could not find {member_suffix} in {url}")
            with archive.open(member) as source:
                with io.TextIOWrapper(source, encoding="utf-8-sig", newline="") as text:
                    yield csv.DictReader(text, delimiter=delimiter)


def parse_number(value: str | None) -> float | None:
    if value is None or not value.strip() or value.strip() == "?":
        return None
    try:
        number = float(value.strip().replace(",", "."))
    except ValueError:
        return None
    return number if math.isfinite(number) and number > 0 else None


def make_record(facility: str, timestamp: str, quantity_kwh: float, source_dataset: str) -> dict[str, str]:
    return {
        "facility": facility,
        "reporting_period": timestamp[:7],
        "activity_name": "electricity consumption",
        "quantity": f"{quantity_kwh:.8f}".rstrip("0").rstrip("."),
        "unit": "kWh",
        "source_dataset": source_dataset,
        "source_timestamp": timestamp,
    }


def collect_rows(
    reader: csv.DictReader,
    transform: Callable[[dict[str, str | None], list[str]], dict[str, str] | None],
) -> list[dict[str, str]]:
    columns = reader.fieldnames or []
    records = []
    for row in reader:
        record = transform(row, columns)
        if record is not None:
            records.append(record)
        if len(records) == ROW_LIMIT:
            break
    if len(records) < ROW_LIMIT:
        raise RuntimeError(f"Expected {ROW_LIMIT} valid source records, found {len(records)}")
    return records


def write_dataset(filename: str, records: list[dict[str, str]]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / filename
    with output_path.open("w", encoding="utf-8", newline="") as destination:
        writer = csv.DictWriter(destination, fieldnames=OUTPUT_FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(records)
    print(f"Wrote {len(records)} measured records to {output_path.relative_to(ROOT)}")


def prepare_household_power() -> None:
    source_name = "UCI 235 - Individual Household Electric Power Consumption"

    def transform(row: dict[str, str | None], _columns: list[str]) -> dict[str, str] | None:
        power_kw = parse_number(row.get("Global_active_power"))
        date = row.get("Date", "")
        time = row.get("Time", "")
        if power_kw is None or not date or not time:
            return None
        day, month, year = date.split("/")
        timestamp = f"{year}-{month}-{day}T{time}"
        return make_record("Sceaux household, France", timestamp, power_kw / 60, source_name)

    url = "https://archive.ics.uci.edu/static/public/235/individual+household+electric+power+consumption.zip"
    with archive_text(url, "household_power_consumption.txt", ";") as reader:
        write_dataset("real-household-electricity-1500.csv", collect_rows(reader, transform))


def prepare_appliance_power() -> None:
    source_name = "UCI 374 - Appliances Energy Prediction"

    def transform(row: dict[str, str | None], _columns: list[str]) -> dict[str, str] | None:
        energy_wh = parse_number(row.get("Appliances"))
        timestamp = row.get("date", "")
        if energy_wh is None or len(timestamp) < 16:
            return None
        timestamp = timestamp.replace(" ", "T", 1)
        return make_record("Low-energy house, Belgium", timestamp, energy_wh / 1000, source_name)

    url = "https://archive.ics.uci.edu/static/public/374/appliances+energy+prediction.zip"
    with archive_text(url, "energydata_complete.csv", ",") as reader:
        write_dataset("real-appliance-electricity-1500.csv", collect_rows(reader, transform))


def prepare_client_load() -> None:
    source_name = "UCI 321 - ElectricityLoadDiagrams20112014"

    def transform(row: dict[str, str | None], columns: list[str]) -> dict[str, str] | None:
        if len(columns) < 2:
            return None
        customer = columns[1]
        power_kw = parse_number(row.get(customer))
        timestamp = row.get(columns[0], "")
        if power_kw is None or len(timestamp) < 16:
            return None
        return make_record(f"Portuguese utility client {customer}", timestamp.replace(" ", "T", 1), power_kw / 4, source_name)

    url = "https://archive.ics.uci.edu/static/public/321/electricityloaddiagrams20112014.zip"
    with archive_text(url, "LD2011_2014.txt", ";") as reader:
        write_dataset("real-client-load-1500.csv", collect_rows(reader, transform))


if __name__ == "__main__":
    prepare_household_power()
    prepare_appliance_power()
    prepare_client_load()