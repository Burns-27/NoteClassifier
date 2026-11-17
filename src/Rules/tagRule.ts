
import { Logs } from "../tools"
import type { midFile } from "../types/files.types"
import type { FlatExactTagRule, FlatIncludeTagRule } from "../types/rules.types"
import { Rule } from "./Rules"

export class ExactTagRule extends Rule {
  tag: string
  flat:FlatExactTagRule
  constructor(data: FlatExactTagRule, clsName: string) {
    super(data, clsName)
    this.tag = data.tag
    this.flat = data
  }
  match(file: midFile, log:Logs): boolean{
   if (!file.tags || file.tags.length == 0) {
     log.add(`Checking ${this.desc}`,'No Tags')
      return false
     }
    const check = file.tags.find((t) => t.replace("#",'') == this.tag) 
    if (!check) {
      log.add(`Checking ${this.desc}`, check)
      return false
    }
    log.add(`Checking ${this.desc}`, check)
    return true
  }
  get desc(): string{
    return ` has #${this.tag}`
  }
}

export class IncludeTagRule extends Rule  {
  tag: string
  flat:FlatIncludeTagRule
  constructor(data: FlatIncludeTagRule, clsName: string) {
    super(data, clsName)
    this.tag = data.tag
    this.flat = data
  }
  match(file: midFile, log:Logs): boolean{
    if (!file.tags || file.tags.length == 0) {
      log.add(`Checking ${this.desc}`, 'no tags')
      return false
    }
    let splitTags: string[] = []
    for (const tag of file.tags) {
      splitTags.push(...tag.split('/'))
    }
    splitTags = splitTags.map((tag) => tag.replace('#', ""))
    log.add('File Split tags', splitTags)
    const check = splitTags.find((t) => t == this.tag)
    log.add(`Checking ${this.desc}`, check)
    if (!check) {
      return false
    }
    return true
  }

  get desc(): string {
    return `includes '#${this.tag}'`
  }
}