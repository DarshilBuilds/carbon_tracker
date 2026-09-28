import unittest

from pydantic import ValidationError

from schemas import ActivityInput, MapRequest
from unit_validation import units_match


class RequestValidationTests(unittest.TestCase):
    def test_rejects_non_positive_and_non_finite_quantities(self):
        for quantity in (0, -1, float("nan"), float("inf")):
            with self.subTest(quantity=quantity):
                with self.assertRaises(ValidationError):
                    ActivityInput(activityName="diesel", quantity=quantity)

    def test_rejects_empty_activity_names_and_requests(self):
        with self.assertRaises(ValidationError):
            ActivityInput(activityName="   ", quantity=1)
        with self.assertRaises(ValidationError):
            MapRequest(activities=[])

    def test_preserves_optional_reporting_metadata(self):
        activity = ActivityInput(
            activityName=" diesel ",
            quantity=1,
            unit=" L ",
            facility=" Plant 01 ",
            reportingPeriod=" 2025-01 ",
            zipCode=" 79355 ",
        )

        self.assertEqual(activity.activityName, "diesel")
        self.assertEqual(activity.unit, "L")
        self.assertEqual(activity.facility, "Plant 01")
        self.assertEqual(activity.reportingPeriod, "2025-01")
        self.assertEqual(activity.zipCode, "79355")

    def test_matches_unit_aliases_and_rejects_wrong_dimensions(self):
        self.assertTrue(units_match("m³", "m3"))
        self.assertTrue(units_match("liters", "L"))
        self.assertFalse(units_match("kg", "L"))

    def test_large_batch_request_validation(self):
        activities = [
            ActivityInput(activityName="electricity consumption", quantity=0.07, unit="kWh")
            for _ in range(1500)
        ]
        req = MapRequest(activities=activities)
        self.assertEqual(len(req.activities), 1500)


if __name__ == "__main__":
    unittest.main()