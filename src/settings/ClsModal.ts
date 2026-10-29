import { Modal, Setting, SettingGroup } from 'obsidian';
import NoteClassifier from '../main';
import { settingUtil } from './settingsUtil';
import { FlatCls, TCls } from '../types/classifications.types';
import { FlatRule, TRule } from '../types/rules.types';
import { RuleModal } from './rulesModal';

export class ClsModal extends Modal {
	flatCls: FlatCls;
	cls: TCls;
	ncp: NoteClassifier;
	update: (cls: FlatCls) => void;
	constructor(
		ncp: NoteClassifier,
		cls: TCls,
		updateCls: (cls: FlatCls) => void,
	) {
		super(ncp.app);
		this.ncp = ncp;
		this.update = updateCls;
		this.flatCls = { ...cls.flat };
		this.cls = cls;
		this.display();
		this.setCloseCallback(() => {
			updateCls(this.flatCls);
		});
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
		this.propertySection();
		this.rulesSection();
	}
	propertySection() {
		const propSetGroup = new SettingGroup(this.contentEl);
		propSetGroup.setHeading('Required Properties');
		propSetGroup.addExtraButton((button) => {
			button.setIcon('plus');
			button.onClick(() => {
				this.flatCls.requriedProperties.push('new');
				this.display();
			});
		});
		this.flatCls.requriedProperties.forEach((prop, index) => {
			propSetGroup.addSetting((setting) => {
				setting.addText((text) => {
					text.setValue(prop);
					text.onChange((value) => {
						this.flatCls.requriedProperties[index] = value;
					});
				});
				setting.addExtraButton((button) => {
					button.setIcon('x');
					button.onClick(() => {
						this.flatCls.requriedProperties.splice(index, 1);
						this.display();
					});
				});
			});
		});
	}
	rulesSection() {
		const rulesSettingGroup = new SettingGroup(this.contentEl);
		rulesSettingGroup.setHeading('File Matching Rules');
		rulesSettingGroup.addExtraButton((button) => {
			button.setIcon('plus');
			button.setTooltip('Add new rule');
			button.onClick(() => this.newRulesModal());
		});
		this.cls.rules.forEach((rule) => {
			rulesSettingGroup.addSetting((setting) => {
				setting.setName(rule.getDesc());
				setting.addButton((button) => {
					button.setButtonText('Edit');
					button.onClick(() => this.openRulesModal(rule));
				});
				setting.addExtraButton((button) => {
					button.setIcon('trash');
					button.onClick(() => {
						this.flatCls.rules.delete(rule.id)
						const res = settingUtil.updateCls(this.flatCls)
						this.cls = res.cls;
						this.flatCls = {...res.cls.flat}
						this.display();
					});
				});
			});
		});
	}
	openRulesModal(rule: TRule) {
		const copyRule = {...rule.flat}
		new RuleModal(this.ncp, copyRule, this.updateRule).open();
	}
	newRulesModal() {
		const id = settingUtil.nextID()
		let rule: FlatRule = {
			type: 'tag',
			matchType: 'exact',
			tag: 'New',
			id:id,
		};
		new RuleModal(this.ncp, rule, this.updateRule).open();
	}
	updateRule= (newRule: FlatRule):void=>{
		this.flatCls.rules.set(newRule.id, newRule)
		const res = settingUtil.updateCls(this.flatCls)
		this.flatCls = { ...res.cls.flat}
		this.cls = res.cls
		this.display()
	}
}
