from pydantic import BaseModel, ConfigDict, Field


class ActivityInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    activityName: str = Field(min_length=1)
    quantity: float = Field(gt=0, allow_inf_nan=False)
    unit: str | None = Field(default=None, min_length=1)
    facility: str | None = Field(default=None, min_length=1)
    reportingPeriod: str | None = Field(default=None, min_length=1)


class MapRequest(BaseModel):
    activities: list[ActivityInput] = Field(min_length=1)