import { Classification } from "../../classification/Classification"
import type { FlatCls, TCls } from "../../types/classifications.types"
import type {  ClsPathRes, ClsPropsRes, ClsRes } from "../../types/responses.types"

export type MockClsArg = {
  flatCls: FlatCls,
  expectedPath: string[],
  expectedProps: string[],
  level: 'Root' | 'Child',
  parent?: MockCls
}

export class MockCls {
  level: 'Root' | 'Child'
  flatCls: FlatCls
  expectedPath: string[]
  expectedProps: string[]
  mocPathRes: ClsPathRes
  mocPropsRes: ClsPropsRes
  constructor(moc: MockClsArg) {
    this.level = moc.level
    this.flatCls = moc.flatCls
    this.expectedPath = moc.expectedPath
      this.mocPathRes = {
        success: true,
        path:moc.expectedPath
      }
    this.expectedProps = moc.expectedProps
    this.mocPropsRes = {
      success: true,
      props:moc.expectedProps
    }
    
  }
}