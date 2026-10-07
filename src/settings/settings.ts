import { App, PluginSettingTab,  SettingDefinitionItem } from 'obsidian';
import NoteClassifier from '../main';
import { FlatClass } from '../Rules/Classification';

export interface NoteClassifierSettings {
	rules:Array<FlatClass> ;
}

export const DEFAULT_SETTINGS: NoteClassifierSettings = {
	rules:[],
};
export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;

	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
	}
	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: 'Settings #1',
				desc:"It's a secret",
				control: {
					type: "text",
					key: 'mySetting',
					placeholder:"Enter your Secret"
				}
			}
		]
	}

	
}
