import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { ProcessVersion } from './ProcessVersion';
import { Person } from './Person';
import { IDictionary } from '../Types';

/**
* A Process represents an automated business workflow.
*/
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

    /**
    * Get the identifier of the object
    */
    protected GetKey(): string | number {
        return this.oid;
    }

    /**
    * Set the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {any} value - Current value of the custom field.
    */
    public Set(fieldName: string, value: any) {
        this.LogChange(Process.ClassOid, fieldName, this.oid, value);
    }

    /**
    * Get the identifier of the process
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the name of the process
    */
    public get Name(): string {
        return this.name;
    }

    /**
    * Get the identifier of the process owner
    */
    public get OwnerOid(): number | undefined {
        return this.ownerOid;
    }

    /**
    * Set the identifier of the process owner
    */
    public set OwnerOid(value: number | undefined) {
        this.ownerOid = value;
        this.context.addChange(Process.ClassOid, "OwnerOid", this.oid, value);
    }

    /**
    * Get the instance of the process owner
    */
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

    /**
    * Find a process by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Promise to get the object instance of a process.
    */
    public static async FindAsync(context: Context, id: number): Promise<Process> {
        return <Process>(await context.FindAsync(`${context.CacheRelational}odata/Process(${id})?$select=Oid,Name,OwnerOid&$selectCustom=true`,
            Process.ClassOid, (data: Array<any>) => { return Process.Parse(context, data); }));
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): Process {
        let obj = new Process(context);
        obj.Parse(data);
        return obj;
    }

    /**
    * Populate the object's fields with data from the record.
    * @param {IDictionary} data - A dictionary holding the record's data.
    */
    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.name = data["Name"];
            this.ownerOid = data["OwnerOid"];
        }
    }
}