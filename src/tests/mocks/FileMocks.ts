

import { TestCls } from "./classifications.mocks"
import { MockFile } from "./file.mock.factory"


const media: MockFile = new MockFile({
  name: "test1",
  path: "test1.md",
  cls: TestCls.media,
  tags: [],
  properties:{category:"media"}
})
const Project: MockFile = new MockFile({
  name: "Sewing",
  path: "sewing/Sewing.md",
  cls: TestCls.project,
  tags: ["project"],
  properties:{project:"Sewing"}
})
export const MockFileArray: MockFile[] = [media, Project]
export const TestFiles = {
  media: media,
  project:Project
}