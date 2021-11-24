import { Metadata } from '../Metadata';
import { CustomType } from '../BaseModel';
import { File } from '../Classes/File';
import { TokenWorkItemContext } from './TokenWorkItemContext';
import { FlowElement } from '../Classes/FlowElement';

export class WorkItemRecordContext extends TokenWorkItemContext {
    private record: CustomType;

    public get Record(): CustomType {
        return this.record;
    }

    constructor(request: any) {
        super(request);
        this.record = CustomType.Parse(this, request.body["RecordClassOid"], request.body["Record"]);
        Metadata.Add(this, request.body["RecordClassOid"], request.body["Metadata"]["Record"]);
    }
}

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
