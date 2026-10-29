import { Classification, NodeClass } from "../classification/Classification";
import { logger } from "../logger";
import { FlatCls, TCls } from "../types/classifications.types";
import type { midFile } from "../types/files.types";
import type {  ClsRes,  UpdateClsRes } from "../types/responses.types";
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
  const flatClsArray = settings.rules
  flatClsArray.forEach((cls, key) => {
    clsMap.set(key, new Classification(cls))
  })
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
function matchCls(file: midFile): ClsRes{
  const cls = nodeTree.find((node) => node.search(file))
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
    cls : cls.classification
  }
}

function updateMainSettings(newSettings:Partial<NoteClassifierSettings>) {
  settings = { ...settings, ...newSettings }
  logger.debug("Updated Main Settings", )
}
function updateAllSettings(newSettings: Partial<NoteClassifierSettings>) {
  settings = { ...settings, ...newSettings }
  buildClsMap()
  buildNodeTree()
}
function updateCls(newCls: FlatCls):UpdateClsRes {
  settings.rules.set(newCls.id, newCls)
  const cls = new Classification(newCls)
  clsMap.set(newCls.id, cls)
  buildNodeTree()
  return {success: true, cls:cls}
}
function newCls(parentID?: string): UpdateClsRes{
  const parIdCheck = parentID ? { parentID: parentID } : {}
  const id = `${nextID()}`
  const basicCls: FlatCls = {
    id: id,
    ...parIdCheck,
    name: "New Classification",
    rules: new Map<string, FlatRule>(),
    destination: "Set Destination",
    requriedProperties:[]
  } 
  
  settings.rules.set(id, basicCls)
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
}

