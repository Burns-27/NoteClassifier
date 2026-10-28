import { NoteClassifierSettings } from "../../types/settings.types";
import { TestCls } from "./classifications.mocks";

export const oneclasspart: Partial<NoteClassifierSettings> =
{
  createReports: true,
  rules: [TestCls.media.flatCls]
}