import { FlatCls } from "../../types/classifications.types";
import { NoteClassifierSettings } from "../../types/settings.types";
import { TestCls } from "./classifications.mocks";
const testRules = new Map<string, FlatCls>()
testRules.set('1', TestCls.media.flatCls)
export const oneclasspart: Partial<NoteClassifierSettings> =
{
  debug: true,
  rules: testRules
}