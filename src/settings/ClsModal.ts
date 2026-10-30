import { ButtonComponent, Modal, Setting, SettingGroup } from 'obsidian';
import NoteClassifier from '../main';
import { FlatCls, TCls } from '../types/classifications.types';

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
		const continueButton = new ButtonComponent(this.contentEl)
		continueButton.setButtonText('Continue').onClick(() => {
			this.update(this.flatCls)
			this.close()
		})
	}
	
}
