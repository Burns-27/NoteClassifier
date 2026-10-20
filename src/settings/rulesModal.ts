import { Modal, Notice, Setting } from "obsidian";
import NoteClassifier from "../main";
import { FlatRule } from "../types/rules.types";

export class RuleModal extends Modal{
  rule: FlatRule
  type: "property" | "tag"
  matchType: "exact" | "include"
  propertyName?: string 
  propertyValue?: string 
  tag?:string
  id: string
  constructor(ncp: NoteClassifier, rule: FlatRule, update: (rule: FlatRule) => void) {
    super(ncp.app)
    this.rule = { ...rule }
    this.id = rule.id
    this.type = `${rule.type}`
    this.matchType = `${rule.matchType}`
    if (rule.type == "property") {
      this.propertyName = `${rule.propertyName}`
      this.propertyValue = `${rule.propertyValue}`
    }
    if (rule.type == "tag") {
      this.tag = `${rule.tag}`
    }
    this.setCloseCallback(() => {
      console.debug("CloseCallback Called - Rules")
      const check = this.generateRule()
      if (!check) {
        new Notice("Error, rule not saved. ")
        return
      }
      update(this.rule)
    })
    this.display()
  }
  generateRule():boolean {
    if (this.type == "property") {
      if (!this.propertyName || !this.propertyValue || !(this.matchType=="exact")) {
        return false
      }
      this.rule = {
        id: this.id,
        type: this.type,
        matchType: this.matchType,
        propertyName: this.propertyName, 
        propertyValue: this.propertyValue
      }
      return true
    }
    if (this.type == "tag") {
      if (!this.tag) {
        return false
      }
      this.rule = {
        id: this.id,
        type: this.type,
        matchType: this.matchType,
        tag: this.tag
      }
      return true
    }
    return false
  }
  display() {
    console.debug("Rules Modal Refreshed")
    this.contentEl.empty()
    const typesetting = new Setting(this.contentEl)
    typesetting.setName("Rule type")
    typesetting.addDropdown((dropdown) => {
      dropdown.addOption("property", "Property").addOption("tag", "Tag")
      dropdown.setValue(this.type)
      dropdown.onChange((value) => {
        console.debug(`Rule type changed to ${this.type}`)
        switch (value) {
          case "property":
            this.type = "property"
            break
          case "tag":
            this.type = "tag"
            break
          default:
            break
        }
        this.display()
      })
    
    })
    switch (this.type) {
      case "property":
        this.propertyRule()
        break
      case "tag":
        this.tagRule()
        break
    }
  }
  propertyRule() {
    const propertyNameSetting = new Setting(this.contentEl)
    this.matchType = "exact"
    propertyNameSetting.setName("Property")
    propertyNameSetting.addText((text) => {
      text.setValue(this.propertyName ?? "Property")
      text.onChange((value)=>this.propertyName = value)
    })
    const propertyValueSetting = new Setting(this.contentEl)
    propertyValueSetting.setName("Value")
    propertyValueSetting.addText((text) => {
      text.setValue(this.propertyValue ?? "Value")
      text.onChange((value)=>this.propertyValue = value)
    })
  }
  tagRule() {
    const matchTypeSetting = new Setting(this.contentEl)
    matchTypeSetting.setName("Matching strictness")
    matchTypeSetting.addDropdown((drop) => {
      drop.addOption("exact", "Matches exactly").addOption("include", "Inclusive match")
      drop.onChange((value) => {
        if (value == "exact") {
          this.matchType = "exact"
        }
        if (value == "include") {
          this.matchType = 'include'
        }
      })
    })
    const tagSetting = new Setting(this.contentEl)
    tagSetting.setName("Tag")
    tagSetting.addText((text) => {
      text.setValue(this.tag ?? "Tag")
      text.onChange((value)=>this.tag = value)
    })
  }
}