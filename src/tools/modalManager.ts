import { NodeClass } from "../classification/Classification";
import type NoteClassifier from "../main";
import { CreateReqProp } from "../ReqProps/factory";
import { CreateRule } from "../Rules/Factory";
import { ClsModal } from "../settings/Modals/ClsModal";
import { reqPropModal } from "../settings/Modals/reqPropsModal";
import { RuleModal } from "../settings/Modals/rulesModal";
import { FlatReqProp, FlatRule, TCls } from "../types";


export class ModalManager {
  private static instance: ModalManager;
  private ncp!: NoteClassifier
  private constructor() { }
  

  public static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }
  public init(ncp: NoteClassifier) {
    this.ncp = ncp
  }
  public RulesModal(cls: TCls, rule: FlatRule, display:()=>void){
    new RuleModal(this.ncp, rule, (newRule: FlatRule) => {
      cls.rules.set(rule.id, CreateRule(newRule, cls.name))
      display()
    }).open()
  }
  public ReqPropModal(cls: TCls, reqProp: FlatReqProp, display:()=>void) {
    new reqPropModal(this.ncp, reqProp, (res: FlatReqProp) => {
      cls.reqProps.set(reqProp.id, CreateReqProp(res, cls.name))
      display()
    }).open()
  }
  public ClsModal(cls: NodeClass, display:()=>void) {
    new ClsModal(this.ncp, cls, () => {
      
      void this.ncp.saveSettings()
      display()
    }).open()
  }
  
}

export const modalManager = ModalManager.getInstance();