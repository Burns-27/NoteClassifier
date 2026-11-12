jest.mocked('obsidian')
import { getAllTags, normalizePath } from 'obsidian';
import { ClsFile } from '../src/classification/ClassifiedFile';
import { debugLogArgs, devlog } from '../src/tools/logger';
import { settingUtil } from '../src/settings/settingsUtil';
import { appUtils } from '../src/tools/AppUtils';
import { TestFiles } from './mocks/FileMocks';
import { settingMocks } from './mocks/setting.mocks';

describe.skip('ClsFile', () => {
	let log:debugLogArgs[]= []
	beforeAll(() => {
		jest.spyOn(devlog, 'loc').mockImplementation((loc) => {
				log.push(loc)
    }
  )
	})
	beforeEach(() => {
		log = []
	})
	describe('Static Create()', () => {
			beforeEach(() => {
				jest.clearAllMocks();
				settingUtil.updateAll(settingMocks)
			});

		test('Creates TClsFile when matching class ', () => {
			console.debug("ClsFile - Static Create - Returns success ")
			const file = TestFiles.media;
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
			(getAllTags as jest.Mock).mockReturnValue(file.tags)
			
			const clsNote = ClsFile.create(file.file);
			expect(clsNote.success).toBe(true)
			if (clsNote.success) {
				expect(clsNote.note).toBeInstanceOf(ClsFile);
				expect(clsNote.note.classification).toBe(file.expectedClsName);
			}
		});
		test('Returns fail when no match', () => {
			console.debug("ClsFile - Static Create - Returns Fail w/no Match")
			const file = TestFiles.media
			jest.spyOn(appUtils, "getFileCache").mockReturnValue(file.metadataCache);
			(getAllTags as jest.Mock).mockReturnValue(file.tags);
			jest.spyOn(settingUtil, "matchCls").mockReturnValue({ success: false, message: "No matching Cls" })
			const clsNote = ClsFile.create(file.file)
			expect(clsNote.success).toBe(false)
		});
		test('Returns fail when no metadata', () => {
			console.debug("ClsFile - Static Create - Returns Fail w/no Metadata")
			const file = TestFiles.media
			jest.spyOn(appUtils, "getFileCache").mockReturnValue(null)
			const clsNote = ClsFile.create(file.file)
			expect(clsNote.success).toBe(false)
			if (!clsNote.success&&clsNote.message) {
				expect(clsNote.message).toBe('No Metadata found')
			}
		});
		describe("Creates Destination String", () => {
			beforeEach(() => {
				jest.clearAllMocks();
				settingUtil.updateAll(settingMocks)
			});
			test("When basic Path", () => {
				console.debug("ClsFile - Creates Destination String - When Basic Path") 
				const file = TestFiles.media;
				
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
			
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				const clsNote = ClsFile.create(file.file);

			
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Made from Property Value", () => {
				console.debug("ClsFile - Creates Destination String - When made from Property Value")
				const file = TestFiles.project;
				
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				const clsNote = ClsFile.create(file.file);
				
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Nested with Parent Cls", () => {
				console.debug("ClsFile - Creates Destination String - When Nested with parent Class")
				const file = TestFiles.articleGuide;
				jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
					file.metadataCache,
				);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
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
	afterEach(() => {
		console.debug(log)
	})
});
