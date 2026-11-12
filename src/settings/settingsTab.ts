import {
	App,
	PluginSettingTab,
	SettingDefinitionItem,
	SettingGroupItem,
} from 'obsidian';
import NoteClassifier from '../main';
import { NodeClass } from '../classification/Classification';
import { settingUtil } from './settingsUtil';
import { FlatCls, TCls } from '../types/classifications.types';
import { settingKeys } from '../types/settings.types';
import { modalManager } from '../tools/modalManager';

function getPath(path: string): unknown {
	const pathArray = path.split('.');
	const rules: Map<string, FlatCls> = settingUtil.get().classes;
	let id: string = '';
	let cls: FlatCls | undefined;
	let value: unknown = '';
	if (pathArray.length == 1) {
		value = settingUtil.get()[path as settingKeys];
		return value;
	}
	if (pathArray.length == 3 && pathArray[0] == 'rules') {
		if (pathArray[0] && pathArray[1]) {
			id = pathArray[1];
			cls = rules.get(id);
		}
		if (!cls) return undefined;
		if (pathArray[2]) {
			switch (pathArray[2]) {
				case 'name':
					value = cls.name;
					break;
				case 'description':
					value = cls.description;
					break;
				case 'destination':
					value = cls.destination;
					break;
				default:
					value = undefined;
					break;
			}
		}
	}
	return value;
}
function setPath(path: string, value: unknown) {
	const pathArray = path.split('.');
	const classes: Map<string, FlatCls> = settingUtil.get().classes;
	let id: string = '';
	let cls: FlatCls | undefined;
	if (pathArray.length == 1) {
		settingUtil.updateMain({ [path]: value });
	}
	if (
		pathArray.length == 3 &&
		pathArray[0] == 'rules' &&
		typeof value == 'string'
	) {
		if (pathArray[1]) {
			id = pathArray[1];
			cls = classes.get(id);
		}

		if (pathArray[2] && cls) {
			switch (pathArray[2]) {
				case 'name':
					cls.name = value;
					break;
				case 'description':
					cls.description = value;
					break;
				case 'destination':
					cls.destination = value;
					break;
				default:
					break;
			}
			settingUtil.updateCls(cls);
		}
		//devlog.loc('setPath', 'clsUpdate', {path, pathArray, value, id, cls, settings:settingUtil.get()})
	}
}
export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		modalManager.init(plugin, () => this.update());
	}
	getControlValue(key: string): unknown {
		const value = getPath(key);
		return value;
	}
	async setControlValue(key: string, value: unknown): Promise<void> {
		setPath(key, value);
		await this.plugin.saveSettings();
	}
	getSettingDefinitions(): SettingDefinitionItem[] {
		const rootNodes = [...settingUtil.rootNodes()];
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
				visible: ()=>settingUtil.get().addClassificationProp,
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
				name: 'Main Classifications',
				items: [
					{
						heading: 'Classes',
						type: 'list',
						addItem: {
							name: 'Add Classification',
							action: () => {
								const newcls = settingUtil.newCls();
								modalManager.ClsModal(newcls.cls);
							},
						},
						items: rootNodes.map((rule, index) =>
							this.getClsPage(rule, index),
						),
					},
				],
			},
		];
	}

	getClsPage(node: NodeClass, index: number): SettingGroupItem {
		const cls = node.classification;
		const flatcls = cls.flat;
		const keystart = `rules.${flatcls.id}`;
		return {
			type: 'page',
			//id:`${flatcls.id}.${index}`,
			name: `${flatcls.name}`,
			desc: `${flatcls.description ?? ''}`,
			items: [
				{
					name: 'Name',
					control: { key: `${keystart}.name`, type: 'text' },
				},
				{
					name: 'Description',
					control: {
						key: `${keystart}.description`,
						type: 'textarea',
					},
				},
				{
					name: 'Destination',
					desc: "Folder where files of this class should be moved to. See Doc's for syntax",
					control: { key: `${keystart}.destination`, type: 'text' },
				},
				...cls.getSettings((cls: TCls) => this.fullUpdate(cls)),

				{
					heading: 'Child Classifications',
					type: 'list',
					emptyState: 'No Child Classifications',
					addItem: {
						name: 'Add child classification',
						action: () => {
							const newcls = settingUtil.newCls(flatcls.id);
							modalManager.ClsModal(newcls.cls);
						},
					},
					onDelete: (index) => {
						const childcls = node.children[index] ?? false;
						if (childcls) {
							settingUtil
								.get()
								.classes.delete(childcls.classification.id);
							settingUtil.rootNodes();
							void this.plugin.saveSettings();
							this.update();
						}
					},
					items: node.children.map((child, index) =>
						this.getClsPage(child, index),
					),
				},
			],
		};
	}

	fullUpdate(cls: TCls) {
		settingUtil.updateCls(cls.flat);
		void this.plugin.saveSettings();
		this.update();
	}
}
