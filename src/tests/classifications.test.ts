
import { devlog } from "../logger"
describe.skip("Classification", () => {
  beforeAll(() => {
    jest.spyOn(devlog, "test").mockImplementation((thing, ...args: unknown[])=> {
      console.debug(`[${thing}]`, JSON.stringify(args, null, 2))
    })
  })
  describe("match()", () => {
    test("Matches To proper Root Rule", () => {
      
    })
  })
  describe("getDesc()", () => {
    
  })
  describe("getPath()", () => {
    
  })
  describe("getProps()", () => {
    
  })

})

