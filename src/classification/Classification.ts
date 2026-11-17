
import { reqPropFactory } from "../ReqProps/factory";
import { RuleFactory } from "../Rules/Factory";
import { settings } from "../settings/settings";
import { Logs } from "../tools";

import { TRule, TReqProp, midFile, ClsRes, FlatRule,  FlatReqProp } from "../types";
import { TCls, FlatCls } from "../types/classifications.types";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  rules: Map<string, TRule>;
  flat: FlatCls
  private destination: string
  reqProps: Map<string, TReqProp>;
  constructor(data: FlatCls) {
    this.id = data.id
    this.flat = data
    this.parentID = data.parentID
    this.reqProps = reqPropFactory(data.requriedProperties, this.name)
    this.destination = data.destination;
    this.rules = RuleFactory(data.rules, this.name)
  }
  get name(): string{
    return this.flat.name
  }
  get propOrder(): string[]{
    return this.flat.propOrder??[]
  }
  match(file: midFile, log:Logs): boolean{
    let match: boolean[] = []
    for (const [, rule ]of this.rules) {
      const check = rule.match(file, log)
      match.push(check)
    }
    
    const matchsimplified = !match.includes(false)
    log.add(`Results of Matching ${this.name}`,{match, matchsimplified})
    return matchsimplified
  }
  get path(): string[]{
    const clsDest = this.destination.split('/')
    let destinationArray: string[] = []
    if (clsDest[0] == "*") {
      const parentCls = this.parent
      if (parentCls) {
          destinationArray.push(...parentCls.path)

      } 
      clsDest.shift()
    }
    destinationArray.push(...clsDest)
    return  destinationArray
    
  }
  get allReqProps(): Map<string, TReqProp>{
    let reqProp = new Map(this.reqProps)
      const parentCls = this.parent
      if (parentCls) {
        const parentClsProps= parentCls.allReqProps
          for (const [key, prop] of parentClsProps) {
            if (!reqProp.has(key)) {
              reqProp.set(key, prop)
            }
          }
        }
    return reqProp
  }
   get parent(): TCls|false{
    if (this.parentID) {
      const parentCls = settings.clsMap.get(this.parentID)
      if (parentCls) {
        return parentCls
      }
    } 
    return false
  }
 
  public get parentReqProps(): Map<string, TReqProp>{
    let parent = this.parent
    if (parent) {
      return parent.allReqProps
    }
    return new Map()
  }
  addRule():FlatRule {
    const id = settings.nextID
    let rule: FlatRule = {
      type: 'property',
      matchType: "exact",
      propertyName: "",
      propertyValue: "",
      id:id
    }
    this.rules = RuleFactory(this.flat.rules, this.name)
    this.flat.rules.push(id)
    settings.ruleMap.set(id, rule)
    return rule
  }
  addReqProp(): FlatReqProp{
    const id = settings.nextID
    let prop: FlatReqProp = {
      id,
      type: 'exists',
      propertyName: '',
      defaultValue:'', 
    }
    this.reqProps = reqPropFactory(this.flat.requriedProperties, this.name)
    this.flat.requriedProperties.push(id)
    settings.reqPropMap.set(id, prop)
    return prop
  }
}

export class NodeClass {
  children: NodeClass[] = [];
  isRoot:boolean
  readonly id: string;
  public cls: TCls;
  constructor(classification: TCls) {
    this.cls = classification
    this.id = classification.id
    this.isRoot = !classification.parent
  }
  search(file: midFile, log:Logs): ClsRes{
    let clsCheck = this.cls.match(file, log)
    if (clsCheck) {
      if (this.children.length > 0) {
        for (const child of this.children) {
          const deeperMatch = child.search(file, log)
          if (deeperMatch.success) {
            return deeperMatch
          }
        }
      } 
        return { success: true, cls: this.cls }
      }
    
    return {success: false}
  }
}



