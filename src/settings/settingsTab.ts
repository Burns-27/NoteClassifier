import {
	type App,
	PluginSettingTab,
	type SettingDefinitionItem,
} from 'obsidian';
import NoteClassifier from '../main';
import { modalManager } from '../tools/modalManager';
import { setUtil } from './settings';
import { IgnoredFolderModal } from './Modals/IgnoredFoldersModal';

export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		modalManager.init(plugin);
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		const rootNodes = setUtil.nodeTree;
		const ignoredFolders = [...setUtil.ignoredFoldersSet]
		return [
			{
				name: 'Debug Mode',
				desc: 'Enable Debug logs in the developer tools',
				control: { type: 'toggle', key: 'debug' },
			},
			
			{
				name: 'Add Classification Prop',
				desc: 'When on, NCP will add a property with the classification name to a updated file',
				control: { key: 'addClassificationProp', type: 'toggle' },
			},
			{
				name: 'Classification Property',
				desc: 'The name of the property NCP will use for classificaiton',
				visible: () => setUtil.base.addClassificationProp,
				control: { key: 'classificationProp', type: 'text' },
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
						type:'group',
						heading:'File Flags',
						items:[
							{
						name: 'Notice Property',
						desc: 'the property used to indicate a file has errors',
						control: { type: 'text', key: 'NoticeProperty' },
					},{
						name:'Flag Unclassified Files',
						control:{type:'toggle',key:'flagUnclassified'}
					}
						]
					},
					
					{
						name: 'Add Mising Properties',
						desc: 'When on, NCP will automatically add missing properties to note',
						control: { type: 'toggle', key: 'addMissingProps' },
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
				type: 'page',
				name: 'Ignored File and Folders',
				items: [
					{
						name: 'Ingore property',
						desc: 'if this property is checked on a file, it will be ignored by NoteClassifier',
						control: { key: 'ignoreFilesProperty', type: 'text' },
					},
					{
						type:'list',
						heading:'Ignored Folders',
						addItem:{
							name:'Add Ignored Folder',
							action:()=>{
								new IgnoredFolderModal(this.plugin, ()=>this.update()).open()
							}
						},
						onDelete:(index)=>{
							setUtil.ignoredFoldersSet.delete(ignoredFolders[index]??'')
							this.update()
						},
						items:ignoredFolders.map((f)=>({
							name:f
						}))
						
					}
				],
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
								const { node } = setUtil.newCls();
								modalManager.ClsModal(node, () =>
									this.update(),
								);
							},
						},
						onDelete: (index) => {
							const node = rootNodes[index];
							setUtil.deleteCls(node?.id ?? 'Error');
							void this.plugin.saveSettings();
							this.update();
						},
						items: rootNodes.map((node) => ({
							name: node.cls.name,
							desc: node.cls.flat.description,
							action: () => {
								modalManager.ClsModal(node, () =>
									this.update(),
								);
							},
						})),
					},
				],
			},
		];
	}
}
