import {  Modal, Setting, SettingGroup } from 'obsidian';
import NoteClassifier from '../../main';
import { modalManager } from '../../tools/modalManager';
import { setUtil } from '../settings';
import { NodeClass } from '../../classification/Classification';
import { FlatCls, TCls } from '../../types';


export class ClsModal extends Modal {
	flatCls: FlatCls;
	cls: TCls;
	ncp: NoteClassifier;
	isRoot: boolean;
	childClasses:NodeClass[]
	update: () => void;
	constructor(
		ncp: NoteClassifier,
		node: NodeClass,
		update: () => void,
	) {
		super(ncp.app);
		this.ncp = ncp;
		this.update = update;
		this.flatCls = node.cls.flat;
		this.cls = node.cls;
		this.isRoot = node.isRoot
		this.childClasses = node.children
		this.display();
		this.setCloseCallback(() => {
			void ncp.saveSettings()
			update()
		})
	}
	display() {
		this.contentEl.empty();
		this.setTitle(this.flatCls.name);
		const maingroup = new SettingGroup(this.contentEl);
		const nameSetting = new Setting(maingroup.listEl);
		nameSetting.setName('Classification name');
		nameSetting.addText((text) => {
			text.setValue(this.flatCls.name);
			text.onChange((value) => {
				this.flatCls.name = value;
			});
		});
		const descriptionSetting = new Setting(maingroup.listEl)
		descriptionSetting.setName('Description')
		descriptionSetting.addTextArea(text => {
			text.setValue(this.flatCls.description ?? "")
			text.onChange(value => this.flatCls.description = value)
		})
		const destinationSetting = new Setting(maingroup.listEl);
		destinationSetting.setName('Destination');
		destinationSetting.addText((text) => {
			text.setValue(this.flatCls.destination);
			text.onChange((value) => {
				this.flatCls.destination = value;
			});
		});
		this.rules()
		if (!this.isRoot) {
			this.parentProperties()
		}
		this.reqProps()
	}
	rules() {
		const rulesGroup = new SettingGroup(this.contentEl)
		rulesGroup.setHeading('Match Rules')
		rulesGroup.addClass('mod-list')
		rulesGroup.addExtraButton((button) => {
			button.setIcon('plus')
			button.onClick(() => {
				const rule = this.cls.addRule()
				modalManager.RulesModal(this.cls, rule, ()=>this.display())
			})
		})
		if (this.cls.rules.size == 0) {
			rulesGroup.addSetting((setting) => {
				setting.setName('Add a matching rule so notes can match this classification')
			})
			return
		}
		for (const [key, rule] of this.cls.rules) {
			rulesGroup.addSetting((setting) => {
				//TODO (Setting Refactor) Revamp rules to use getter for description
				setting.setName(rule.getDesc())
				setting.addButton((button) => {
					button.setButtonText('Edit')
					button.onClick(() => {
						modalManager.RulesModal(this.cls, rule.flat, ()=>this.display())
					})
				})
				setting.addExtraButton((button) => {
					button.setIcon('x')
					button.onClick(() => {
						this.flatCls.rules = this.flatCls.rules.filter((r)=>r!== key)
						setUtil.ruleMap.delete(key)
						this.display()
					})
				})
			})
		}
	}
	parentProperties() {
		if(this.cls.parentReqProps.size == 0) return
		const parentPropsGroup = new SettingGroup(this.contentEl)
		parentPropsGroup.addClass('mod-list')
		parentPropsGroup.setHeading('Required Properties from Parent Classes')
		for (const [, prop] of this.cls.parentReqProps) {
			parentPropsGroup.addSetting((setting) => {
				setting.setName(prop.getDesc())
				setting.setDesc(`From: ${prop.clsName}`)
			})
		}
	}
	reqProps() {
		const reqPropGroup = new SettingGroup(this.contentEl)
		reqPropGroup.addClass('mod-list')
		reqPropGroup.setHeading('Required Properties for this classification')
		reqPropGroup.addExtraButton((button) => {
			button.setIcon('plus')
			button.onClick(() => {
				const reqProp = this.cls.addReqProp()
				modalManager.ReqPropModal(this.cls, reqProp, ()=>this.display())
			})
		})
		for (const [key, prop] of this.cls.reqProps) {
			reqPropGroup.addSetting((setting) => {
				setting.setName(prop.getDesc())
				setting.addButton((button) => {
					button.setButtonText('Edit')
					button.onClick(() => {
						modalManager.ReqPropModal(this.cls, prop.flat,()=>this.display())
					})
				})
				setting.addExtraButton((button) => {
					button.setIcon('x')
					button.onClick(() => {
						this.flatCls.requriedProperties = this.flatCls.requriedProperties.filter((p) => p !== key)
						setUtil.reqPropMap.delete(key)
						this.display()
					})
				})
			})
		}
	}
	children() {
		const childGroup = new SettingGroup(this.contentEl)
		childGroup.addClass('mod-list')
		childGroup.setHeading('Child Classifications')
		childGroup.addExtraButton((button) => {
			button.setIcon('plus')
			button.onClick(() => {
				const {node} = setUtil.newCls(this.cls.id)
				modalManager.ClsModal(node, ()=>this.display())
			})
		})
		for (const child of this.childClasses) {
			childGroup.addSetting((setting) => {
				setting.setName(child.cls.name)
				setting.setDesc(child.cls.flat.description ?? "")
				setting.addButton((button) => {
					button.setButtonText('Edit')
					button.onClick(() => {
						modalManager.ClsModal(child, () => this.display())
					})
				})
				setting.addExtraButton((button) => {
					button.setIcon('x')
					button.onClick(() => {
						setUtil.deleteCls(child.id)
						this.display()
						void this.ncp.saveSettings()
					})
				})
			})
		}
	}
}
