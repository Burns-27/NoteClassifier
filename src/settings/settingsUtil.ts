import { Classification, NodeClass } from "../classification/Classification";
import { devlog, logger } from "../logger";
import { FlatCls, TCls } from "../types/classifications.types";
import type { midFile } from "../types/files.types";
import type {  ClsRes,  flatRuleRes,  UpdateClsRes } from "../types/responses.types";
import { FlatRule } from "../types/rules.types";
import { DEFAULT_SETTINGS, NoteClassifierSettings, SettingUtil } from "../types/settings.types";

let settings: NoteClassifierSettings = { ...DEFAULT_SETTINGS }
let nodeMap:Map<string, NodeClass>= new Map()
let clsMap: Map<string, TCls> = new Map()
let nodeTree: Array<NodeClass> = []
const getSettings = (): NoteClassifierSettings => {
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
function getRule(id: string):flatRuleRes{
  const rule = settings.rules.get(id)
  if (rule) {
    return {
      success: true,
      rule
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
const matchCls = (file: midFile): ClsRes=> {
  let cls : TCls|undefined
  const clsres = nodeTree.find((node) => {
    const res = node.search(file)
    devlog.loc('Match- settings function', 'single match res', res)
    if (res.success) {
      cls = res.cls
    }
    return res.success
  })
  devlog.loc('Match - settings function',"After Find", {cls, clsres, nodeTree, file})
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

function updateMainSettings(newSettings:Partial<NoteClassifierSettings>) {
  settings = { ...settings, ...newSettings  }
  logger.debug("Updated Main Settings", )
}
function updateAllSettings(newSettings: Partial<NoteClassifierSettings>) {
  devlog.loc('Update all Settings', "Entry Value", { newSettings })
  const rules = newSettings.rules instanceof Map ? newSettings.rules : new Map<string, FlatRule>(Object.entries(newSettings.rules ?? {}))
  const classes = newSettings.classes instanceof Map? newSettings.classes:new Map<string,FlatCls>(Object.entries(newSettings.classes??{}))
  settings = { ...settings, ...newSettings, rules, classes }
  buildClsMap()
  buildNodeTree()
}
function updateCls(newCls: FlatCls):UpdateClsRes {
  settings.classes.set(newCls.id, newCls)
  const cls = new Classification(newCls)
  clsMap.set(newCls.id, cls)
  buildNodeTree()
  devlog.loc('UpdateCls',"Post save", {settings, flatCls:newCls, cls})
  return {success: true, cls:cls}
}
function newCls(parentID?: string): UpdateClsRes{
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
  
  settings.classes.set(id, basicCls)
  const cls = new Classification(basicCls)
  clsMap.set(basicCls.id, cls)
  buildNodeTree()
  return {success:true, cls:cls}
}
function nextID(): string{
  const next = settings.nextID.toString()
  settings.nextID++
  return `${next}`
}
export const settingUtil:SettingUtil = {
  get: getSettings,
  getCls: getCls,
  updateMain: updateMainSettings,
  updateAll: updateAllSettings,
  matchCls: matchCls,
  updateCls: updateCls, 
  newCls: newCls,
  nextID:nextID,
  rootNodes: getRootNodes, 
  getFlatRule:getRule
}

