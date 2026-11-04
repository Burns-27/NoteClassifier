
import type { FlatCls, } from "../../types/classifications.types"
import type {  ClsPathRes,  } from "../../types/responses.types"

export type MockClsArg = {
  flatCls: FlatCls,
  expectedPath: string[],
  expectedProps: string[],
  level: 'Root' | 'Child',
}

export class MockCls {
  level: 'Root' | 'Child'
  flatCls: FlatCls
  expectedPath: string[]
  expectedProps: string[]
  mocPathRes: ClsPathRes
  constructor(moc: MockClsArg) {
    this.level = moc.level
    this.flatCls = moc.flatCls
    this.expectedPath = moc.expectedPath
      this.mocPathRes = {
        success: true,
        path:moc.expectedPath
      }
    this.expectedProps = moc.expectedProps
  }
}