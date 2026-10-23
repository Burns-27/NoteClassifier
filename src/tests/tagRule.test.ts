
import { devlog } from "../logger";
import { NewTagRule } from "../Rules/tagRule"

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
    test("Matches successfully", () => {
      
    })
    test("Doesnt match nested tags", () => {
      
    })
    test("Fails if no matching tags", () => {
      
    })
  })
  describe("Include Tag Rules", () => {
    const mockTagRule = NewTagRule({ id: '6', type: 'tag', matchType: 'include', tag: 'notes' })
    test("Matches single tag", () => {
      
    })
    test("Matches Nested Tag", () => {
      
    })
    test("Fails if no matching tag", () => {
      
    })
  })
})