import { CachedMetadata, TFile } from "obsidian"
import { TCls } from "../../types/classifications.types"
import { midFile } from "../../types/files.types"
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
  cls: TCls
  mockCls: MockCls
  mockMatchRes: ClsRes
  midfile: midFile
  constructor(moc:MockFileArgs) {
    this.file = {
      name: `${moc.name}.md`,
      basename: moc.name,
      extension: ".md",
      path:moc.path
    } as unknown as TFile
    this.cls = moc.cls.cls
    this.mockCls = moc.cls
    this.expectedClsName = moc.cls.cls.name
    this.metadataCache = {
        frontmatter:moc.properties
    }
    this.tags = moc.tags
    this.mockMatchRes = {
      success: true,
      cls: moc.cls.cls
    }
    this.midfile = {
      TFile: this.file,
      metadataCache: this.metadataCache,
      tags:moc.tags
    }
    this.expectedPath = moc.expectedPath
    this.expectedProperties = moc.cls.expectedProps
  }
}