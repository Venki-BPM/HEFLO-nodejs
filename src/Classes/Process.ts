import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { ProcessVersion } from './ProcessVersion';
import { Person } from './Person';
import { IDictionary } from '../Types';

export class Process extends BaseModel {
    public static ClassOid = "82b7b003-ace3-4a5b-a20b-5acae69702ea";
    public static ClassName = "Venki.Process.Process";

    protected oid: number = 0;
    protected name: string = "";
    protected ownerOid?: number;

    constructor(context: Context) {
        super(context);
        this.classOid = Process.ClassOid;
    }

    protected GetKey(): string | number {
        return this.oid;
    }

    public Set(fieldName: string, value: any) {
        this.LogChange(Process.ClassOid, fieldName, this.oid, value);
    }

    public get Oid(): number {
        return this.oid;
    }

    public get Name(): string {
        return this.name;
    }

    public get OwnerOid(): number | undefined {
        return this.ownerOid;
    }

    public set OwnerOid(value: number | undefined) {
        this.ownerOid = value;
        this.context.addChange(Process.ClassOid, "OwnerOid", this.oid, value);
    }

    public async GetOwnerAsync(context: Context): Promise<Person | undefined> {
        if (this.ownerOid)
            return Person.FindAsync(context, this.ownerOid);
        else
            return undefined;
    }

    public async GetVersionsAsync(context: Context): Promise<Array<ProcessVersion>> {
        return <Array<ProcessVersion>>(await context.FindAllAsync(`${context.CacheRelational}odata/ProcessVersion/?$filter=ProcessOid eq ${this.Oid}&$selectCustom=true`,
            ProcessVersion.ClassOid, (data: Array<any>) => { return ProcessVersion.Parse(context, data); }));
    }

    public static async FindAsync(context: Context, id: number): Promise<Process> {
        return <Process>(await context.FindAsync(`${context.CacheRelational}odata/Process(${id})?$select=Oid,Name,OwnerOid&$selectCustom=true`,
            Process.ClassOid, (data: Array<any>) => { return Process.Parse(context, data); }));
    }

    public static Parse(context: Context, data: Array<any>): Process {
        let obj = new Process(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.name = data["Name"];
            this.ownerOid = data["OwnerOid"];
        }
    }
}