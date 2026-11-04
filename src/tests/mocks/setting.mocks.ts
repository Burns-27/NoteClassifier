

import { NCPData, } from "../../types/settings.types";
import { clsData,  } from "./classifications.mocks";
import { reqPropData } from "./reqprops.mocks";
import { rulesData } from "./rule.mocks";

export const settingMocks: Partial<NCPData> =
{
  debug: true,
  rules: rulesData,
  classes: clsData,
  reqProps:reqPropData
}