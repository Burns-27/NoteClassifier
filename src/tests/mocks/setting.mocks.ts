import { FlatCls } from "../../types/classifications.types";
import { NoteClassifierSettings } from "../../types/settings.types";
import { classes, Rules, TestCls } from "./classifications.mocks";
const testRules = new Map<string, FlatCls>()
testRules.set('1', TestCls.media.flatCls)
export const settingMocks: Partial<NoteClassifierSettings> =
{
  debug: true,
  classes:classes,
  rules:Rules
}