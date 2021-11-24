import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { CustomType } from '../BaseModel';

export class CustomContext extends Context {
    private entity: CustomType;

    constructor(request: any) {
        super(request);
        this.entity = CustomType.Parse(this, request.body["ClassOid"], request.body["Entity"]);
        Metadata.Add(this, request.body["ClassOid"], request.body["Metadata"]["Entity"]);
    }

    public get Entity(): CustomType {
        return this.entity;
    }
}

export class CustomRecordContext extends CustomContext {
    private record: CustomType;

    public get Record(): CustomType {
        return this.record;
    }

    constructor(request: any) {
        super(request);
        this.record = CustomType.Parse(this, request.body["ClassOid"], request.body["Entity"]);
        Metadata.Add(this, request.body["ClassOid"], request.body["Metadata"]["Entity"]);
    }
}

export class OnChangedCustom extends CustomContext {

}