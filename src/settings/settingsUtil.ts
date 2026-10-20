import { Classification, NodeClass } from "../classification/Classification";
import { FlatCls, TCls } from "../types/classifications.types";
import { midFile } from "../types/files.types";
import { ActionResult } from "../types/responses.types";
import { DEFAULT_SETTINGS, NoteClassifierSettings } from "../types/settings.types";

let settings: NoteClassifierSettings = { ...DEFAULT_SETTINGS }
let nodeMap:Map<string, NodeClass>= new Map()
let clsMap: Map<string, TCls> = new Map()
let nodeTree: Array<NodeClass> = []

const getSettings = (): NoteClassifierSettings => {
  return settings
}
const getRootNodes = (): Array<NodeClass> => {
  buildNodeTree()
  return nodeTree
}
function buildClsMap(){
  const flatClsArray = settings.rules
  flatClsArray.forEach((cls) => {
    clsMap.set(cls.id, new Classification(cls))
  })
}

function buildNodeTree() {
  nodeTree = []
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
function getCls(id: string): ActionResult{
  const cls = clsMap.get(id)
  if (!cls) {
    return {
      success: false,
      message:"Failed to retrieve Classification"
    }
  }
  return {
    success: true,
    type: "Cls Get",
    cls: cls
  }
}
function matchCls(file: midFile): ActionResult{
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
    type: "cls match",
    cls : cls.classification
  }
}
function getFlatCls(id: string): ActionResult{
  const cls = settings.rules.find((flat) => flat.id === id)
  if (!cls) {
    return {
      success: false,
      message:"Failed to retrieve Flat Classification"
    }
  }
  return {
    success: true,
    type: "flat CLs Get",
    cls:cls
  }
}
function updateMainSettings(newSettings:Partial<NoteClassifierSettings>) {
  settings = {...settings, ...newSettings}
}
function updateAllSettings(newSettings: Partial<NoteClassifierSettings>) {
  settings = { ...settings, ...newSettings }
  buildClsMap()
  buildNodeTree()
}
function updateCls(newCls: FlatCls):{cls:TCls, flatCls: FlatCls} {
  settings.rules = settings.rules.filter((cls) => cls.id !== newCls.id)
  settings.rules.push(newCls)
  //console.debug(newCls, "New Flat Class")
  //console.debug("The full settings Item", settings)
  const cls = new Classification(newCls)
  clsMap.set(newCls.id, cls)
  buildNodeTree()
  return {cls:cls, flatCls:newCls}
}
function newCls(parentID?: string): { flatCls: FlatCls, cls: TCls }{
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
  
  settings.rules.push(basicCls)
  const cls = new Classification(basicCls)
  clsMap.set(basicCls.id, cls)
  buildNodeTree()
  return {flatCls:basicCls, cls:cls}
}
function nextID(): string{
  const next = settings.nextID.toString()
  settings.nextID++
  return `${next}`
}
export const settingUtil = {
  get: getSettings,
  getCls: getCls,
  getFlatCls: getFlatCls,
  updateMain: updateMainSettings,
  updateAll: updateAllSettings,
  matchCls: matchCls,
  updateCls: updateCls, 
  newCls: newCls,
  nextID:nextID,
  rootNodes: getRootNodes, 
}