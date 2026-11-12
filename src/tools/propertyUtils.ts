import { FrontMatterCache } from "obsidian";

export function getPropertyStringValue(prop: string,fm:FrontMatterCache ={} ,): string | false{
  if (fm[prop] && typeof fm[prop] == 'string') {
    return fm[prop]
  } else {
    return false
  }
}

export function getPropertyBooleanValue(prop: string, fm: FrontMatterCache = {}): boolean{
  if (fm[prop] !== undefined && typeof fm[prop] == 'boolean') {
    return fm[prop]
  } else {
    return false
  }
}