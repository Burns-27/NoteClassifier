import { FuzzySuggestModal} from 'obsidian';
import { settings } from '../settings/settings';
import NoteClassifier from '../main';
import { ignore } from './ignoreUtil';

export class IgnoredFolderModal extends FuzzySuggestModal<string> {
    private ncp: NoteClassifier
    private update: ()=>void
    constructor(ncp:NoteClassifier, update:()=>void) {
        super(ncp.app);
        this.ncp = ncp;
        this.update = update
        this.setPlaceholder('Type to find folders...');
    }

    getItems(): string[] {
        const allTFolders = this.app.vault.getAllFolders().map((f)=>({name:f.name, path:f.path}))
        return allTFolders.map((f) => f.path);
    }

    getItemText(folder: string): string {
        return folder;
    }

    onChooseItem(folder: string, evt: MouseEvent | KeyboardEvent): void {
        ignore.markFolder(folder)
        void this.ncp.saveSettings();
        console.debug('Ignored Folder Set after add', settings.ignoredFoldersSet)
        this.update()
    }
}

