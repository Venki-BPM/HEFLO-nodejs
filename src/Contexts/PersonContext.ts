import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Person } from '../Classes/Person';
import { CustomType } from '../BaseModel';

export class PersonContext extends Context {
    private person: Person;

    constructor (request: any) {
        super(request);
        this.person = Person.Parse(this, request.body["Entity"]);
    }

    public get Person(): Person {
        return this.person;
    }
}

export class PersonRecordContext extends PersonContext {
    private record: CustomType;

    public get Record(): CustomType {
        return this.record;
    }

    constructor (request: any) {
        super(request);
        if (request.body["Record"]) {
            this.record = CustomType.Parse(this, request.body["RecordClassOid"], request.body["Record"]);
            Metadata.Add(this, request.body["RecordClassOid"], request.body["Metadata"]["Record"]);
        }
    }
}    