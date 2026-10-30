import { devlog } from '../logger';
import { FlatCls } from '../types/classifications.types';
import { DEFAULT_SETTINGS } from '../types/settings.types';
import { Rules, TestCls } from './mocks/classifications.mocks';
import { TestFiles } from './mocks/FileMocks';
import { settingMocks } from './mocks/setting.mocks';

describe.skip('Settings Unit Tests', () => {
	let settingUtil: typeof import('../settings/settingsUtil').settingUtil;
	beforeAll(() => {
		jest.spyOn(devlog, 'test').mockImplementation(
			(thing, ...args: unknown[]) => {
				console.debug(`[${thing}]`, JSON.stringify(args, null, 2));
			},
		);
	});
	beforeEach(async () => {
		jest.resetModules();
		const module = await import('../settings/settingsUtil');
		settingUtil = module.settingUtil;
	});
	describe('get()', () => {
		test('Return Default settings', () => {
			const startSet = settingUtil.get();
			expect(startSet).toStrictEqual(DEFAULT_SETTINGS);
		});
	});
	describe('updateMain()', () => {
		test('update main settings', () => {
			settingUtil.updateMain({ debug: true });
			const updatedsets = settingUtil.get();
			expect(updatedsets.debug).toBe(true);
		});
		test('updates main settings with out altering classes', () => {
			
			settingUtil.updateAll(settingMocks);
			settingUtil.updateMain({ debug: true });
			const updatedSettings = settingUtil.get();
			const newRules = updatedSettings.classes;
			expect(updatedSettings.debug).toBe(true);
			expect(newRules.get('1')).toEqual(TestCls.media.flatCls)
		});
	})
	describe('updateAll()', () => {
		test('updates top level settings', () => {
			settingUtil.updateAll({ debug: true });
			expect(settingUtil.get().debug).toBe(true);
		});
		test('updates flat rules in settings', () => {
			settingUtil.updateAll(settingMocks);
			const updatedclasses = settingUtil.get().classes;
			expect(updatedclasses.get('1')).toEqual(TestCls.media.flatCls)
		});
		test('populates clsMap', () => {
			const classes = new Map()
			classes.set(TestCls.media.flatCls.id, TestCls.media.flatCls)
			settingUtil.updateAll({ classes:classes, rules:Rules});
			const getClsRes = settingUtil.getCls('1');
			expect(getClsRes.success).toBe(true);
		});
		test('Rebuilds node tree', () => {
			const classes = new Map()
			classes.set(TestCls.media.flatCls.id, TestCls.media.flatCls)
			settingUtil.updateAll({ classes:classes, rules:Rules});
			expect(settingUtil.rootNodes()).toHaveLength(1);
		});
	});
	describe('updateCls()', () => {
		beforeEach(() => {
			settingUtil.updateAll(settingMocks)
		})
			

		const updatedcls:FlatCls = {
			...TestCls.media.flatCls,
			name:"New Media"
		};
		
		test('update Cls in map', () => {
			settingUtil.updateCls(updatedcls)
			const getClsRes = settingUtil.getCls("1")
			expect(getClsRes.success).toBe(true)
			if (getClsRes.success) {
				expect(getClsRes.cls.name).toBe("New Media")
			}
		});
		test('rebuild nodeTree', () => {
			settingUtil.updateCls(updatedcls)
			const rootNodes = settingUtil.rootNodes()
			expect(rootNodes).toHaveLength(3)
			if (rootNodes[0]) {
				expect(rootNodes[0].classification.name).toBe("New Media")
			}
		});
	});
	
	describe('getCls()', () => {
		
			beforeEach(() => {
			settingUtil.updateAll(settingMocks);
			
		})
		test('Returns Success/Cls instance when ID exists', () => {
			const clsRes = settingUtil.getCls("1")
			expect(clsRes.success).toBe(true)
		});
		test('Returns Fail when ID does not exist', () => {
			const clsRes = settingUtil.getCls('50');
			expect(clsRes.success).toBe(false)
		});
	});
	describe('rootNodes()', () => {
		
		test('Returns all nodes when no children', () => {
			const classes = new Map()
			classes.set(TestCls.media.flatCls.id, TestCls.media.flatCls)
			classes.set(TestCls.project.flatCls.id, TestCls.project.flatCls)
			settingUtil.updateAll({ classes: classes, rules: Rules });
			const nodes = settingUtil.rootNodes()
			expect(nodes).toHaveLength(2)
		
		});
		test('Returns Only root node when there are children', () => {
			const classes = new Map()
			classes.set(TestCls.project.flatCls.id, TestCls.project.flatCls)
			classes.set(TestCls.projectNotes.flatCls.id, TestCls.projectNotes.flatCls)
			settingUtil.updateAll({ classes:classes,rules:Rules});
			const nodes = settingUtil.rootNodes()
			expect(nodes).toHaveLength(1)
			if (nodes[0]) {
				expect(nodes[0].children).toHaveLength(1)
			}
		});
	});
	describe.skip('matchCls()', () => {
		test('Return Matched Cls when file matches rule', () => {
			const classes = new Map()
			classes.set(TestCls.media.flatCls.id, TestCls.media.flatCls)
			settingUtil.updateAll({ classes:classes, rules:Rules});
			const res = settingUtil.matchCls(TestFiles.media.midfile)
			expect(res.success).toBe(true)
		});
		test('Return Fail when no Cls Matches', () => {
			const res = settingUtil.matchCls(TestFiles.media.midfile)
			expect(res.success).toBe(false)
		});
	});
});
