import { App, PluginSettingTab,  SettingDefinitionItem, SettingDefinitionPage, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { FlatClass, NodeClass } from '../Rules/Classification';
import { ClassificationModal } from './classificationModal';

export interface NoteClassifierSettings {
	rules: Array<FlatClass>;
	nextID: number;
}

export const DEFAULT_SETTINGS: NoteClassifierSettings = {
	rules: [],
	nextID: 1,
};
export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	flatRules: FlatClass[];
	rootNodes: NodeClass[];
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		this.flatRules = plugin.settings.rules
		this.rootNodes = plugin.rootNodes
	}
	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				heading: 'Classes',
				type: "list",
				addItem: {
					name: "Add Classification",
					action: () => console.debug("New Item"),
				},
				items: this.rootNodes.map((rule, index) => this.getRulePage(rule, index))
				
			}
		]
	}
	getRulePage(rule: NodeClass, index: number): SettingGroupItem {
		const flatRule = this.flatRules.find((r) => r.id == rule.rule.id)
		if (!flatRule) return {
			type: "page",
			name: "Error",
			items: [
				{
					name: "Classification Not found",
					desc:"This Classification was not found, please reload app, or plugin"
				}
			]
		}
		const ruleID = rule.rule.id
		const children = rule.children
		return {
			type: "page",
			name: `Classification: ${flatRule.name}`,
			items: [
				{
					name: "Name",
					control: {
						type: 'text',
						key:`rule.${ruleID}.name`
					}
				},
				{
					name: "Destination Folder",
					control: {
						type: 'text',
						key:`rule.${ruleID}.folder`
					}
				}
			]
		}
	}
}