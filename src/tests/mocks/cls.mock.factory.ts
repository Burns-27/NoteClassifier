import { Classification } from "../../classification/Classification"
import { FlatCls, TCls } from "../../types/classifications.types"
import { ActionResult } from "../../types/responses.types"

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
  cls: TCls
  expectedPath: string[]
  expectedProps: string[]
  mocPathRes: ActionResult
  mocPropsRes: ActionResult
  mocParentRes: ActionResult
  constructor(moc: MockClsArg) {
    this.level = moc.level
    this.flatCls = moc.flatCls
    this.cls = new Classification(moc.flatCls)
    this.expectedPath = moc.expectedPath
      this.mocPathRes = {
        success: true,
        type: "ClsPath",
        path:moc.expectedPath
      }
    this.expectedProps = moc.expectedProps
    this.mocPropsRes = {
      success: true,
      type: "ClsProps",
      props:moc.expectedProps
    }
    if (moc.parent) {
      this.mocParentRes = {
        success: true,
        type: "Cls Get",
        cls: moc.parent.cls
      }
    } else {
      this.mocParentRes = {
        success: false,
        message:"No Parent ID"
      }
    }
  }
}