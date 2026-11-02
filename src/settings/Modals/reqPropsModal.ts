import { Modal, Setting } from "obsidian";
import { FlatReqProp } from "../../types/rules.types";
import NoteClassifier from "../../main";

export class reqPropModal extends Modal{
  reqProp: FlatReqProp
  id:string
  type: "exists" | "one of"
  propName: string
  propValueOptions?: string[]
  constructor(ncp: NoteClassifier, reqProp: FlatReqProp, update: (reqProp: FlatReqProp) => void) {
    super(ncp.app)
    this.reqProp = { ...reqProp }
    this.id = reqProp.id
    this.type = reqProp.type
    this.propName = reqProp.propertyName
    if (reqProp.type == "one of") {
      this.propValueOptions = reqProp.propVauleOptions
    }
    this.setCloseCallback(() => {
      this.generateReqProp()
      update(this.reqProp)
    })
    this.display()
  }
  display() {
    this.contentEl.empty()
    const typeSetting = new Setting(this.contentEl)
    
  }
  generateReqProp(){
    switch (this.type) {
      case "exists":
        this.reqProp =  {
          id: this.id,
          type: 'exists',
          propertyName: this.propName
        }
        return 
      case "one of":
        this.reqProp = {
          id: this.id,
          type: 'one of',
          propertyName: this.propName,
          propVauleOptions:this.propValueOptions??['']
        }
        return 
    }
  }
}