

import { CreateRule } from "../src/Rules/Factory";
import { TestFiles } from "./mocks/FileMocks";

describe.skip("Tag Rules", () => {

  describe("Exact Tag Rules", () => {
    const mockTagRule = CreateRule({ id: '4', type: 'tag', matchType: 'exact', tag: 'project' },"Project")
    describe("Match()", () => {
      test("Matches successfully", () => {
      })
      test("Doesnt match nested tags", () => {
        
      })
      test("Fails if no matching tags", () => {
        const res = mockTagRule.match(TestFiles.media.midfile)
        expect(res.success).toBe(false)
        
      })
    })
  })
  describe("Include Tag Rules", () => {
    const mockTagRule = CreateRule({ id: '6', type: 'tag', matchType: 'include', tag: 'notes' }, "Notes")
    test("Matches single tag", () => {
      const res = mockTagRule.match(TestFiles.generalNotes.midfile)
      expect(res.success).toBe(true)
    })
    test("Matches Nested Tag", () => {
      const res = mockTagRule.match(TestFiles.projectNotes.midfile)
      expect(res.success).toBe(true)
    })
    test("Fails if no matching tag", () => {
      const res = mockTagRule.match(TestFiles.media.midfile)
      expect(res.success).toBe(false)
    })
  })
})