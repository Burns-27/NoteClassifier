import { ClassificationFactory, NodeClass, TClass } from "../Rules/Classification";
import { NoteClassifierSettings } from "./settings";

export function Hydrate(settings: NoteClassifierSettings): { flatMap: Array<TClass>, rootNodes: Array<NodeClass> }{
  const flatDataArray = settings.rules
  const nodeMap = new Map<string, NodeClass>();
  let rootNodes: Array<NodeClass>=[]
  const flatClassArray = flatDataArray.map((rule) => ClassificationFactory(rule))
  for (const rule of flatClassArray) {
    nodeMap.set(rule.id, new NodeClass(rule))
  }
  for (const rule of flatClassArray) {
    const currentNode = nodeMap.get(rule.id);
    if (!currentNode) throw Error("Tried to find non-existant Id in node map")
    if (!currentNode.rule.parentID) {
      rootNodes.push(currentNode)
    } else if (nodeMap.has(currentNode.rule.parentID)) {
      const parentNode = nodeMap.get(currentNode.rule.parentID)
      if (!parentNode) throw Error("Tried to find non-existant parent node")
      parentNode.children.push(currentNode)
    } else {
      rootNodes.push(currentNode)
    }
  }

  return {flatMap: flatClassArray, rootNodes: rootNodes}
}
