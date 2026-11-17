import { Modal, Setting } from "obsidian";
import type NoteClassifier from "../main";
import { FlatReqProp } from "../types";
import { settings } from "../settings/settings";

export class reqPropModal extends Modal{
  reqProp: FlatReqProp
  id:string
  type: "exists" | "opt"
  propName: string
  propValueOptions?: string
  defaultValue?: string
  defaultOption?: string
  constructor(ncp: NoteClassifier, reqProp: FlatReqProp, update: (reqProp: FlatReqProp) => void) {
    super(ncp.app)
    this.reqProp = { ...reqProp }
    this.id = reqProp.id
    this.type = reqProp.type
    this.propName = reqProp.propertyName
    if (reqProp.type == "opt") {
      this.propValueOptions = reqProp.propVauleOptions.join(', ')
      this.defaultOption = reqProp.defaultOption
    } else {
      this.defaultValue = reqProp.defaultValue
    }
    this.setCloseCallback(() => {
      this.generateReqProp()
      settings.reqPropMap.set(this.id, this.reqProp)
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
    switch (this.type) {
      case "exists":
        this.exists()
        break
      case "opt":
        this.opt()
        break
    }
  }
  opt() {
    const propValueOptions = new Setting(this.contentEl)
      propValueOptions.setName('Allowed values')
      propValueOptions.setDesc('Comma seperated, case sensitive list of possible values')
      propValueOptions.addTextArea((text) => {
        text.setValue(this.propValueOptions ?? '')
        text.onChange((value)=>this.propValueOptions = value)
      })
    const defaultOption = new Setting(this.contentEl)
      defaultOption.setName('Default value')
    defaultOption.setDesc('The default value to use if the property is missing')
    defaultOption.addDropdown((dropdown) => {
      const optionsArray = this.propValueOptions?.split(',')??[]
      const options:Record<string,string> = {}
      for (const opt of optionsArray) {
        options[opt] = opt
      }
      dropdown.addOptions(options)
      dropdown.onChange((value)=>this.defaultOption = value)
    })
  }
  exists() { 
  const defaultValue = new Setting(this.contentEl)
  defaultValue.setName('Default value')
  defaultValue.setDesc('Value to use if property is missing')
  defaultValue.addText((text) => {
    text.setValue(this.defaultValue ?? "")
    text.onChange((value) => {
      this.defaultValue = value
    })
  })
  }
  generateReqProp(){
    switch (this.type) {
      case "exists":
        this.reqProp =  {
          id: this.id,
          type: 'exists',
          propertyName: this.propName,
          defaultValue: this.defaultValue ?? ''
        }
        return 
      case "opt":
        this.reqProp = {
          id: this.id,
          type: 'opt',
          propertyName: this.propName,
          propVauleOptions: this.propValueOptions?.split(', ') ?? [''],
          defaultOption: this.defaultOption ?? ''
        }
        return 
    }
  }
}