import { midFile } from "../classification/ClassifiedFile";
import { baseClass, BaseClassRule } from "./Classification"

export interface propertyRule  {
  propertyName: string,
  propertyValue: string
}
export interface FlatPropertyClass extends baseClass {
  type: 'property',
  rule: Array<propertyRule>
}

export class PropertyClass extends BaseClassRule<FlatPropertyClass>{
  private properties: Array<propertyRule>;
  constructor(data: FlatPropertyClass) {
    super(data)
    this.properties= data.rule
  }
  match(file: midFile): boolean{
    //TODO (Property Rule) build out match logic
    return false 
  }
}