import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

export class File extends BaseModel {
    private static ClassOid = "0f5b9a57-3968-4e5f-b719-5ee21a5510eb";

    protected filename: string = "";
    protected url: string = "";

    constructor (context: Context) {
        super(context);
        this.classOid = File.ClassOid;
    }

    public static Parse(context: Context, data: Array<any>): File {
        let obj = new File(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.filename = data["Url"];
            this.url = data["Filename"];
        }
    }

    public get Url() {
        return this.url;
    }

    public get Filename() {
        return this.filename;
    }

}