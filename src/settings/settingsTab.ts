import {
	type App,
	PluginSettingTab,
	type SettingDefinitionItem,
} from 'obsidian';
import NoteClassifier from '../main';
import { modalManager } from '../tools/modalManager';
import { setUtil } from './settings';
import { IgnoredFolderModal } from '../Ignore/IgnoredFoldersModal';

export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		modalManager.init(plugin);
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		const rootNodes = setUtil.nodeTree;
		const ignoredFolders = [...setUtil.ignoredFoldersSet];
		return [
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
				type: 'group',
				heading: 'File Flags',
				items: [
					{
						name: 'Notice Property',
						desc: 'the property used to indicate a file has errors',
						control: {
							type: 'text',
							key: 'NoticeProperty',
						},
					},
					{
						name: 'Flag Unclassified Files',
						control: {
							type: 'toggle',
							key: 'flagUnclassified',
						},
					},
					{
						name: 'Flag For default',
						desc: 'Add a error flag to files that use the default fallback behavior',
						control: {
							type: 'toggle',
							key: 'flagFallback',
						},
					},
					{
						name: 'Flag Missing Properties',
						control: {
							type: 'toggle',
							key: 'flagPropsMissing',
						},
					},
					{
						name: 'Flag Invalid Properties',
						control: {
							type: 'toggle',
							key: 'flagPropsInvalid',
						},
					},
				],
			},
			{
				type: 'group',
				heading:'Notices',
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
					}
				],
			},
			{
				type: 'group',
				heading: "Behavior",
				items: [
					{
						name: 'Add Missing Properies',
						desc:'Should Note Classifier add missing properties found when Update file is ran', 
						control: {
							type: 'toggle',
							key:'addMissingProps'
						}
					},
					{
						name: 'Default Path fallback',
						desc:'What to do if a file is missing a property used in its classes path.',
						control: {
							type: 'dropdown',
							key: 'pathFallbackDefault',
							options: {
								Prop: 'The Property name',
								Skip:'Skip that folder'
							}	
						}
					}
				]
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
						type: 'list',
						heading: 'Ignored Folders',
						addItem: {
							name: 'Add Ignored Folder',
							action: () => {
								new IgnoredFolderModal(this.plugin, () =>
									this.update(),
								).open();
							},
						},
						onDelete: (index) => {
							setUtil.ignoredFoldersSet.delete(
								ignoredFolders[index] ?? '',
							);
							this.update();
						},
						items: ignoredFolders.map((f) => ({
							name: f,
						})),
					},
				],
			},
			{
				name: 'Debug Mode',
				desc: 'Enable Debug logs in the developer tools',
				control: { type: 'toggle', key: 'debug' },
			},
		];
	}
}
