import type NoteClassifier from "../main";
import { ClsModal } from "../settings/Modals/ClsModal";
import { reqPropModal } from "../settings/Modals/reqPropsModal";
import { RuleModal } from "../settings/Modals/rulesModal";
import { settingUtil } from "../settings/settingsUtil";
import { FlatCls, TCls } from "../types/classifications.types";
import { FlatReqProp, FlatRule } from "../types/rules.types";

export class ModalManager {
  private static instance: ModalManager;
  private ncp!: NoteClassifier
  private update!: ()=>void
  private constructor() { }
  

  public static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }
  public init(ncp: NoteClassifier, update:()=>void) {
    this.ncp = ncp
    this.update = update
  }
  public RulesModal(cls: TCls, rule: FlatRule){
    new RuleModal(this.ncp, rule, (newRule: FlatRule) => {
      cls.flat.rules.push(rule.id)
      cls.flat.rules = [...new Set(cls.flat.rules)]
      settingUtil.get().rules.set(rule.id, newRule)
      this.updateCls(cls.flat)
    }).open()
  }
  public ReqPropModal(cls: TCls, reqProp: FlatReqProp) {
    new reqPropModal(this.ncp, reqProp, (res: FlatReqProp) => {
      cls.flat.requriedProperties.push(reqProp.id)
      cls.flat.requriedProperties = [...new Set(cls.flat.requriedProperties)]
      settingUtil.get().reqProps.set(reqProp.id, res)
      this.updateCls(cls.flat)
    }).open()
  }
  public ClsModal(cls: TCls) {
    new ClsModal(this.ncp, cls, (res: FlatCls) => {
      this.updateCls(res)
    }).open()
  }
  private updateCls(cls: FlatCls) {
    settingUtil.updateCls(cls)
    void this.ncp.saveSettings()
    this.update()
  }
}

export const modalManager = ModalManager.getInstance();