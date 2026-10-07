import { midFile, TClsFile } from "../classification/ClassifiedFile";
import { FlatPropertyClass, PropertyClass } from "./propertyClasses";
import { FlatTagClass, TagClass } from "./tagClasses";

export interface TClass {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  readonly type: string;
  getPath: (file: TClsFile) => string,
  match: (file: midFile) => boolean,
}

export interface baseClass {
  id: string,
  name: string,
  parentID?: string,
  folder: string,
  requriedProperties: Array<string>,
}
export abstract class BaseClassRule<T extends FlatClass> implements TClass{
  readonly id: string;
  readonly parentID?: string| null;
  readonly name: string;
  readonly type: string;
  private folder: string
  requriedProperties: string[];
  constructor(data: T) {
    this.id = data.id
    this.parentID = data.parentID
    this.name = data.name
    this.type = data.type
    this.requriedProperties = data.requriedProperties
    this.folder = data.folder;
  }
  abstract match(file: midFile): boolean;

  //TODO Flesh out the get path method
  getPath(file: TClsFile): string{
    return `${file.startPath}/${this.folder}`
  };
}

export class NodeClass {
  children: NodeClass[] = [];
  public rule: TClass;
  constructor(rule: TClass) {
    this.rule = rule
  }
  search(file:midFile): TClass | false{
    if (!this.rule.match(file)) {
      return false
    }
    if (this.children.length == 0) {
      return this.rule
    }
    for (const child of this.children) {
      const deeperMatch = child.search(file)
      if (deeperMatch) {
        return deeperMatch
      }
    }
    return this.rule 
  }
}
export function ClassificationFactory(rule:FlatClass):TClass {
  switch (rule.type) {
    case 'property':
      return new PropertyClass(rule)
    case 'tag':
      return new TagClass(rule)
  }
}

export type FlatClass = FlatPropertyClass| FlatTagClass

