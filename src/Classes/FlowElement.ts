import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

/**
* A FlowElement is a BPMN component within a business process.
*/
export class FlowElement extends BaseModel {
    public static ClassOid = "570aa234-7d33-46a5-a96d-5b2753d1a813";
    protected oid: number = 0;
    protected uniqueCode?: string;
    protected label?: string;

    constructor (context: Context) {
        super(context);
        this.classOid = FlowElement.ClassOid;
    }

    /**
    * Get the identifier of the object
    */
    protected GetKey(): string | number {
        return this.oid;
    }

    /**
    * Get the identifier of the flow element
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the label of the flow element
    */
    public get Label(): string | undefined {
        return this.label;
    }

    /**
    * Get the unique code of the flow element. This code is used in many tasks of customization or reports.
    */
    public get UniqueCode(): string | undefined {
        return this.uniqueCode;
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): FlowElement {
        let obj = new FlowElement(context);
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
            this.label = data["Label"];
            this.uniqueCode = data["UniqueCode"];
        }
    }

    /**
    * Find a flow element by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Promise to get the object instance of a flow element.
    */
    public static async FindAsync(context: Context, id: number): Promise<FlowElement> {
        return <FlowElement>(await context.FindAsync(`${context.CacheRelational}odata/FlowElement(${id})?$select=Oid,Label,UniqueCode&$selectCustom=true`, 
            FlowElement.ClassOid, (data: Array<any>) => { return FlowElement.Parse(context, data); } ));
    }
}