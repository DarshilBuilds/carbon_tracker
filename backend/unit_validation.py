UNIT_ALIASES = {
    "cubicmeter": "m3",
    "cubicmeters": "m3",
    "cubicmetre": "m3",
    "cubicmetres": "m3",
    "liter": "l",
    "liters": "l",
    "litre": "l",
    "litres": "l",
    "kilogram": "kg",
    "kilograms": "kg",
    "kilowatthour": "kwh",
    "kilowatthours": "kwh",
    "passengerkilometer": "passenger-km",
    "passengerkilometers": "passenger-km",
    "passengerkilometre": "passenger-km",
    "passengerkilometres": "passenger-km",
    "tonnekilometer": "t-km",
    "tonnekilometre": "t-km",
}


def normalize_unit(unit: str) -> str:
    normalized = "".join(unit.lower().replace("³", "3").split())
    return UNIT_ALIASES.get(normalized, normalized)


def units_match(input_unit: str, factor_unit: str) -> bool:
    return normalize_unit(input_unit) == normalize_unit(factor_unit)