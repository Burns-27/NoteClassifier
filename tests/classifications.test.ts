

import { Classification } from "../src/classification/Classification"
import { settingUtil } from "../src/settings/settingsUtil"
import { TestFiles } from "./mocks/FileMocks"
import { settingMocks } from "./mocks/setting.mocks"
describe.skip("Classification", () => {
  beforeAll(() => {
    settingUtil.updateAll(settingMocks)
  })

  describe("match()", () => {
    test("Sends Success when all rules match", () => {
      
    })
    test("Sends Fail when no rules match", () => {
      
    })
    test("Sends Fail when only some rules match", () => {
      
    })
  })
  describe("getPath()", () => {
    test("Returns basic Path", () => {
      
    })
    test("Returns Nested path with Parent", () => {
     
  })
  describe("getProps()", () => {
    test("Returns list of props when root", () => {
      
    })
    test("Returns Props from all parent Cls", () => {
      
    })
    test("Returns Empty array when no required props", () => {
      
    })
  })
})
})

