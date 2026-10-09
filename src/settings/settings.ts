import { App, PluginSettingTab,  SettingDefinitionItem, SettingDefinitionPage } from 'obsidian';
import NoteClassifier from '../main';
import { FlatClass, NodeClass } from '../Rules/Classification';

export interface NoteClassifierSettings {
	rules: Array<FlatClass>;
	nextID: number;
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
				heading: 'Classes',
				type:"list",
				items: this.plugin.rootNodes.map((rule) => ({ 
					name: rule.rule.name,
					searchable: false,
					action: () => {

				}))
			}
		]
	}
	
	}
	
}
