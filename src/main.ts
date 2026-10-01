import {
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	NewPluginSettings,
	MySettingTab,
} from './settings';

//TODO(Start) Change Manifest and Package Json to Be personalized
//TODO(Rename) Change Plugin Class Name
export default class NewPlugin extends Plugin {
	//TODO(Clean Up) Change Settings Type to match Type in settings.ts
	settings!: NewPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		//TODO(Clean Up) Change Settings tab here to match Class in settings.ts
		this.addSettingTab(new MySettingTab(this.app, this));


	}

	onunload() {}
//TODO(Clean Up) Change Type here to match Settings type in settings.ts
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<NewPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
