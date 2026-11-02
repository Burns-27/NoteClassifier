
import { FlatCls, TCls } from "../types/classifications.types";
import { FlatReqProp, FlatRule, TReqProp, TRule } from "../types/rules.types";
import { RuleFactory } from "../Rules/RuleFactory";
import { midFile } from "../types/files.types";
import { settingUtil } from "../settings/settingsUtil";
import { debugLogArgs, devlog } from "../tools/logger";
import { ClsPathRes, ClsPropsRes, ClsRes } from "../types/responses.types";
import { SettingGroupItem } from "obsidian";
import { reqPropFactory } from "../Rules/reqPropRule";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  rules: Map<string, TRule>;
  flat: FlatCls
  private destination: string
  requriedProperties: Map<string, TReqProp>;
  constructor(data: FlatCls) {
    this.id = data.id
    this.flat = data
    this.parentID = data.parentID
    this.name = data.name
    this.requriedProperties = reqPropFactory(data.requriedProperties)
    this.destination = data.destination;
    let rulesResArray = data.rules.map((r) => {return settingUtil.getFlatRule(r)})
    const rulesResFiltered = rulesResArray.filter(r => r.success)
    const rulesArray = rulesResFiltered.map(r => r.rule)
    this.rules = RuleFactory(rulesArray)
  }
  match(file: midFile): ClsRes{
    let log = devlog.start('Classify', 'Cls Match')
    log.extra.cls = this
    let match: boolean[] = []
    let rulesMap: Map<string, { rule: FlatRule, match: boolean }> = new Map()
    let res: ClsRes
    for (const [key, rule ]of this.rules) {
      const check = rule.match(file)
      rulesMap.set(key, {rule: rule.flat, match:check.success})
      match.push(check.success)
    }
    const matchsimplified = !match.includes(false)
    if (matchsimplified) {
      res =  {
        success: true,
        cls:this
      }
    } else {
      res = {
        success:false,
      }
    }
    log.info = { res, matchArray: match, clsMatches: matchsimplified }
    log.extra = {rulesMap}
    devlog.loc(log)
    return res
  }

  getPath(): ClsPathRes{
    let log = devlog.start('Move', 'Cls Get Path')
    log.extra.cls = this
    const clsDest = this.destination.split('/')
    log.info.clsDestSplitArray = [...clsDest]
    let destinationArray: string[] = []
    if (clsDest[0] == "*") {
      const parentClsRes = this.getParent()
      log.extra.ParentClsRes = parentClsRes
      if (parentClsRes.success) {
        const parentCls = parentClsRes.cls
        const parentClsPath = parentCls.getPath()
        log.extra.ParentClsPathRes = parentClsPath
        if (parentClsPath.success) {
          log.info.parentClsPath = parentClsPath.path
          destinationArray.push(...parentClsPath.path)
        } else {
          log.msg = "unable to get parent path"
          devlog.err(log, {parentClsPath})
        }
      } else {
        log.msg = 'Unable to get parent object'
        devlog.err(log, {cls: this, parentClsRes })
      }
      clsDest.shift()
    }
    destinationArray.push(...clsDest)
    log.info.destinationArray = destinationArray
    devlog.loc(log)
    return {
      success: true,
      path: destinationArray
    }
  }
  getProps(): ClsPropsRes{
    let reqProp = new Map(this.requriedProperties)
    if (this.parentID) {
      const parentClsRes = this.getParent()
      if (parentClsRes.success) {
        const parentClsPropsRes = parentClsRes.cls.getProps()
        if (parentClsPropsRes.success) {
          for (const [key, prop] of parentClsPropsRes.props) {
            if (!reqProp.has(key)) {
              reqProp.set(key, prop)
            }
          }
        }
      }
    }
    return {
      success: true, 
      props: reqProp
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
  rulesSettingArray(openModal: (cls: TCls, rule: FlatRule) => void): {item:SettingGroupItem, id:string}[]{
    let array: {item:SettingGroupItem, id:string}[] = []
    this.rules.forEach((r) => {
      array.push({
        id: r.id, item: {
          name: r.getDesc(),
          action: () => openModal(this, r.flat)
        }
      })
    })
    return array
  };
  propSettingArray(openModal: (cls: TCls, prop: FlatReqProp) => void): { item: SettingGroupItem, id: string }[]{
    let array: { item: SettingGroupItem, id: string }[] = []
    this.requriedProperties.forEach((p) => {
      array.push({
        id: p.id,
        item: {
          name: p.getDesc(),
          action:()=>openModal(this, p.flat)
        }
      })
    })
    return array
  }
}

export class NodeClass {
  children: NodeClass[] = [];
  public classification: TCls;
  constructor(classification: TCls) {
    this.classification = classification
  }
  search(file: midFile, parentlog?:debugLogArgs): ClsRes{
    let log = parentlog ?? devlog.start('Classify', 'Node Search')
    let res = this.classification.match(file)
    log.extra[this.classification.name] = { name: this.classification.name, res, NumberOfChildren:this.children.length}
    if (res.success && (this.children.length > 0)) {
      for (const child of this.children) {
        const deeperMatch = child.search(file, log)
        if (deeperMatch.success) {
          res = deeperMatch
          return res
        }
      }
    }
    log.info.matchingRes = res
    devlog.loc(log)
    return res
  }
}



