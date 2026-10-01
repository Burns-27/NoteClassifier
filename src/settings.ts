import { App, PluginSettingTab,  SettingDefinitionItem } from 'obsidian';
import MyPlugin from './main';
//TODO(Rename) Rename Plugin Settings Interface
export interface NewPluginSettings {
	mySetting: string;
}
//TODO(Clean Up) Update this to match Interface
export const DEFAULT_SETTINGS: NewPluginSettings = {
	mySetting: 'default',
};
//TODO(Rename) Rename The Settings Tab
export class MySettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
