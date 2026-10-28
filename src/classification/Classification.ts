
import { FlatCls, TCls } from "../types/classifications.types";
import { TRule } from "../types/rules.types";
import { RuleFactory } from "../Rules/RuleFactory";
import { midFile } from "../types/files.types";
import { settingUtil } from "../settings/settingsUtil";
import { devlog } from "../logger";
import { ClsPathRes, ClsPropsRes, ClsRes } from "../types/responses.types";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  rules: TRule[];
  private destination: string
  requriedProperties: string[];
  constructor(data: FlatCls) {
    this.id = data.id
    this.parentID = data.parentID
    this.name = data.name
    this.requriedProperties = data.requriedProperties
    this.destination = data.destination;
    this.rules = RuleFactory(data.rules)
  }
  match(file: midFile): ClsRes{
    for (const rule of this.rules) {
      const check = rule.match(file)
      if(!check.success) return check
    }
    return {
      success: true,
      cls:this
    }
  }

  //TODO Flesh out the get path method
 
  getDesc() {
    let desc:string[] = []
    this.rules.forEach((rule) => { desc.push(rule.getDesc()) })
    return desc.join("/n - ")
  }
  getPath(): ClsPathRes{
    devlog.loc("Class Get Path","", {cls: this} )
    const clsDest = this.destination.split('/')
    devlog.test("Original Destination Array", clsDest)
    let destinationArray: string[] = []
    if (clsDest[0] == "*") {
      const parentClsRes = this.getParent()
      devlog.test("Parent Class Result", parentClsRes)
      if (parentClsRes.success) {
        const parentCls = parentClsRes.cls
        const parentClsPath = parentCls.getPath()
        devlog.test("Parent Path Result", parentClsPath)
        if (parentClsPath.success) {
          destinationArray.push(...parentClsPath.path)
        } else {
          devlog.fallback("Parent Path", {parentCls: parentCls, pathResult: parentClsPath})
        }
      } else {
        devlog.fallback("Parent Object for path", {cls: this, parentClsRes })
      }
      clsDest.shift()
    }
    destinationArray.push(...clsDest)
    devlog.test("Destination Array Final", destinationArray)
    return {
      success: true,
      path: destinationArray
    }
  }
  getProps(): ClsPropsRes{
    let props = [...this.requriedProperties]
    if (this.parentID) {
      const parentClsRes = this.getParent()
      if (parentClsRes.success) {
        const parentClsPropsRes = parentClsRes.cls.getProps()
        if (parentClsPropsRes.success) {
          props.push(...parentClsPropsRes.props)
        }
      }
    }
    return {
      success: true, 
      props: [...new Set(props)]
    }
  }
 getParent(): ClsRes{
    if (this.parentID) {
      const parentClsRes = settingUtil.getCls(this.parentID)
       return parentClsRes
    } else {
      return {
        success: false,
        message:"No Parent ID"
      }
    }
  }
}

export class NodeClass {
  children: NodeClass[] = [];
  public classification: TCls;
  constructor(classification: TCls) {
    this.classification = classification
  }
  search(file:midFile): ClsRes{
    const res = this.classification.match(file)
    if (!res.success) return res
    if (this.children.length == 0) {
      return res
    }
    for (const child of this.children) {
      const deeperMatch = child.search(file)
      if (deeperMatch.success) {
        return deeperMatch
      }
    }
    return res
  }
}



