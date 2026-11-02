
import { NewPropertyRule } from "../Rules/propertyRule"
import { TestFiles } from "./mocks/FileMocks"

describe.skip("Property Rules", () => {
  const mockPropertyRule = NewPropertyRule({
			id: '2',
			type: 'property',
			matchType: 'exact',
    propertyName: 'category',
			propertyValue: 'media',
  })
  
  describe("match()", () => {
    test("Matches Successfully", () => {
      const res = mockPropertyRule.match(TestFiles.media.midfile)
      expect(res.success).toBe(true)
    })
    test("Returns Fail if doesnt match", () => {
      const res = mockPropertyRule.match(TestFiles.project.midfile)
      expect(res.success).toBe(false)
    })
  })
})