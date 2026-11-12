import { Modal, Setting } from "obsidian";
import { FlatReqProp } from "../../types/rules.types";
import NoteClassifier from "../../main";

export class reqPropModal extends Modal{
  reqProp: FlatReqProp
  id:string
  type: "exists" | "opt"
  propName: string
  propValueOptions?: string
  constructor(ncp: NoteClassifier, reqProp: FlatReqProp, update: (reqProp: FlatReqProp) => void) {
    super(ncp.app)
    this.reqProp = { ...reqProp }
    this.id = reqProp.id
    this.type = reqProp.type
    this.propName = reqProp.propertyName
    if (reqProp.type == "opt") {
      this.propValueOptions = reqProp.propVauleOptions.join(', ')
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
    typeSetting.setName("Type")
    typeSetting.addDropdown((dropdown) => {
      dropdown.addOptions({ exists: "Has Property", opt: "Property is one of these values" })
      dropdown.setValue(this.type)
      dropdown.onChange((value) => {
        switch (value) {
          case "exists":
            this.type = "exists"
            break
          case "opt":
            this.type = "opt"
            break
          default:
            break
        }
        this.display()
      })
    })
    const propNameSetting = new Setting(this.contentEl)
    propNameSetting.setName("Property")
    propNameSetting.addText((text) => {
      text.setValue(this.propName ?? "Property")
      text.onChange((value) => this.propName = value)
    })
    if (this.type == 'opt') {
      const propValueOptions = new Setting(this.contentEl)
      propValueOptions.setName('Allowed values')
      propValueOptions.setDesc('Comma seperated, case sensitive list of possible values')
      propValueOptions.addTextArea((text) => {
        text.setValue(this.propValueOptions ?? '')
        text.onChange((value)=>this.propValueOptions = value)
      })
    }
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
      case "opt":
        this.reqProp = {
          id: this.id,
          type: 'opt',
          propertyName: this.propName,
          propVauleOptions:this.propValueOptions?.split(', ')??['']
        }
        return 
    }
  }
}