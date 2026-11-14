
import { reqPropFactory } from "../ReqProps/factory";
import { RuleFactory } from "../Rules/Factory";
import { setUtil } from "../settings/settings";
import { logs } from "../tools/logClass";
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
  match(file: midFile): ClsRes{
    let log = new logs('Classify', `Classification Match on ${this.name}`,false)
    let match: boolean[] = []
    let rulesMap: Map<string, { rule: FlatRule, match: boolean }> = new Map()
    for (const [key, rule ]of this.rules) {
      const check = rule.match(file)
      rulesMap.set(key, {rule: rule.flat, match:check.success})
      match.push(check.success)
    }
    
    const matchsimplified = !match.includes(false)
    log.devRecord({match, rulesMap, matchsimplified})
    if (matchsimplified) {
      log.log('Matched')
      return  {
        success: true,
        cls:this
      }
    } else {
      log.log('Not A Match')
      return {
        success:false,
      }
    }
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
  search(file: midFile): ClsRes{
    let res = this.cls.match(file)
    if (res.success && (this.children.length > 0)) {
      for (const child of this.children) {
        const deeperMatch = child.search(file)
        if (deeperMatch.success) {
          res = deeperMatch
          return res
        }
      }
    }
    return res
  }
}



