import { CachedMetadata, TFile } from "obsidian"
import { TCls } from "../../types/classifications.types"
import { midFile, TClsFile } from "../../types/files.types"
import { MockCls } from "./cls.mock.factory"
import { ClsRes } from "../../types/responses.types"
import { mock } from "node:test"



type MockFileArgs = {
  name: string,
  path:string,
  cls: MockCls,
  tags: string[],
  properties: Record<string, unknown>,
  expectedPath:string,
}

export class MockFile {
  expectedClsName: string
  expectedPath: string
  expectedProperties: string[]
  file: TFile
  metadataCache: CachedMetadata
  tags: string[]
  mockCls: MockCls
  midfile: midFile
  constructor(moc:MockFileArgs) {
    this.file = {
      name: `${moc.name}.md`,
      basename: moc.name,
      extension: ".md",
      path:moc.path
    } as unknown as TFile
    this.mockCls = moc.cls
    this.expectedClsName = moc.cls.flatCls.name
    this.metadataCache = {
      frontmatter: {...moc.properties, saftey:'yes'},
      
    }
    this.tags = moc.tags
    
    this.midfile = {
      TFile: this.file,
      metadataCache: this.metadataCache,
      tags:moc.tags
    }
    this.expectedPath = moc.expectedPath
    this.expectedProperties = moc.cls.expectedProps
  }
}