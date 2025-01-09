import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { BaseModel } from '../BaseModel';
import { Person } from './Person';
import { IDictionary } from '../Types';

/**
* A Department is a functional area or business unit within an organization.
*/
export class Department extends BaseModel {
    public static ClassOid = "9da7d39b-0747-4825-8302-3f5248685c0c";
    public static ClassName = "Venki.Organization.Department";
    private oid: number = 0;
    private name: string = "";
    private managerOid?: number;
    private parentDepartmentOid?: number;
    private code: string = "";

    constructor(context: Context) {
        super(context);
        this.classOid = Department.ClassOid;
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
        this.LogChange(Department.ClassOid, fieldName, this.oid, value);
    }

    /**
    * Get the identifier of the department
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the name of the department
    */
    public get Name(): string {
        return this.name;
    }

    /**
    * Set the name of the department
    */
    public set Name(value: string) {
        this.name = value;
        this.context.addChange(Department.ClassOid, "Name", this.oid, value);
    }

    /**
    * Get the identifier of the department manager
    */
    public get ManagerOid(): number | undefined {
        return this.managerOid;
    }

    /**
    * Set the identifier of the department manager
    */
    public set ManagerOid(value: number | undefined) {
        this.managerOid = value;
        this.context.addChange(Department.ClassOid, "ManagerOid", this.oid, value);
    }

    /**
    * Get the instance of the department manager
    */
    public async GetManagerAsync(context: Context): Promise<Person | undefined> {
        if (this.managerOid)
            return Person.FindAsync(context, this.managerOid);

        return undefined;
    }

    /**
    * Get the identifier of the parent department
    */
    public get ParentDepartmentOid(): number | undefined {
        return this.parentDepartmentOid;
    }

    /**
    * Set the identifier of the parent department
    */
    public set ParentDepartmentOid(value: number | undefined) {
        this.parentDepartmentOid = value;
        this.context.addChange(Department.ClassOid, "ParentDepartmentOid", this.oid, value);
    }

    /**
    * Get the instance of the parent department
    */
    public async GetParentDepartmentAsync(context: Context): Promise<Department | undefined> {
        if (this.parentDepartmentOid)
            return Department.FindAsync(context, this.parentDepartmentOid);

        return undefined;
    }

    /**
    * Get the code of the department
    */
    public get Code(): string {
        return this.code;
    }

    /**
    * Set the code of the department
    */
    public set Code(value: string) {
        this.code = value;
        this.context.addChange(Department.ClassOid, "Code", this.oid, value);
    }

    /**
    * Find a department by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Promise to get the object instance of a department.
    */
    public static async FindAsync(context: Context, id: number): Promise<Department> {
        return <Department>(await context.FindAsync(`${context.StorageRelational}odata/Department(${id})?$select=Oid,Name,ManagerOid,ParentDepartmentOid,Code&$selectCustom=true`,
            Department.ClassOid, (data: Array<any>) => { return Department.Parse(context, data); }));
    }

    /**
    * Search for objects using filter criteria. To create the filter, use a condition that follows the OData filter syntax and includes the available fields fields in the environment.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {string} filter - A filter expression following the OData filter syntax.
    * @param {boolean} useCache - It stores the content in a local cache for later reuse. The cache lifespan is approximately 600 seconds.
    * @returns Promise to get the a list of objects retrieved from the backend based on the search criteria. Note: the retrieval is limited to a maximum of 1,000 records.
    */
    public static async WhereAsync(context: Context, filter: string, useCache: boolean = true): Promise<Array<Department>> {
        return <Array<Department>> await context.WhereAsync(Department.ClassOid, 
            `${context.StorageRelational}odata/Department?$select=Oid,Name,ManagerOid,ParentDepartmentOid,Code&$filter=(${filter})&$selectCustom=true`, filter, 
            (data: Array<any>) => { return Department.Parse(context, data); }, useCache);
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): Department {
        let obj = new Department(context);
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
            this.managerOid = data["ManagerOid"];
            this.parentDepartmentOid = data["ParentDepartmentOid"];
            this.code = data["Code"];
        }
    }

    /**
    * Save all pending changes of the department.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Identifier of the saved record.
    */
    public async SaveAsync(context: Context): Promise<number | string> {

        if (this.isNew) {
            let payload = {
                Oid: this.Oid,
                Name: this.Name,
                ManagerOid: this.ManagerOid,
                ParentDepartmentOid: this.parentDepartmentOid,
                Code: this.code   
            }

            this.Parse(await context.PostAsync(this.GetStorageEndPoint(), payload, this.fields));
            return this.oid;
        } else {
            await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`Department(${this.oid})`]);
        }

        return this.Oid;
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/Department(${this.oid})`;
        else
            return `${this.context.StorageRelational}odata/Department`;
    }

    /**
    * Create a new instance of a department and initialize all metadata to it.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Promise to get the object instance of a department
    */
    public static async NewAsync(context: Context): Promise<Department> {
        await Metadata.CheckAsync(context, Department.ClassOid);
        let department = new Department(context);
        department.isNew = true;
        return department;
    }
}