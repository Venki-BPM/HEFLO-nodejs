import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

export class FlowElement extends BaseModel {
    public static ClassOid = "570aa234-7d33-46a5-a96d-5b2753d1a813";
    protected oid: number = 0;
    protected uniqueCode?: string;
    protected label?: string;

    constructor (context: Context) {
        super(context);
        this.classOid = FlowElement.ClassOid;
    }

    protected GetKey(): string | number {
        return this.oid;
    }

    public get Oid(): number {
        return this.oid;
    }

    public get Label(): string | undefined {
        return this.label;
    }

    public get UniqueCode(): string | undefined {
        return this.uniqueCode;
    }

    public static Parse(context: Context, data: Array<any>): FlowElement {
        let obj = new FlowElement(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.label = data["Label"];
            this.uniqueCode = data["UniqueCode"];
        }
    }

    public static async FindAsync(context: Context, id: number): Promise<FlowElement> {
        return <FlowElement>(await context.FindAsync(`${context.CacheRelational}odata/FlowElement(${id})?$select=Oid,Label,UniqueCode&$selectCustom=true`, 
            FlowElement.ClassOid, (data: Array<any>) => { return FlowElement.Parse(context, data); } ));
    }
}