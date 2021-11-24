import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Account } from './Account';
import { IDictionary } from '../Types';

import * as NodeCache from 'node-cache';
const cache = new NodeCache();

export class Person extends Account {
    public static ClassOid = "8c6f3260-c030-40a7-8d60-60142fdef2a5";
    public static ClassName = "Venki.Organization.Person";

    protected departmentOid: number | undefined;

    constructor (context: Context) {
        super(context);
        this.classOid = Person.ClassOid;
    }

    public Set(fieldName: string, value: any) {
        this.LogChange(Person.ClassOid, fieldName, this.oid, value);
    }

    public get DepartmentOid(): number | undefined {
        return this.departmentOid;
    }

    public set DepartmentOid(value: number | undefined) {
        this.departmentOid = value;
        this.context.addChange(Person.ClassOid, "DepartmentOid", this.oid, value);
    }
    
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

    public static async NewAsync(context: Context): Promise<Person> {
        await Metadata.CheckAsync(context, Person.ClassOid);
        let person = new Person(context);
        person.isNew = true;
        return person;
    }
}
