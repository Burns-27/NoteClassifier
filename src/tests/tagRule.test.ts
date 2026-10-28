
import { devlog } from "../logger";
import { NewTagRule } from "../Rules/tagRule"
import { TestFiles } from "./mocks/FileMocks";

describe("Tag Rules", () => {
  beforeAll(() => {
        jest.spyOn(devlog, 'test').mockImplementation(
          (thing, ...args: unknown[]) => {
            console.debug(`[${thing}]`, JSON.stringify(args, null, 2));
          },
        );
      });
  describe("Exact Tag Rules", () => {
    const mockTagRule = NewTagRule({ id: '4', type: 'tag', matchType: 'exact', tag: 'project' })
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
    const mockTagRule = NewTagRule({ id: '6', type: 'tag', matchType: 'include', tag: 'notes' })
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