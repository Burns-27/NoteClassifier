import { FlatCls } from '../src/types/classifications.types';

import { TestFiles } from './mocks/FileMocks';
import { settingMocks } from './mocks/setting.mocks';
jest.mocked('obsidian')

describe('Settings Unit Tests', () => {
	let settingUtil: typeof import('../src/settings/settingsUtil').settingUtil;

	beforeEach(async () => {
		jest.resetModules();
		const module = await import('../src/settings/settingsUtil');
		settingUtil = module.settingUtil;
		
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
			expect(newRules.get('1')).toEqual({
				id: '1',
				name: 'Media',
				destination: 'Media',
				requriedProperties: [],
				rules: ['2'],
			});
		});
	});
	describe('updateAll()', () => {
		test('updates top level settings', () => {
			settingUtil.updateAll({ debug: true });
			expect(settingUtil.get().debug).toBe(true);
		});
		test('updates flat rules in settings', () => {
			settingUtil.updateAll(settingMocks);
			const updatedclasses = settingUtil.get().classes;
			expect(updatedclasses.get('1')).toEqual({
		id: '1',
		name: 'Media',
		destination: 'Media',
		requriedProperties: [],
		rules:['2']
	});
		});
	});
	describe('updateCls()', () => {
		beforeEach(() => {
			settingUtil.updateAll(settingMocks);
		});

		const updatedcls: FlatCls = {
		id: '1',
		name: 'New Media',
		destination: 'Media',
		requriedProperties: [],
		rules:['2']
	};

		test('update Cls in map', () => {
			settingUtil.updateCls(updatedcls);
			const getClsRes = settingUtil.getCls('1');
			expect(getClsRes.success).toBe(true);
			if (getClsRes.success) {
				expect(getClsRes.cls.name).toBe('New Media');
			}
		});
		test('rebuild nodeTree', () => {
			settingUtil.updateCls(updatedcls);
			const rootNodes = settingUtil.rootNodes();
			expect(rootNodes).toHaveLength(3);
			if (rootNodes[0]) {
				expect(rootNodes[0].classification.name).toBe('New Media');
			}
		});
	});

	describe('getCls()', () => {
		beforeEach(() => {
			settingUtil.updateAll(settingMocks);
		});
		test('Returns Success/Cls instance when ID exists', () => {
			const clsRes = settingUtil.getCls('1');
			expect(clsRes.success).toBe(true);
		});
		test('Returns Fail when ID does not exist', () => {
			const clsRes = settingUtil.getCls('50');
			expect(clsRes.success).toBe(false);
		});
	});
	describe('rootNodes()', () => {
		beforeEach(() => {
			settingUtil.updateAll(settingMocks);
		});
		test('Returns all nodes when no children', () => {
			const nodes = settingUtil.rootNodes();
			expect(nodes).toHaveLength(3);
		});
		test('Returns Only root node when there are children', () => {
			const nodes = settingUtil.rootNodes();
			expect(nodes).toHaveLength(3);
			if (nodes[0]) {
				expect(nodes[0].children).toHaveLength(1);
			}
		});
	});
	describe.skip('matchCls()', () => {
		test('Return Matched Cls when file matches rule', () => {
			const res = settingUtil.matchCls(TestFiles.media.midfile);
			expect(res.success).toBe(true);
		});
		test('Return Fail when no Cls Matches', () => {
			const res = settingUtil.matchCls(TestFiles.media.midfile);
			expect(res.success).toBe(false);
		});
	});
});
