import {
	Plugin,
} from 'obsidian';
import {
	NoteClassifierSettingTab,
} from './settings/settingsTab';
import { NoteClassifierSettings } from './types/settings.types';
import { settingUtil } from './settings/settingsUtil';


export default class NoteClassifier extends Plugin {
	settings!: NoteClassifierSettings;
	async onload() {
		await this.loadSettings();
		this.settings= settingUtil.get()
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
	nextID(): number{
		const nextID = this.settings.nextID
		this.settings.nextID++
		return nextID
	}
	
	async updateFile() {
		
	}
	async checkFileFrontmatter() {
		
	}
	
	async saveSettings() {
		await this.saveData(settingUtil.get());
	}
	async loadSettings() {
		const data = await this.loadData() as Partial<NoteClassifierSettings>;
		settingUtil.updateAll(data)
	}
}
