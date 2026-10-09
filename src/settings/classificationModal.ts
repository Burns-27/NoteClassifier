import { App, Modal } from "obsidian";
import { FlatClass, NodeClass } from "../Rules/Classification";
import NoteClassifier from "../main";

export class ClassificationModal extends Modal {
  private rule:FlatClass
  constructor(app: App, ncp:NoteClassifier, cls:NodeClass, parentid?:number) {
    super(app);
    const flatClass: FlatClass|undefined = ncp.settings.rules.find((rule) => rule.id == cls.rule.id) 
    if (!flatClass) {
      const newClass: FlatClass={
        id: ncp.nextID().toString(),
        name: "New",
        requriedProperties: [],
        type: 'property',
        rule: [],
        folder: '',
      }
      if (!parentid) {
        this.rule = newClass
      } else {
        this.rule = {...newClass, parentID:parentid.toString()}
      }
    } else {
      this.rule = flatClass
    }
    this.setTitle(this.rule.name)
    
  }
}