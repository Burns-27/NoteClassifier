
import { Classification, NodeClass } from "../classification/Classification";
import { BaseNCPSettings, DEFAULT_BASE_SETTINGS, FlatReqProp, FlatRule,  NCPData} from "../types";
import { FlatCls, TCls } from "../types/classifications.types";

export class SettingsUtil {
  private static instance: SettingsUtil;
  public base: BaseNCPSettings = DEFAULT_BASE_SETTINGS

  public flatClsMap: Map<string, FlatCls> = new Map()
  public clsMap: Map<string, TCls> = new Map()
  private nodeMap: Map<string, NodeClass> = new Map()
  public nodeTree: Array<NodeClass> = []
  public ruleMap: Map<string, FlatRule> = new Map()
  public reqPropMap: Map<string, FlatReqProp> = new Map()
  public ignoredFoldersSet: Set<string> = new Set()
  private _nextID:number = 0
  private constructor() {
  }
  public static getInstance(): SettingsUtil {
    if (!SettingsUtil.instance) {
      SettingsUtil.instance = new SettingsUtil();
    }
    return SettingsUtil.instance;
  }
  
  public load(data: Partial<NCPData>) {
    const { classes, rules, reqProps, ...base } = data
    this.base = {...this.base, ...base}
    this._nextID = this.base.nextID
    this.ignoredFoldersSet = new Set(base.ignoredFolders)
    this.flatClsMap = new Map<string, FlatCls>(Object.entries(classes??{}))
    this.reqPropMap = new Map<string, FlatReqProp>(Object.entries(reqProps??{}))
    this.ruleMap = new Map<string, FlatRule>(Object.entries(rules??{}))
    for (const [id, flatcls] of this.flatClsMap) {
      this.clsMap.set(id, new Classification(flatcls))
    }
    for (const [id, cls] of this.clsMap) {
      this.nodeMap.set(id, new NodeClass(cls))
    }
    for (const [, node] of this.nodeMap) {
      if (!node.cls.parentID) {
        this.nodeTree.push(node)
      } else {
        const parentNode = this.nodeMap.get(node.cls.parentID)
        if (parentNode) {
          parentNode.children.push(node)
        } else {
          this.nodeTree.push(node)
        }
      }
    }
  }
  public get data(): NCPData{
    return {
      ...this.base,
      ignoredFolders: [...this.ignoredFoldersSet],
      rules: Object.fromEntries(this.ruleMap),
      classes: Object.fromEntries(this.flatClsMap),
      reqProps:Object.fromEntries(this.reqPropMap)
    }
  }
  public deleteCls(id: string) {
    const node = this.nodeMap.get(id)
    if (node && node.children) {
      for (const child of node.children) {
        this.deleteCls(child.id)
      }
    }
    this.flatClsMap.delete(id)
    this.clsMap.delete(id)
    this.nodeMap.delete(id)
    this.nodeTree = this.nodeTree.filter((n)=>n.id != id)
  }
  public newCls(parentID?: string): {cls:TCls, node:NodeClass}{
    const parIdCheck = parentID ? { parentID: parentID } : {}
    const id = this.nextID
    const baseCls: FlatCls = {
      id: id,
      ...parIdCheck,
      name: "New Classification",
      rules: [],
      destination: "",
      requriedProperties:[]
    }
    this.flatClsMap.set(id, baseCls)
    const cls = new Classification(baseCls)
    this.clsMap.set(id, cls)
    const node = new NodeClass(cls)
    this.nodeMap.set(id, node)
    if (parentID) {
      const parentNode = this.nodeMap.get(parentID)
      if (parentNode) {
        parentNode.children.push(node)
      } else {
        this.nodeTree.push(node)
      }
    } else {
      this.nodeTree.push(node)
    }
    return {cls, node}
  }
  

  public get nextID(): string{
    const res = this._nextID.toString()
    this._nextID++
    this.base.nextID = this._nextID
    return res
  }

}

export const setUtil = SettingsUtil.getInstance();