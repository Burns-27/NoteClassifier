

import { TestCls } from "./classifications.mocks"
import { MockFile } from "./file.mock.factory"


const media: MockFile = new MockFile({
  name: "test1",
  path: "test1.md",
  cls: TestCls.media,
  tags: [],
  properties: { category: "media" },
  expectedPath:'Media/test1.md'
})
const articleGuide: MockFile = new MockFile({
  name: 'Testing Guide',
  path: 'Testing Guide.md',
  cls: TestCls.articleGuide,
  tags: ['#guide'],
  properties: { mediaType: 'article', category: 'media' },
  expectedPath:'Media/Article/Guides/Testing Guide.md'
})
const article: MockFile = new MockFile({
  name: "Article",
  path: 'Article.md',
  cls: TestCls.media,
  tags: [],
  properties: { mediaType: 'article', category: 'media' },
  expectedPath:'Media/Article.md'
})
const Project: MockFile = new MockFile({
  name: "Sewing",
  path: "sewing/Sewing.md",
  cls: TestCls.project,
  tags: ["#project"],
  properties: { project: "Sewing" },
  expectedPath:'Sewing/Sewing.md'
})
const ProjectNotes: MockFile = new MockFile({
  name: "Bag Notes",
  path: "sewing/Bag Notes.md",
  tags: ["#project/notes"],
  cls:TestCls.projectNotes, 
  properties: { project: "Sewing" },
  expectedPath:'Sewing/notes/BagNotes.md'
})
const generalNotes: MockFile = new MockFile({
  name: "General Notes",
  path: "General Notes.md",
  tags: ["#notes"],
  cls:TestCls.generalNotes,
    properties:{ subject: 'Learning' },
  expectedPath:"Learning/notes/General Notes.md"
  
})
export const MockFileArray: MockFile[] = [media, articleGuide,article,  Project, ProjectNotes,generalNotes]
export const TestFiles = {
  media: media,
  project: Project,
  projectNotes: ProjectNotes,
  generalNotes: generalNotes,
  articleGuide: articleGuide,
  article:article
}