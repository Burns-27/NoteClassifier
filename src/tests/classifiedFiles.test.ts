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
import { settingMocks } from './mocks/setting.mocks';

describe.skip('ClsFile', () => {
	let log:Record<string, unknown> ={}
	beforeAll(() => {
		
		/*jest.spyOn(devlog, 'test').mockImplementation(
			(thing, ...args: unknown[]) => {
				console.debug(`[${thing}]`, JSON.stringify(args, null, 2));
			},
		);
		jest.spyOn(devlog, "fallback").mockImplementation((type: string, info: Record<string, unknown>) => {
			console.debug(type, info)
		})*/
		jest.spyOn(devlog, 'loc').mockImplementation((loc, message?, info?) => {
			if (loc.startsWith("*")) {
				
				log[loc] = {message, info:JSON.stringify(info, null, 2)}
			}
    }
  )
	})
	beforeEach(() => {
		log = {}
	})
	describe('Static Create()', () => {
			beforeEach(() => {
				jest.clearAllMocks();
				settingUtil.updateAll(settingMocks)
			});

		test('Creates TClsFile when matching class ', () => {
			log.test = "ClsFile - Static Create - Returns success "
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
			log.test = "ClsFile - Static Create - Returns Fail w/no Match"
			const file = TestFiles.media
			jest.spyOn(appUtils, "getFileCache").mockReturnValue(file.metadataCache);
			(getAllTags as jest.Mock).mockReturnValue(file.tags);
			jest.spyOn(settingUtil, "matchCls").mockReturnValue({ success: false, message: "No matching Cls" })
			const clsNote = ClsFile.create(file.file)
			expect(clsNote.success).toBe(false)
		});
		test('Returns fail when no metadata', () => {
			log.test = "ClsFile - Static Create - Returns Fail w/no Metadata"
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
				log.test = "ClsFile - Creates Destination String - When Basic Path"
				const file = TestFiles.media;
				log.file = {
					metadata: file.metadataCache.frontmatter,
					tags:file.tags,
				}
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
			
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				const clsNote = ClsFile.create(file.file);

				log.noteRes = clsNote
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Made from Property Value", () => {
				log.test = "ClsFile - Creates Destination String - When made from Property Value"
				const file = TestFiles.project;
				log.file = {
					metadata: file.metadataCache.frontmatter,
					tags:file.tags,
				}
			jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
				file.metadataCache,
			);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				const clsNote = ClsFile.create(file.file);
				log.clsNote = clsNote
				expect(clsNote.success).toBe(true)
				if (clsNote.success) {
					expect(clsNote.note.destination).toEqual(file.expectedPath)
				}
			})
			test("When Nested with Parent Cls", () => {
				
log.test = "ClsFile - Creates Destination String - When Nested with parent Class"
				const file = TestFiles.articleGuide;
				log.file = {
					metadata: file.metadataCache.frontmatter,
					tags:file.tags,
				}
				jest.spyOn(appUtils, 'getFileCache').mockReturnValue(
					file.metadataCache,
				);
				(getAllTags as jest.Mock).mockReturnValue(file.tags);
				(normalizePath as jest.Mock).mockImplementation((input: string) => input);
				const clsNote = ClsFile.create(file.file);
				log.clsNote = clsNote
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
