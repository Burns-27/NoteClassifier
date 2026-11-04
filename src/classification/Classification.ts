
import { FlatCls, TCls } from "../types/classifications.types";
import { FlatReqProp, FlatRule, TReqProp, TRule } from "../types/rules.types";
import { RuleFactory } from "../Rules/Rules";
import { midFile } from "../types/files.types";
import { settingUtil } from "../settings/settingsUtil";
import { debugLogArgs, devlog } from "../tools/logger";
import { ClsPathRes, ClsPropsRes, ClsRes } from "../types/responses.types";
import { SettingDefinitionList} from "obsidian";
import { reqPropFactory } from "../Rules/ReqProp";

import { modalManager } from "../tools/modalManager";

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
    this.requriedProperties = reqPropFactory(data.requriedProperties, this.name)
    this.destination = data.destination;
    this.rules = RuleFactory(data.rules, this.name)
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
  getSettings(update:(cls:TCls)=>void): SettingDefinitionList[]{
    return [this.rulesSetting(update), this.parentPropertiesSettings(), this.propSetting(update)]
  };
  private rulesSetting(update:(cls:TCls)=>void):SettingDefinitionList{
    let array: TRule[] = []
    this.rules.forEach((r)=>array.push(r))
    return {
      heading: "Rules",
      type: 'list',
      emptyState: "Add a rule to match notes to this classificaiton",
      addItem: {
        name: 'add rule',
        action: () => {
          const rule = this.addRule()
          modalManager.RulesModal(this, rule)
        }
      },
      onDelete: (index) => {
        const ruleId = array[index]?.id ?? 'err'
        this.flat.rules = this.flat.rules.filter((r) => r !== ruleId)
        settingUtil.get().reqProps.delete(ruleId)
        update(this)
      },
      items:array.map((r)=>({name:r.getDesc(), action:()=>{modalManager.RulesModal(this, r.flat)}}))
    }
  };
  private parentPropertiesSettings(): SettingDefinitionList{
    let parent = this.getParent()
    let propArray: Array<TReqProp> = []
    if (parent.success) {
      const parentPropsRes = parent.cls.getProps()
      if (parentPropsRes.success) {
        parentPropsRes.props.forEach((p)=>propArray.push(p))
      }
    }
    return {
      heading: 'Properties Required from Parent Classifications',
      type: 'list',
      emptyState: 'No properties Required From Parent Classifications',
      items: propArray.map((p)=>({name:p.getDesc(), desc:`From:${p.clsName}`}))
    }
  }
  private propSetting(update:(cls:TCls)=>void): SettingDefinitionList{
    let propertyArray: Array<TReqProp> = []
    this.requriedProperties.forEach((p) => propertyArray.push(p))
    return {
      heading: "Required Properties",
      type: 'list',
      emptyState: "This Classificaiton has no property requirements",
      addItem: {
        name: 'add property',
        action: () => { 
          const prop = this.addReqProp()
          modalManager.ReqPropModal(this, prop)
         } 
      },
      onDelete: (index) => {
        const propId = propertyArray[index]?.id ?? 'err'
        this.flat.requriedProperties = this.flat.requriedProperties.filter(p => p !== propId)
        settingUtil.get().reqProps.delete(propId)
        update(this)
      },
      items:propertyArray.map((p)=>({name:p.getDesc(), action:()=>{modalManager.ReqPropModal(this, p.flat)}}))
    }
    
  }
  private addRule():FlatRule {
    const id = settingUtil.nextID()
    let rule: FlatRule = {
      type: 'property',
      matchType: "exact",
      propertyName: "",
      propertyValue: "",
      id:id
    }
    this.flat.rules.push(id)
    settingUtil.get().rules.set(id, rule)
    this.rules = RuleFactory(this.flat.rules, this.name)
    return rule
  }
  private addReqProp(): FlatReqProp{
    const id = settingUtil.nextID()
    let prop: FlatReqProp = {
      id,
      type: 'exists',
      propertyName:''
    }
    this.flat.requriedProperties.push(id)
    settingUtil.get().reqProps.set(id, prop)
    this.requriedProperties = reqPropFactory(this.flat.requriedProperties, this.name)
    return prop
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



