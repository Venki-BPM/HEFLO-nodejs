import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

export class ProcessVersion extends BaseModel {
    public static ClassOid = "2e5cea47-1086-4510-b765-0efe27906970";
    public Oid: number = 0;
    public Number: number = 0;

    constructor(context: Context) {
        super(context);
        this.classOid = ProcessVersion.ClassOid;
    }

    /**
    * Get the identifier of the object
    */
    protected GetKey(): string | number {
        return this.Oid;
    }

    public static Parse(context: Context, data: Array<any>): ProcessVersion {
        let obj = new ProcessVersion(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.Oid = data["Oid"];
            this.Number = data["Number"];
        }
    }
}