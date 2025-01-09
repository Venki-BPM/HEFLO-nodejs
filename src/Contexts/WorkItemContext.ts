import { Metadata } from '../Metadata';
import { CustomType } from '../BaseModel';
import { File } from '../Classes/File';
import { TokenWorkItemContext } from './TokenWorkItemContext';

/**
 * Contextual information for customizations of record lists used in business process instances such as: 
 * - Initialization of record lists.
 * - Removed rows in a record list.
 * - A button click in the edition of a record list.
 */
export class WorkItemRecordContext extends TokenWorkItemContext {
    private record: CustomType;

    public get Record(): CustomType {
        return this.record;
    }

    constructor(request: any) {
        super(request);
        if (request.body["Record"]) {
            this.record = CustomType.Parse(this, request.body["RecordClassOid"], request.body["Record"]);
            Metadata.Add(this, request.body["RecordClassOid"], request.body["Metadata"]["Record"]);
        }
    }
}

/**
 * Contextual information for customizations of files used in business process instances such as: 
 * - User atttached a file.
 * - User removed an attached file.
 */
export class WorkItemFileContext extends TokenWorkItemContext {
    private file: File;

    public get File(): File {
        return this.file;
    }

    constructor(request: any) {
        super(request);
        this.file = File.Parse(this, request.body["File"]);
    }
}
