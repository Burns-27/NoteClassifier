import {
	type App,
	PluginSettingTab,
	type SettingDefinitionItem,
} from 'obsidian';
import NoteClassifier from '../main';
import { modalManager } from '../tools/modalManager';
import { setUtil } from './settings';


export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		modalManager.init(plugin);
	}
	
	getSettingDefinitions(): SettingDefinitionItem[] {
		const rootNodes = setUtil.nodeTree;
		return [
			{
				name: 'Debug Mode',
				desc: 'Enable Debug logs in the developer tools',
				control: { type: 'toggle', key: 'debug' },
			},
			{
				name: 'Create Reports',
				desc: 'Create a .bases file with views that filters based on notices. See docs for details.  ',
				action: () => {
					console.debug('Create Report button Clicked');
				},
			},
			{
				name: 'Add Classification Prop',
				desc: 'When on, NCP will add a property with the classification name to a updated file',
				control:{key:'addClassificationProp', type:'toggle'}
			},
			{
				name: 'Classification Property',
				desc: 'The name of the property NCP will use for classificaiton',
				visible: ()=>setUtil.base.addClassificationProp,
				control:{key:'classificationProp', type:'text'}
			},
			{
				name: 'Notificaitons and defaults',
				type: 'page',
				desc: 'Choose what notifications and default values are',
				items: [
					{
						name: 'Summary Notice',
						desc: 'Show Notice of how many files moved/audited post command',
						control: { type: 'toggle', key: 'SummaryNotice' },
					},
					{
						name: 'Error Notice',
						desc: 'Show notice when there a command is unable to be completed for a file',
						control: { type: 'toggle', key: 'ErrorNotice' },
					},
					{
						name: 'Notice Property',
						desc: 'the property used to indicate a file has errors',
						control: { type: 'text', key: 'NoticeProperty' },
					},
					{
						name: 'Add Mising Properties',
						desc: 'When on, NCP will automatically add missing properties to note',
						control:{type:'toggle', key:'addMissingProps'}
					},
					{
						type: 'group',
						heading: 'Path Fallback behavior',
						desc: 'When a destination uses a property value, you can provide a fallback value. The default fallback value is for when the file does not have the matching property, and no fallback behavior is set.',
						items: [
							{
								name: 'Flag For default',
								desc: 'Add a error flag to files that use the default fallback behavior',
								control: {
									type: 'toggle',
									key: 'flagFallbackDefault',
								},
							},
							{
								name: 'Default Fallback Value',
								desc: 'What will be used inplace of the property value',
								control: {
									key: 'pathFallbackDefault',
									type: 'dropdown',
									options: {
										Prop: 'The Property',
										Skip: 'Skip the folder',
									},
								},
							},
						],
					},
				],
			},
			{
				name: 'Ingore property',
				desc: 'if this property is checked on a file, it will be ignored by NoteClassifier',
				control: { key: 'ignoreFilesProperty', type: 'text' },
			},
			{
				type: 'page',
				name: 'Edit Classifications',
				items: [
					{
						heading: 'Classes',
						type: 'list',
						addItem: {
							name: 'Add Classification',
							action: () => {
								const newcls = setUtil.newCls();
								modalManager.ClsModal(newcls, ()=>this.update());
							},
						},
						items: rootNodes.map((node) => ({
							name: node.cls.name,
							desc: node.cls.flat.description,
							action: () => {
								setUtil.deleteCls(node.id)
								void this.plugin.saveSettings()
								this.update()
							}
						})
						),
					},
				],
			},
			
		];
	}

}
