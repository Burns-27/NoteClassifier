import {
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	NoteClassifierSettings,
	NoteClassifierSettingTab,
} from './settings/settings';
import { NodeClass, TClass } from './Rules/Classification';
import { Hydrate } from './settings/loadRules';
import { TClsFile } from './classification/ClassifiedFile';

export default class NoteClassifier extends Plugin {

	settings!: NoteClassifierSettings;
	flatClassArray!: Array<TClass>;
	rootNodes!: Array<NodeClass>;
	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin

		this.addSettingTab(new NoteClassifierSettingTab(this.app, this));
		
		this.addCommand({
			id: `update-active-file`,
			name: 'Update active file',
			callback: () => {
				console.debug('Active file update')
			}
		})
		this.addCommand({
			id: 'update-all-files',
			name: 'Update all files',
			callback: () => {
				console.debug('Update all files')
			}
		})
		
	}
	
	onunload() {}
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<NoteClassifierSettings>,
		);
		this.loadRules()
	}
	async classifyActiveFile():TClsFile{
		
	}
	async moveFile() {
		
	}
	loadRules() {
		const { flatMap, rootNodes } = Hydrate(this.settings)
		this.flatClassArray = flatMap
		this.rootNodes = rootNodes
	}
	async updateFile() {
		
	}
	async checkFileFrontmatter() {
		
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
		this.loadRules();
	}
}
