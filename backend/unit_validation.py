import re

DIRECT_EMISSIONS_UNITS = {
    "metrictonsco2e": 1000.0,
    "metrictonco2e": 1000.0,
    "metrictons": 1000.0,
    "metricton": 1000.0,
    "mtco2e": 1000.0,
    "tco2e": 1000.0,
    "tonneco2e": 1000.0,
    "tonnesco2e": 1000.0,
    "mt": 1000.0,
    "tonne": 1000.0,
    "tonnes": 1000.0,
    "kgco2e": 1.0,
    "kgco2": 1.0,
}

DIMENSIONS = {
    # Mass (base: kg)
    "kg": ("mass", 1.0),
    "kilogram": ("mass", 1.0),
    "kilograms": ("mass", 1.0),
    "g": ("mass", 0.001),
    "gram": ("mass", 0.001),
    "grams": ("mass", 0.001),
    "mg": ("mass", 1e-6),
    "t": ("mass", 1000.0),
    "mt": ("mass", 1000.0),
    "tonne": ("mass", 1000.0),
    "tonnes": ("mass", 1000.0),
    "metricton": ("mass", 1000.0),
    "metrictons": ("mass", 1000.0),
    "ton": ("mass", 907.18474),
    "tons": ("mass", 907.18474),
    "shortton": ("mass", 907.18474),
    "shorttons": ("mass", 907.18474),
    "lb": ("mass", 0.45359237),
    "lbs": ("mass", 0.45359237),
    "pound": ("mass", 0.45359237),
    "pounds": ("mass", 0.45359237),

    # Liquid Volume (base: L)
    "l": ("liquid_vol", 1.0),
    "liter": ("liquid_vol", 1.0),
    "liters": ("liquid_vol", 1.0),
    "litre": ("liquid_vol", 1.0),
    "litres": ("liquid_vol", 1.0),
    "ml": ("liquid_vol", 0.001),
    "milliliter": ("liquid_vol", 0.001),
    "milliliters": ("liquid_vol", 0.001),
    "gal": ("liquid_vol", 3.78541),
    "gallon": ("liquid_vol", 3.78541),
    "gallons": ("liquid_vol", 3.78541),
    "bbl": ("liquid_vol", 158.9873),
    "barrel": ("liquid_vol", 158.9873),
    "barrels": ("liquid_vol", 158.9873),
    "barrelsbbl": ("liquid_vol", 158.9873),

    # Gas Volume (base: m3)
    "m3": ("gas_vol", 1.0),
    "cubicmeter": ("gas_vol", 1.0),
    "cubicmeters": ("gas_vol", 1.0),
    "cubicmetre": ("gas_vol", 1.0),
    "cubicmetres": ("gas_vol", 1.0),
    "scf": ("gas_vol", 0.0283168),
    "cf": ("gas_vol", 0.0283168),
    "cubicfeet": ("gas_vol", 0.0283168),
    "ccf": ("gas_vol", 2.83168),
    "kcf": ("gas_vol", 28.3168),
    "mcf": ("gas_vol", 28.3168),
    "mcfthousandscf": ("gas_vol", 28.3168),
    "mmcf": ("gas_vol", 28316.8),

    # Energy (base: kWh)
    "kwh": ("energy", 1.0),
    "kilowatthour": ("energy", 1.0),
    "kilowatthours": ("energy", 1.0),
    "wh": ("energy", 0.001),
    "watthour": ("energy", 0.001),
    "watthours": ("energy", 0.001),
    "mwh": ("energy", 1000.0),
    "megawatthour": ("energy", 1000.0),
    "megawatthours": ("energy", 1000.0),
    "gwh": ("energy", 1000000.0),
    "mj": ("energy", 0.277778),
    "megajoule": ("energy", 0.277778),
    "megajoules": ("energy", 0.277778),
    "gj": ("energy", 277.778),
    "gigajoule": ("energy", 277.778),
    "gigajoules": ("energy", 277.778),
    "btu": ("energy", 0.000293071),
    "mmbtu": ("energy", 293.071),

    # Transport
    "t-km": ("transport_freight", 1.0),
    "tonne-km": ("transport_freight", 1.0),
    "tonnekilometer": ("transport_freight", 1.0),
    "tonnekilometers": ("transport_freight", 1.0),
    "passenger-km": ("transport_pass", 1.0),
    "passengerkilometer": ("transport_pass", 1.0),
    "passengerkilometers": ("transport_pass", 1.0),

    # Count / General
    "unit": ("count", 1.0),
    "units": ("count", 1.0),
    "ea": ("count", 1.0),
    "each": ("count", 1.0),
    "count": ("count", 1.0),
    "pcs": ("count", 1.0),
    "pieces": ("count", 1.0),
}

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


def clean_unit(unit: str) -> str:
    cleaned = unit.lower().replace("³", "3")
    cleaned = re.sub(r"\(.*?\)", "", cleaned)
    return "".join(cleaned.split())


def normalize_unit(unit: str) -> str:
    c = clean_unit(unit)
    return UNIT_ALIASES.get(c, c)


def is_direct_emissions_unit(unit: str) -> bool:
    if not unit:
        return False
    c = clean_unit(unit)
    return c in DIRECT_EMISSIONS_UNITS or "co2" in c or "co2e" in c


def get_direct_emissions_multiplier(unit: str) -> float:
    c = clean_unit(unit)
    return DIRECT_EMISSIONS_UNITS.get(c, 1000.0 if ("ton" in c or "mt" in c or "t" in c) else 1.0)


def can_convert_unit(from_unit: str, to_unit: str) -> bool:
    c_from = clean_unit(from_unit)
    c_to = clean_unit(to_unit)
    if c_from == c_to:
        return True
    if is_direct_emissions_unit(from_unit) and is_direct_emissions_unit(to_unit):
        return True
    if c_from in DIMENSIONS and c_to in DIMENSIONS:
        return DIMENSIONS[c_from][0] == DIMENSIONS[c_to][0]
    return False


def convert_quantity(quantity: float, from_unit: str, to_base_unit: str) -> tuple[float, bool]:
    c_from = clean_unit(from_unit)
    c_to = clean_unit(to_base_unit)

    if c_from == c_to:
        return quantity, True

    if is_direct_emissions_unit(from_unit):
        mult = get_direct_emissions_multiplier(from_unit)
        return quantity * mult, True

    if c_from in DIMENSIONS and c_to in DIMENSIONS:
        dim_from, mult_from = DIMENSIONS[c_from]
        dim_to, mult_to = DIMENSIONS[c_to]
        if dim_from == dim_to:
            converted = quantity * (mult_from / mult_to)
            return converted, True

    return quantity, False


def units_match(input_unit: str, factor_unit: str) -> bool:
    if not input_unit or not factor_unit:
        return False
    if is_direct_emissions_unit(input_unit):
        return True
    return can_convert_unit(input_unit, factor_unit)