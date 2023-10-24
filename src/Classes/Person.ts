import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Account } from './Account';
import { IDictionary } from '../Types';

export class Person extends Account {
    public static ClassOid = "8c6f3260-c030-40a7-8d60-60142fdef2a5";
    public static ClassName = "Venki.Organization.Person";

    protected departmentOid: number | undefined;

    constructor (context: Context) {
        super(context);
        this.classOid = Person.ClassOid;
    }

    /**
    * Set the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {any} value - Current value of the custom field.
    */
    public Set(fieldName: string, value: any) {
        this.LogChange(Person.ClassOid, fieldName, this.oid, value);
    }

    /**
    * Get the identifier of the account department
    */
    public get DepartmentOid(): number | undefined {
        return this.departmentOid;
    }

    /**
    * Set the identifier of the account department
    */
    public set DepartmentOid(value: number | undefined) {
        this.departmentOid = value;
        this.context.addChange(Person.ClassOid, "DepartmentOid", this.oid, value);
    }
    
    /**
    * Find a person by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Object instance of a person.
    */
    public static async FindAsync(context: Context, id: number): Promise<Person> {
        return <Person>(await context.FindAsync(`${context.StorageRelational}odata/Person(${id})?$select=Oid,Name,Email,DepartmentOid&$selectCustom=true`, 
            Person.ClassOid, (data: Array<any>) => { return Person.Parse(context, data); } ));
    }

    public static async WhereAsync(context: Context, filter: string, useCache: boolean = true): Promise<Array<Person>> {
        return <Array<Person>> await context.WhereAsync(Person.ClassOid, 
            `${context.StorageRelational}odata/Person?$select=Oid,Name,Email,DepartmentOid&$filter=(${filter})&$selectCustom=true`, filter, 
            (data: Array<any>) => { return Person.Parse(context, data); }, useCache);
    }

    public static Parse(context: Context,data: Array<any>): Person {
        let obj = new Person(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.departmentOid = data["DepartmentOid"];
        }
    }

    /**
    * Save all pending changes of the person.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    */
    public async SaveAsync(context: Context): Promise<number> {

        if (this.isNew) {
            let payload = {
                Oid: this.Oid,
                Name: this.Name,
                Email: this.Email,
                DepartmentOid: this.DepartmentOid,
                RecordKind: "Person",
            }

            this.Parse(await context.PostAsync(this.GetStorageEndPoint(), payload, this.fields));
        } else {
            await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`Person(${this.oid})`]);
        }

        return this.Oid;
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/Person(${this.oid})`;
        else
            return `${this.context.StorageRelational}odata/Person`;
    } 

    /**
    * Create a new instance of a person and initialize all metadata to it.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Object instance of a person
    */
    public static async NewAsync(context: Context): Promise<Person> {
        await Metadata.CheckAsync(context, Person.ClassOid);
        let person = new Person(context);
        person.isNew = true;
        return person;
    }
}
