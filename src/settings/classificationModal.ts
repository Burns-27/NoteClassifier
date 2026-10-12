import { App, Modal, Setting, SettingGroup } from 'obsidian';
import { FlatClass, NodeClass } from '../Rules/Classification';
import NoteClassifier from '../main';

export class ClassificationPage extends SettingsPage{
	private rule: FlatClass;
	private ncp: NoteClassifier;
	constructor(
		app: App,
		ncp: NoteClassifier,
		cls?: NodeClass,
		parentid?: number,
	) {
		super(app);
		this.ncp = ncp;
		const newClass: FlatClass = {
			id: ncp.nextID().toString(),
			name: 'New',
			requriedProperties: [],
			type: 'property',
			rule: [],
			folder: '',
		};
		if (cls) {
			const flatClass: FlatClass | undefined = ncp.settings.rules.find(
				(rule) => rule.id == cls.rule.id,
			);
			if (!flatClass) {
				if (!parentid) {
					this.rule = newClass;
				} else {
					this.rule = { ...newClass, parentID: parentid.toString() };
				}
				ncp.settings.rules.push(this.rule);
			} else {
				this.rule = flatClass;
			}
		} else {
			if (!parentid) {
					this.rule = newClass;
				} else {
					this.rule = { ...newClass, parentID: parentid.toString() };
				}
		}
		this.setTitle(`Edit Classification: ${this.rule.name}`);
	}
	mainSection(rule: FlatClass) {
    const nameSetting = new Setting(this.contentEl)
    nameSetting.setName(`Name`)
    nameSetting.addText((text) => {
      text.setValue(rule.name).onChange(async (value) => {
        rule.name = value
        await this.ncp.saveSettings()
      })
    })
    const folderSetting = new Setting(this.contentEl)
    folderSetting.setName('Folder')
    folderSetting.setDesc('Assign folder to move file to. Can use values of required properties. See docs for details')
		folderSetting.addText((text) => {
			text.setValue(rule.folder)
			text.onChange(async (value) => {
				rule.folder = value
				await this.ncp.saveSettings()
			})
		})
	}
}
