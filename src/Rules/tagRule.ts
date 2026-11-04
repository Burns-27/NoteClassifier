

import type { midFile } from "../types/files.types"
import type { FailRes, RuleMatchRes } from "../types/responses.types"
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
  match(file: midFile): RuleMatchRes{
   if (!file.tags || file.tags.length == 0) {
      const res: FailRes = {
        success: false,
        message:"File Has no tags"
      }
      return res
      }
    const check = file.tags.find((t) => t.replace("#",'') == this.tag) 
    if (!check) {
      const res:FailRes = { success: false, message: "File doesnt have matching tag", context: { fileTags: file.tags, expectedTag: this.tag } }
      return res
    }
    return {
      success: true,
    }
  }
  getDesc(): string{
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
  match(file: midFile): RuleMatchRes{
    if (!file.tags || file.tags.length == 0) {
      const res: FailRes = {
        success: false,
        message:"File has No Tags"
      }
      return res
    }
    let splitTags: string[] = []
    for (const tag of file.tags) {
      splitTags.push(...tag.split('/'))
    }
    splitTags = splitTags.map((tag)=> tag.replace('#',""))
    const check = splitTags.find((t) => t == this.tag)
    if (!check) {
      const res: FailRes = {
        success: false,
        message: "No matching tags",
        context: {
          fileTags: file.tags,
          splitTags: splitTags,
          goalTag:this.tag,
        }
      }
      return res
    }
    return {
      success: true,
    }
  }
  getDesc() {
    return `includes '#${this.tag}'`
  }
}