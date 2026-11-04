import { CachedMetadata, TFile } from "obsidian"
import { midFile } from "../../types/files.types"
import { FlatCls } from "../../types/classifications.types"
import { clsMap } from "./classifications.mocks"

type MockFileArgs = {
  name: string,
  path:string,
  cls: string,
  tags: string[],
  properties: Record<string, unknown>,
  expectedPath:string,
}

export class MockFile {
  expectedClsName: string
  expectedPath: string
  file: TFile
  metadataCache: CachedMetadata
  tags: string[]
  flatCls: FlatCls
  midfile: midFile
  constructor(moc:MockFileArgs) {
    this.file = {
      name: `${moc.name}.md`,
      basename: moc.name,
      extension: ".md",
      path:moc.path
    } as unknown as TFile
    this.flatCls = clsMap.get(moc.cls)!
    this.expectedClsName = this.flatCls.name
    this.metadataCache = {
      frontmatter: {...moc.properties, saftey:'yes'}
    }
    this.tags = moc.tags
    this.midfile = {
      TFile: this.file,
      metadataCache: this.metadataCache,
      tags:moc.tags
    }
    this.expectedPath = moc.expectedPath
  }
}