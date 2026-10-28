import { devlog } from '../logger';
import { FlatCls } from '../types/classifications.types';
import { DEFAULT_SETTINGS } from '../types/settings.types';
import { TestCls } from './mocks/classifications.mocks';
import { TestFiles } from './mocks/FileMocks';

describe('Settings Unit Tests', () => {
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
			settingUtil.updateMain({ createReports: true });
			const updatedsets = settingUtil.get();
			expect(updatedsets.createReports).toBe(true);
		});
		test('updates main settings with out altering rules array', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] });
			settingUtil.updateMain({ debug: true });
			const updatedSettings = settingUtil.get();
			const rules = updatedSettings.rules;
			expect(updatedSettings.debug).toBe(true);
			expect(rules).toHaveLength(1);
			if (rules.length == 1 && rules[0])
				expect(rules[0].id).toBe(TestCls.media.flatCls.id);
		});
	});
	describe('updateAll()', () => {
		test('updates top level settings', () => {
			settingUtil.updateAll({ debug: true });
			expect(settingUtil.get().debug).toBe(true);
		});
		test('updates flat rules in settings', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] });
			const updatedRules = settingUtil.get().rules;
			expect(updatedRules).toHaveLength(1);
			if (updatedRules.length == 1 && updatedRules[0]) {
				expect(updatedRules[0].id).toBe(TestCls.media.flatCls.id);
			}
		});
		test('populates clsMap', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] });
			const getClsRes = settingUtil.getCls('1');
			expect(getClsRes.success).toBe(true);
		});
		test('Rebuilds node tree', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] });
			expect(settingUtil.rootNodes()).toHaveLength(1);
		});
	});
	describe('updateCls()', () => {
		const startingRule = { rules: [TestCls.media.flatCls] };
		const updatedcls:FlatCls = {
			id: '1',
			name: 'New Media',
			destination: 'media',
			requriedProperties: [],
	rules: [
		{
			id: '2',
			type: 'property',
			matchType: 'exact',
			propertyName: 'categoty',
			propertyValue: 'media',
		},
	],
		};
		test('Replace rule in flat rules', () => {
			settingUtil.updateAll(startingRule)
			settingUtil.updateCls(updatedcls)
			const getFlatClsRes = settingUtil.getFlatCls("1")
			expect(getFlatClsRes.success).toBe(true)
			expect(settingUtil.get().rules).toHaveLength(1)
			if (getFlatClsRes.success) {
				expect(getFlatClsRes.cls.name).toBe("New Media")
			}
				
		});
		test('update Cls in map', () => {
			settingUtil.updateAll(startingRule)
			settingUtil.updateCls(updatedcls)
			const getClsRes = settingUtil.getCls("1")
			expect(getClsRes.success).toBe(true)
			if (getClsRes.success) {
				expect(getClsRes.cls.name).toBe("New Media")
			}
		});
		test('rebuild nodeTree', () => {
			settingUtil.updateAll(startingRule)
			settingUtil.updateCls(updatedcls)
			const rootNodes = settingUtil.rootNodes()
			expect(rootNodes).toHaveLength(1)
			if (rootNodes[0]) {
				expect(rootNodes[0].classification.name).toBe("New Media")
			}
		});
	});
	describe('getFlatCls()', () => {
		test('Returns Sucess/Flat class when ID exists', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] });
			expect(settingUtil.getFlatCls('1').success).toBe(true);
		});
		test('Returns Fail when ID does not exist', () => {
			expect(settingUtil.getFlatCls('5').success).toBe(false);
		});
	});
	describe('getCls()', () => {
		const startingRule = { rules: [TestCls.media.flatCls] };
		beforeEach(() => {
			settingUtil.updateAll(startingRule)
		})
		test('Returns Success/Cls instance when ID exists', () => {
			const clsRes = settingUtil.getCls("1")
			expect(clsRes.success).toBe(true)
		});
		test('Returns Fail when ID does not exist', () => {
			const clsRes = settingUtil.getCls('5')
			expect(clsRes.success).toBe(false)
		});
	});
	describe('rootNodes()', () => {
		test('Returns all nodes when no children', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls, TestCls.project.flatCls] })
			const nodes = settingUtil.rootNodes()
			expect(nodes).toHaveLength(2)
		
		});
		test('Returns Only root node when there are children', () => {
			settingUtil.updateAll({ rules: [TestCls.projectNotes.flatCls, TestCls.project.flatCls] })
			const nodes = settingUtil.rootNodes()
			expect(nodes).toHaveLength(1)
			if (nodes[0]) {
				expect(nodes[0].children).toHaveLength(1)
			}
		});
	});
	describe('matchCls()', () => {
		test('Return Matched Cls when file matches rule', () => {
			settingUtil.updateAll({ rules: [TestCls.media.flatCls] })
			const res = settingUtil.matchCls(TestFiles.media.midfile)
			expect(res).toEqual(TestFiles.media.mockMatchRes)
		});
		test('Return Fail when no Cls Matches', () => {
			const res = settingUtil.matchCls(TestFiles.media.midfile)
			expect(res.success).toBe(false)
		});
	});
});
