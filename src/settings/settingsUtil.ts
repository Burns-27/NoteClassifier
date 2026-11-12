import { Classification, NodeClass } from "../classification/Classification";
import { debugLogArgs, devlog } from "../tools/logger";
import { FlatCls, TCls } from "../types/classifications.types";
import type { midFile } from "../types/files.types";
import type {  ClsRes,  flatPropRes,  flatRuleRes,  UpdateClsRes } from "../types/responses.types";
import { FlatReqProp, FlatRule } from "../types/rules.types";
import { DEFAULT_BASE_SETTINGS,type  BaseNCPSettings, NCPData, NCPSettings, SettingUtil } from "../types/settings.types";

let settings: NCPSettings = {...DEFAULT_BASE_SETTINGS, rules: new Map<string, FlatRule>(), classes: new Map<string, FlatCls>(), reqProps: new Map<string, FlatReqProp>()}
let baseSettings:BaseNCPSettings = {...DEFAULT_BASE_SETTINGS}
let rulesMap: Map<string, FlatRule> = new Map()
let reqPropsMap : Map<string, FlatReqProp> = new Map()
let nodeMap:Map<string, NodeClass>= new Map()
let clsMap: Map<string, TCls> = new Map()
let nodeTree: Array<NodeClass> = []
const getSettings = (): NCPSettings => {
  return settings
}
const getRootNodes = (): Array<NodeClass> => {
  buildClsMap()
  buildNodeTree()
  return nodeTree
}
function buildClsMap(){
  settings.classes.forEach((cls, key) => {
    clsMap.set(key, new Classification(cls));
    return
  })
}
function getRule(id: string): flatRuleRes {
  const rule = rulesMap.get(id)
  if (rule) {
    return {
      success: true,
      rule
    }
  }
  return { success: false }
}
function getReqProp(id: string):flatPropRes{
  const reqProp = reqPropsMap.get(id)
  if (reqProp) {
    return {
      success: true,
      prop:reqProp
    }
  }
  return {success:false}
}
function buildNodeTree() {
  nodeTree = []
  nodeMap.clear()
  clsMap.forEach((cls, key)=> nodeMap.set(key, new NodeClass(cls)) )
  nodeMap.forEach((node, key) => {
    if (!node.classification.parentID) {
      nodeTree.push(node)
      return
    } 
    const parentNode = nodeMap.get(node.classification.parentID)
    if (!parentNode) {
        console.error("Parent Node Not found")
        return
    }
      parentNode.children.push(node)
  })
}
function getCls(id: string): ClsRes{
  const cls = clsMap.get(id)
  if (!cls) {
    return {
      success: false,
      message:"Failed to retrieve Classification"
    }
  }
  return {
    success: true,
    cls: cls
  }
}
const matchCls = (file: midFile): ClsRes => {
  let log: debugLogArgs = devlog.start('Classify', 'matchCls')
  log.info.file = file
  let cls : TCls|undefined
  const clsres = nodeTree.find((node) => {
    const res = node.search(file)
    log.msg = 'Single Match Res'
    log.info.res = res
    devlog.loc(log)
    if (res.success) {
      cls = res.cls
    }
    return res.success
  })
  log.msg = 'After Find'
  log.info.cls = cls
  log.extra = {clsres, nodeMap}
  devlog.log(log)
  if (!cls) {
    return {
      success: false,
      message: "No matching Classification",
      context: {
        file:file
      }
    }
  }
  return {
    success: true,
    cls : cls
  }
}

function updateMainSettings(newSettings: Partial<BaseNCPSettings>) {
  let log: debugLogArgs = devlog.start('Settings', 'update Base')
  log.info.new = newSettings
  log.info.old = { ...baseSettings }
  settings = { ...settings, ...newSettings }
  baseSettings = { ...baseSettings, ...newSettings }
  log.extra = {settings, baseSettings}
  devlog.loc(log)
}
function objToMap<T>(obj: Record<string, T> | undefined): Map<string, T>{
  if (obj) {
    const map = new Map<string, T>(Object.entries(obj))
    return map
  } else {
    return new Map<string, T>()
  }
}
function updateAllSettings(newSettings: Partial<NCPData>) {
  let log: debugLogArgs = devlog.start('Settings', 'Update All')
  log.extra.startData = newSettings
  rulesMap = objToMap<FlatRule>(newSettings?.rules??{})
  const classes = objToMap<FlatCls>(newSettings?.classes??{})
  reqPropsMap = objToMap<FlatReqProp>(newSettings?.reqProps??{})
  log.extra.settingMaps = {
    rulesMap, classes, reqPropsMap
  }
  settings = { ...settings, ...newSettings, rules:rulesMap, classes:classes, reqProps:reqPropsMap }
  buildClsMap()
  buildNodeTree()
  log.extra.mapsAndTree = {
    clsMap, nodeMap, nodeTree
  }
  log.info.settings = settings
  devlog.log(log)
}
function updateCls(newCls: FlatCls): UpdateClsRes {
  let log: debugLogArgs = devlog.start('Settings', 'Update Cls')
  log.info.updated = newCls
  settings.classes.set(newCls.id, newCls)
  const cls = new Classification(newCls)
  clsMap.set(newCls.id, cls)
  log.extra.clsobj = cls
  buildNodeTree()
  log.extra.mapsAndTree = {clsMap, nodeMap, nodeTree}
  devlog.log(log)
  return {success: true, cls:cls}
}
function newCls(parentID?: string): UpdateClsRes{
  let log: debugLogArgs = devlog.start('Settings', 'New Cls')
  log.info.parentID = parentID??"No Parent"
  const parIdCheck = parentID ? { parentID: parentID } : {}
  const id = `${nextID()}`
  const basicCls: FlatCls = {
    id: id,
    ...parIdCheck,
    name: "New Classification",
    rules: [],
    destination: "Set Destination",
    requriedProperties:[]
  } 
  log.extra.newFlat = basicCls
  settings.classes.set(id, basicCls)
  const cls = new Classification(basicCls)
  clsMap.set(basicCls.id, cls)
  
  buildNodeTree()
  log.extra.mapsAndTree = {
    flatClasses: settings.classes,
    clsMap,
    nodeMap,
    nodeTree
  }
  devlog.log(log)
  return {success:true, cls:cls}
}
function nextID(): string{
  const next = settings.nextID.toString()
  settings.nextID++
  return `${next}`
}
export const settingUtil:SettingUtil = {
  get: getSettings,
  base: baseSettings, 
  getCls: getCls,
  updateMain: updateMainSettings,
  updateAll: updateAllSettings,
  matchCls: matchCls,
  updateCls: updateCls, 
  newCls: newCls,
  nextID:nextID,
  rootNodes: getRootNodes, 
  getFlatRule: getRule,
  getFlatReqProp:getReqProp
}

