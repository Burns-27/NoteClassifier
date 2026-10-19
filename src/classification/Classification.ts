
import { FlatCls, TCls } from "../types/classifications.types";
import { TRule } from "../types/rules.types";
import { RuleFactory } from "../Rules/RuleFactory";
import { midFile, TClsFile } from "../types/files.types";

export class Classification implements TCls{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  private rules: TRule[];
  private destination: string
  requriedProperties: string[];
  constructor(data: FlatCls) {
    this.id = data.id
    this.parentID = data.parentID
    this.name = data.name
    this.requriedProperties = data.requriedProperties
    this.destination = data.destination;
    this.rules = RuleFactory(data.rules)
  }
  match(file: midFile): boolean{
    for (const rule of this.rules) {
      const check = rule.match(file)
      if(!check) return false
    }
    return true
  }

  //TODO Flesh out the get path method
  getPath(file: TClsFile): string{
    return `${file.startPath}/${this.destination}`
  };
  getRuleDesc(): string {
    let desc:string[] = []
    this.rules.forEach((rule) => { desc.push(rule.desc) })
    return desc.join("/n - ")
  }
}

export class NodeClass {
  children: NodeClass[] = [];
  public classification: TCls;
  constructor(classification: TCls) {
    this.classification = classification
  }
  search(file:midFile): TCls | false{
    if (!this.classification.match(file)) {
      return false
    }
    if (this.children.length == 0) {
      return this.classification
    }
    for (const child of this.children) {
      const deeperMatch = child.search(file)
      if (deeperMatch) {
        return deeperMatch
      }
    }
    return this.classification
  }
}



