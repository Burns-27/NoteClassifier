jest.mock('obsidian',()=> ({
	getAllTags:jest.fn()
}))
import { getAllTags } from 'obsidian';
import { ClsFile } from '../classification/ClassifiedFile';
import { devlog } from '../logger';
import { settingUtil } from '../settings/settingsUtil';
import { appUtils } from '../tools/AppUtils';
import { TestFiles } from './mocks/FileMocks';

describe.skip('ClsFile', () => {
	describe.skip('Static Create()', () => {
		beforeAll(() => {
			jest.spyOn(devlog, 'test').mockImplementation(
				(thing, ...args: unknown[]) => {
					console.debug(`[${thing}]`, JSON.stringify(args, null, 2));
				},
			);
			beforeEach(() => {
				jest.clearAllMocks();
			});
		});
		test('Creates TClsFile when matching class ', () => {
			const file = TestFiles.media;
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
			(getAllTags as jest.Mock).mockReturnValue(file.tags)
			jest.spyOn(settingUtil, 'matchCls').mockReturnValue(
				file.mockMatchRes,
			);
			const clsNote = ClsFile.create(file.file);
			if (clsNote.success && clsNote.type == 'note cls') {
				expect(clsNote.note).toBeInstanceOf(ClsFile);
				expect(clsNote.note.classification).toBe(file.expectedClsName);
			}
		});
		test('Returns Fail when no match', () => {});
		test('Returns fail when no metadata', () => {});
	});
	describe.skip('getDestination', () => {});
});
