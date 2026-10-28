

import { devlog } from "../logger"
import { settingUtil } from "../settings/settingsUtil"
import { TestCls } from "./mocks/classifications.mocks"
import { TestFiles } from "./mocks/FileMocks"
describe("Classification", () => {
  beforeAll(() => {
    jest.spyOn(devlog, "test").mockImplementation((thing, ...args: unknown[])=> {
      console.debug(`[${thing}]`, JSON.stringify(args, null, 2))
    })
  })

  describe("match()", () => {
    test("Sends Success when all rules match", () => {
      const res = TestCls.articleGuide.cls.match(TestFiles.articleGuide.midfile)
      expect(res.success).toBe(true)
    })
    test("Sends Fail when no rules match", () => {
      const res = TestCls.media.cls.match(TestFiles.generalNotes.midfile)
      expect(res.success).toBe(false)
    })
    test("Sends Fail when only some rules match", () => {
      const res = TestCls.articleGuide.cls.match(TestFiles.article.midfile)
      expect(res.success).toBe(false)
    })
  })
  describe("getPath()", () => {
    test("Returns basic Path", () => {
      const res = TestCls.media.cls.getPath()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.path).toEqual(TestCls.media.expectedPath)
      }
    })
    test("Returns Nested path with Parent", () => {
      jest.spyOn(settingUtil,"getCls").mockReturnValue(TestCls.projectNotes.mocParentRes)
      const res = TestCls.projectNotes.cls.getPath()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.path).toEqual(TestCls.projectNotes.expectedPath)
      }
    })
  })
  describe("getProps()", () => {
    test("Returns list of props when root", () => {
      const res = TestCls.project.cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual(TestCls.project.expectedProps)
      }
    })
    test("Returns Props from all parent Cls", () => {
      jest.spyOn(settingUtil,"getCls").mockReturnValue(TestCls.projectNotes.mocParentRes)
      const res = TestCls.projectNotes.cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual(TestCls.projectNotes.expectedProps)
      }
    })
    test("Returns Empty array when no required props", () => {
      const res = TestCls.media.cls.getProps()
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.props).toEqual([])
      }
    })
  })
})

