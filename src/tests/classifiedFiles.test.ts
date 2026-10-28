jest.mock('obsidian',()=> ({
	getAllTags: jest.fn(),
	normalizePath:jest.fn()
}))
import { getAllTags, normalizePath } from 'obsidian';
import { ClsFile } from '../classification/ClassifiedFile';
import { devlog } from '../logger';
import { settingUtil } from '../settings/settingsUtil';
import { appUtils } from '../tools/AppUtils';
import { TestFiles } from './mocks/FileMocks';

describe('ClsFile', () => {
	beforeAll(() => {
		jest.spyOn(devlog, 'test').mockImplementation(
			(thing, ...args: unknown[]) => {
				console.debug(`[${thing}]`, JSON.stringify(args, null, 2));
			},
		);
		jest.spyOn(devlog, "fallback").mockImplementation((type: string, info: Record<string, unknown>) => {
			console.debug(type, info)
		})
	})
	describe('Static Create()', () => {
			beforeEach(() => {
				jest.clearAllMocks();
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
			expect(clsNote.success).toBe(true)
			if (clsNote.success) {
				expect(clsNote.note).toBeInstanceOf(ClsFile);
				expect(clsNote.note.classification).toBe(file.expectedClsName);
			}
		});
		test('Returns fail when no match', () => {
			const file = TestFiles.media
			jest.spyOn(appUtils, "getFileCache").mockReturnValue(file.metadataCache);
			(getAllTags as jest.Mock).mockReturnValue(file.tags);
			jest.spyOn(settingUtil, "matchCls").mockReturnValue({ success: false, message: "No matching Cls" })
			const clsNote = ClsFile.create(file.file)
			expect(clsNote.success).toBe(false)
		});
		test('Returns fail when no metadata', () => {
			const file = TestFiles.media
			jest.spyOn(appUtils, "getFileCache").mockReturnValue(null)
			const clsNote = ClsFile.create(file.file)
			expect(clsNote.success).toBe(false)
			if (!clsNote.success&&clsNote.message) {
				expect(clsNote.message).toBe('No Metadata found')
			}
		});
		describe("Creates Destination String", () => {
			test("When basic Path", () => {
				const file = TestFiles.media;
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
			(getAllTags as jest.Mock).mockReturnValue(file.tags)
			jest.spyOn(settingUtil, 'matchCls').mockReturnValue(
				file.mockMatchRes,
			);
				(normalizePath as jest.Mock).mockImplementation((input:string)=>input)
				jest.spyOn(settingUtil,'getCls').mockReturnValue(file.mockCls.mocParentRes)
				const clsNote = ClsFile.create(file.file);
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Made from Property Value", () => {
				const file = TestFiles.project;
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
			jest.spyOn(settingUtil, 'matchCls').mockReturnValue(
				file.mockMatchRes,
			);
				jest.spyOn(settingUtil,'getCls').mockReturnValue(file.mockCls.mocParentRes)
				const clsNote = ClsFile.create(file.file);
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Nested with Parent Cls", () => {
				const file = TestFiles.articleGuide;
				jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
					file.metadataCache,
				);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				jest.spyOn(settingUtil, 'matchCls').mockReturnValue(
					file.mockMatchRes,
				);
				jest.spyOn(settingUtil,'getCls').mockReturnValue(file.mockCls.mocParentRes)
				const clsNote = ClsFile.create(file.file);
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
		})
			})
	
	describe.skip("validateProperties()", () => {
		test("Returns success when All properties match", () => {
			
		})
		test("Returns False when missing Properties", () => {
			
		})
		test("Includes list of missing properties when fail", () => {
			
		})
	})
	describe.skip("addMissingProperties()", () => {
		test("Returns success when no missing properties", () => {
			
		})
		test("Returns Succes when properties are added", () => {
			
		})
		test("Returns False when unable to add properties", () => {
			
		})
	})
	describe.skip("needsMoved()", () => {
		test("Returns False when file is already in destination", () => {
			
		})
		test("Retruns True and needed path when file needs moved", () => {
			
		})

	})
});
