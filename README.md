# Note Classifier

Note Classifier sorts notes into folders using their tags and frontmatter. Run an update command when you want it to classify notes, move them, check required properties, and add configured classification or issue properties. It does not run automatically when a note is edited.

## Use cases

- Keep book notes together in folders based on frontmatter such as `Author`, `Series`, or `Genre`.
- Reorganize a vault by changing classification destinations and running **Update all files**.
- Identify notes that need attention by requiring properties such as `Author` or by limiting a property to a set of allowed values.

For example, a `Book` classification could match notes with `Type: Book`, move them into `Books/[Author|Unknown author]`, and require an `Author` property.

## Create a classification

1. Open **Settings → Note Classifier → Edit Classifications**.
2. Select **Add Classification**. Give it a name and a destination.
3. Under **Match Rules**, add one or more rules that identify the notes for this classification.
4. Under **Required Properties for this classification**, add properties the note should have.
5. To make a more specific classification, add it as a child classification. Child classifications inherit their parent’s required properties.
6. Run **Update active file** or **Update all files** to apply your changes.

Every rule on a classification must match. A classification with no rules matches any note, so add a rule unless you want it to act as a catch-all. For a parent with child classifications, a matching child is preferred; if no child matches, the parent is used. Keep top-level classifications distinct to avoid ambiguous matches.

## Classification options

- **Classification name** identifies the classification and is used as the value for the classification property when that setting is enabled.
- **Description** is an optional note to help you recognize the classification in settings.
- **Destination** sets the folder path for matching notes. See [Build a destination](#build-a-destination).
- **Match Rules** determine which notes qualify. See [Matching rules](#matching-rules).
- **Required Properties** check frontmatter and can add missing values when **Add Missing Properties** is enabled. A child classification also checks required properties inherited from its parents.
- **Property order** lets you enter comma-separated property names to set their order in updated frontmatter.
- **Child Classifications** let you refine a parent classification with more specific rules and destinations.

### Matching rules

Add rules under **Match Rules**. If a classification has multiple rules, the note must satisfy all of them.

#### Property rule

Matches when a frontmatter property has the specified value. Matching is exact and case-sensitive. For example, a rule for property `Type` and value `Book` matches `Type: Book`, but not `Type: book`.

#### Tag rule

Enter the tag without the leading `#`, such as `book` or `book/fiction`, then choose **Matching strictness**:

- **Matches exactly** matches the complete tag. For example, `book` matches `#book`, but not `#book/fiction`.
- **Inclusive match** matches a tag segment, including a segment in a nested tag. For example, `book` matches `#book/fiction`.

### Required properties

Each required property has a type:

- **Has Property** checks that the note has the named property. Set a **Default value** to use if the property is missing and **Add Missing Properties** is enabled.
- **Property is one of these values** checks the property against a comma-separated list of allowed values. Values are case-sensitive. Choose a **Default value** from the list to use when the property is missing and **Add Missing Properties** is enabled.

Missing required properties can be flagged. A property with a value outside its allowed values can be flagged as invalid. Use the **File Flags** settings to control those flags.

## Build a destination

Write destination folders as path segments separated by `/`. A segment can be a literal folder name or a frontmatter property:

- `Books` is a literal folder.
- `[Author]` uses the note’s `Author` property as the folder name.
- `[Author|Unknown author]` uses the `Author` value, or `Unknown author` when it is missing. This explicit fallback takes precedence over **Default Path fallback**.
- `*` as the first segment of a child destination inherits the parent classification’s destination.

For example, set the parent destination to `Projects/[Client|Unassigned]` and the child destination to `*/[Status|Inbox]`. A note with `Client: Acme` and no `Status` is moved to `Projects/Acme/Inbox`.

When a property segment has no explicit fallback, **Default Path fallback** controls what happens:

- **Property** uses the property name as the folder name when its value is missing. For example, `[Status]` becomes `Status`.
- **Skip** leaves the missing property segment empty.

The destination folders are created as needed when an update moves a note.

## Settings

### Classifications

Use **Edit Classifications** to add, edit, and organize classifications and their rules, required properties, destinations, and child classifications.

### Classification property

- **Add Classification Prop** adds the matched classification name to each updated note.
- **Classification Property** sets the frontmatter property used for that value (default: `NC_Class`).

### File flags

Flags are recorded in the property configured by **Notice Property** (default: `NC_Notice`).

- **Flag Unclassified Files** flags notes that match no classification.
- **Flag For default** flags notes that use the default fallback for a missing destination property.
- **Flag Missing Properties** flags notes missing required properties.
- **Flag Invalid Properties** flags notes whose required property values are not allowed.

### Notices

- **Summary Notice** shows a summary after an update command.
- **Error Notice** shows a notice when a file cannot be processed by a command.

### Behavior

- **Add Missing Properties** adds configured default values for missing required properties when notes are updated. It is off by default.
- **Default Path fallback** controls missing destination property segments that do not specify their own fallback. Choose **Property** or **Skip**.

### Ignored files and folders

- **Ignore property** sets the frontmatter property used to ignore a note (default: `NCP_Ignore`). Set it to `true` on a note to exclude it from updates.
- **Ignored Folders** lists folders to exclude from classification.

### Debugging

**Debug Mode** enables plugin logs in Obsidian’s developer tools. The **Turn on/off dev mode logs** command toggles more detailed logs.

## Commands

Run these from Obsidian’s command palette:

- **Update active file** classifies and updates the currently open note.
- **Update all files** classifies and updates all Markdown notes in the vault.
- **Ignore active file** marks the currently open note to be ignored.
- **Turn on/off dev mode logs** toggles detailed plugin logs.

You can also use the file explorer context menu to select **Ignore file** or **Ignore folder**, as well as **Update File** or **Update Folder**
