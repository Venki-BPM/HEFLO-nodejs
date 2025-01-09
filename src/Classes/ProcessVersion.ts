import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

/**
* A ProcessVersion represents a specific version of a business process.
*/
export class ProcessVersion extends BaseModel {
    public static ClassOid = "2e5cea47-1086-4510-b765-0efe27906970";
    public Oid: number = 0;
    public Number: number = 0;

    /**
     * Create a new instance of the type ProcessVersion. This constructor is used by the library's code and should not be used by API users.
     * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
     */
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

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): ProcessVersion {
        let obj = new ProcessVersion(context);
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
            this.Oid = data["Oid"];
            this.Number = data["Number"];
        }
    }
}