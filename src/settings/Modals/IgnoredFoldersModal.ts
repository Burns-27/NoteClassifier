import { FuzzySuggestModal} from 'obsidian';
import { setUtil } from '../settings';
import NoteClassifier from '../../main';

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
        setUtil.ignoredFoldersSet.add(folder);
        void this.ncp.saveSettings();
        console.debug('Ignored Folder Set after add', setUtil.ignoredFoldersSet)
        this.update()
    }
}

