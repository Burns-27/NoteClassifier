
import { FlatCls, TCls } from "../types/classifications.types";
import { FlatRule, TRule } from "../types/rules.types";
import { RuleFactory } from "../Rules/RuleFactory";
import { midFile } from "../types/files.types";
import { settingUtil } from "../settings/settingsUtil";
import { devlog } from "../logger";
import { ClsPathRes, ClsPropsRes, ClsRes } from "../types/responses.types";
import { SettingGroupItem } from "obsidian";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  rules: Map<string, TRule>;
  flat: FlatCls
  private destination: string
  requriedProperties: string[];
  constructor(data: FlatCls) {
    this.id = data.id
    this.flat = data
    this.parentID = data.parentID
    this.name = data.name
    this.requriedProperties = data.requriedProperties
    this.destination = data.destination;
    let rulesResArray = data.rules.map((r) => {return settingUtil.getFlatRule(r)})
    const rulesResFiltered = rulesResArray.filter(r => r.success)
    const rulesArray = rulesResFiltered.map(r => r.rule)
    this.rules = RuleFactory(rulesArray)
  }
  match(file: midFile): ClsRes{
    let match: boolean[] = []
    let rules:FlatRule[] = []
    let res: ClsRes
    for (const [_key, rule ]of this.rules) {
      const check = rule.match(file)
      rules.push(rule.flat)
      match.push(check.success)
    }
    const matchsimplified = match.includes(false)
    if (!matchsimplified) {
      res =  {
        success: true,
        cls:this
      }
    } else {
      res = {
        success:false,
      }
    }
    devlog.loc('Match - clsMatch', 'postRun', { res, match, matchsimplified , rules})
    return res
  }

  //TODO Flesh out the get path method
 
  getDesc() {
    let desc:string[] = []
    this.rules.forEach((rule) => { desc.push(rule.getDesc()) })
    return desc.join("/n - ")
  }
  getPath(): ClsPathRes{
    const clsDest = this.destination.split('/')
    let destinationArray: string[] = []
    let Record:Record<string, unknown> ={cls: this, clsDest: [...clsDest] }
    if (clsDest[0] == "*") {
      const parentClsRes = this.getParent()
      Record.ParentClsRes = parentClsRes
      if (parentClsRes.success) {
        const parentCls = parentClsRes.cls
        const parentClsPath = parentCls.getPath()
        Record.ParentClsPathRes = parentClsPath
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
    Record.destinationArray = destinationArray
    devlog.loc('Path - Cls Get',"Destination Array Final", Record)
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
    devlog.loc('RulesSettingArray',"Before Return", {array})
    return array
  } ;
}

export class NodeClass {
  children: NodeClass[] = [];
  public classification: TCls;
  constructor(classification: TCls) {
    this.classification = classification
  }
  search(file:midFile): ClsRes{
    let res = this.classification.match(file)
    if (!res.success) {
      devlog.loc('Match - Node Search',"Doesnt match this one",{res})
      return res
    }
    if (this.children.length == 0) {
      devlog.loc('Match - Node Search',"Matches, No children", {res, childLength: this.children.length})
      return res
    }
    for (const child of this.children) {
      const deeperMatch = child.search(file)
      if (deeperMatch.success) {
        devlog.loc('Match - Node Search', "Child Matches",{res, deeperMatch})
        res = deeperMatch
      }
    }
    devlog.loc('Match - Node Search', "Fallback", {res})
    return res
  }
}



