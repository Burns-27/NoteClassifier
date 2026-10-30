

import { Classification } from "../classification/Classification"
import { devlog } from "../logger"
import { settingUtil } from "../settings/settingsUtil"
import { TestCls } from "./mocks/classifications.mocks"
import { TestFiles } from "./mocks/FileMocks"
import { settingMocks } from "./mocks/setting.mocks"
describe.skip("Classification", () => {
  beforeAll(() => {
    jest.spyOn(devlog, "test").mockImplementation((thing, ...args: unknown[]) => {
      console.debug(`[${thing}]`, JSON.stringify(args, null, 2))
    })
    jest.spyOn(devlog, 'loc').mockImplementation((loc, message?, info?) => {
      if (loc.startsWith("*")) {
        console.debug(`[Test](${loc})${message ?? ""}`, info ?? "")
        
      }
    }
  )
    settingUtil.updateAll(settingMocks)
  })

  describe("match()", () => {
    test("Sends Success when all rules match", () => {
      const cls = new Classification(TestCls.articleGuide.flatCls)
      const res = cls.match(TestFiles.articleGuide.midfile)
      expect(res.success).toBe(true)
    })
    test("Sends Fail when no rules match", () => {
      const cls = new Classification(TestCls.media.flatCls)
      const res = cls.match(TestFiles.generalNotes.midfile)
      expect(res.success).toBe(false)
    })
    test("Sends Fail when only some rules match", () => {
      const cls = new Classification(TestCls.articleGuide.flatCls)
      const res = cls.match(TestFiles.article.midfile)
      expect(res.success).toBe(false)
    })
  })
  describe("getPath()", () => {
    test("Returns basic Path", () => {
      const cls = new Classification(TestCls.media.flatCls)
      const res = cls.getPath()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.path).toEqual(TestCls.media.expectedPath)
      }
    })
    test("Returns Nested path with Parent", () => {
      const cls = new Classification(TestCls.projectNotes.flatCls)
      const res = cls.getPath()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.path).toEqual(TestCls.projectNotes.expectedPath)
      }
    })
  })
  describe("getProps()", () => {
    test("Returns list of props when root", () => {
      const cls = new Classification(TestCls.project.flatCls)
      const res = cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual(TestCls.project.expectedProps)
      }
    })
    test("Returns Props from all parent Cls", () => {
      const cls = new Classification(TestCls.projectNotes.flatCls)
      const res = cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual(TestCls.projectNotes.expectedProps)
      }
    })
    test("Returns Empty array when no required props", () => {
      const cls = new Classification(TestCls.media.flatCls)
      const res = cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual([])
      }
    })
  })
})

