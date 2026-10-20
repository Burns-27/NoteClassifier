import {  Modal, Setting, SettingGroup } from "obsidian";
import NoteClassifier from "../main";
import { settingUtil } from "./settingsUtil";
import { FlatCls, TCls } from "../types/classifications.types";
import { FlatRule, TRule } from "../types/rules.types";
import { RuleModal } from "./rulesModal";

export class ClsModal extends Modal{
  flatCls!: FlatCls 
  cls!:TCls
  ncp:NoteClassifier
  update: (cls:FlatCls)=>void
  constructor(ncp: NoteClassifier, flatCls:FlatCls, cls:TCls,  updateCls:(cls:FlatCls)=>void ) {
    super(ncp.app)
    this.ncp = ncp
    this.update = updateCls
    this.flatCls = {...flatCls}
    this.cls = cls
    this.setTitle(this.flatCls.name)
    this.display()
    this.setCloseCallback(() => {
      updateCls(this.flatCls)
    })
  }
  display() {
    const nameSetting = new Setting(this.contentEl)
    nameSetting.setName("Classification name")
    nameSetting.addText((text) => {
      text.setValue(this.flatCls.name)
      text.onChange((value)=>this.flatCls.name = value)
    })
    const destinationSetting = new Setting(this.contentEl)
    destinationSetting.setName("Destination")
    destinationSetting.addText((text) => {
      text.setValue(this.flatCls.destination)
      text.onChange((value) => {
        this.flatCls.destination = value
      })
    })
    this.propertySection()
    this.rulesSection()
  }
  propertySection() {
    const propSetGroup = new SettingGroup(this.contentEl)
    propSetGroup.setHeading("Required Properties")
    propSetGroup.addExtraButton((button) => {
      button.setIcon("Plus")
      button.onClick(() => {
        this.flatCls.requriedProperties.push("new")
        this.display()
      })
    })
    this.flatCls.requriedProperties.forEach((prop, index) => {
      
      propSetGroup.addSetting((setting) => {
        setting.addText((text) => {
          text.setValue(prop)
          text.onChange((value) => {
            this.flatCls.requriedProperties[index] = value
          })
        })
        setting.addExtraButton((button) => {
          button.setIcon("x")
          button.onClick(() => {
            this.flatCls.requriedProperties.splice(index, 1)
            this.display()
          })
        })
      })
    })
  }
  rulesSection() {
    const rulesSettingGroup = new SettingGroup(this.contentEl)
    rulesSettingGroup.setHeading("File Matching Rules")
    rulesSettingGroup.addExtraButton((button) => {
      button.setIcon("add")
      button.setTooltip("Add new rule")
      button.onClick(()=>this.newRulesModal())
    })
    this.cls.rules.forEach((rule) => {
      rulesSettingGroup.addSetting((setting) => { 
        setting.setName(rule.getDesc())
        setting.addButton((button) => {
          button.setButtonText("Edit")
          button.onClick(()=>this.openRulesModal(rule))
        })
        setting.addExtraButton((button) => {
          button.setIcon("trash")
          button.onClick(() => {
            this.flatCls.rules.filter((flat) => flat.id !== rule.id)
            settingUtil.updateCls(this.flatCls)
            this.display()
          })
        })
      })})
  }
  openRulesModal(rule: TRule) {
    let flatRule = this.flatCls.rules.find((ogRule) => ogRule.id === rule.id)
    if (!flatRule) {
      console.error("unable to find flat Rule")
      return
    }
    const copyRule = {...flatRule}
    new RuleModal(this.ncp, copyRule, (newRule: FlatRule) => {
      flatRule = newRule
      settingUtil.updateCls(this.flatCls)
      this.display()
    }).open()
  }
  newRulesModal() {
    let rule:FlatRule = {
      type: "tag",
      matchType: "exact",
      tag: "New",
      id: settingUtil.nextID(),
    }
    new RuleModal(this.ncp, rule, (newRule: FlatRule) => {
      this.flatCls.rules.push(newRule)
      settingUtil.updateCls(this.flatCls)
      this.display()
    })
  }
}