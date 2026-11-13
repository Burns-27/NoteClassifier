
import { reqPropFactory } from "../ReqProps/factory";
import { RuleFactory } from "../Rules/Factory";
import { setUtil } from "../settings/settings";
import { devlog, debugLogArgs } from "../tools/logger";
import { TRule, TReqProp, midFile, ClsRes, FlatRule,  FlatReqProp } from "../types";
import { TCls, FlatCls } from "../types/classifications.types";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  rules: Map<string, TRule>;
  flat: FlatCls
  private destination: string
  reqProps: Map<string, TReqProp>;
  constructor(data: FlatCls) {
    this.id = data.id
    this.flat = data
    this.parentID = data.parentID
    this.name = data.name
    this.reqProps = reqPropFactory(data.requriedProperties, this.name)
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
      const parentCls = setUtil.clsMap.get(this.parentID)
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
    const id = setUtil.nextID
    let rule: FlatRule = {
      type: 'property',
      matchType: "exact",
      propertyName: "",
      propertyValue: "",
      id:id
    }
    this.flat.rules.push(id)
    setUtil.ruleMap.set(id, rule)
    this.rules = RuleFactory(this.flat.rules, this.name)
    return rule
  }
  addReqProp(): FlatReqProp{
    const id = setUtil.nextID
    let prop: FlatReqProp = {
      id,
      type: 'exists',
      propertyName:''
    }
    this.flat.requriedProperties.push(id)
    setUtil.reqPropMap.set(id, prop)
    this.reqProps = reqPropFactory(this.flat.requriedProperties, this.name)
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
  search(file: midFile, parentlog?:debugLogArgs): ClsRes{
    let log = parentlog ?? devlog.start('Classify', 'Node Search')
    let res = this.cls.match(file)
    log.extra[this.cls.name] = { name: this.cls.name, res, NumberOfChildren:this.children.length}
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



