import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Department } from '../Classes/Department';
import { CustomType } from '../BaseModel';

export class DepartmentContext extends Context {
    private department: Department;

    constructor (request: any) {
        super(request);
        this.department = Department.Parse(this, request.body["Entity"]);
    }

    public get Department(): Department {
        return this.department;
    }
}

export class DepartmnetRecordContext extends DepartmentContext {
    private record: CustomType;

    public get Record(): CustomType {
        return this.record;
    }

    constructor (request: any) {
        super(request);
        this.record = CustomType.Parse(this, request.body["RecordClassOid"], request.body["Record"]);
        Metadata.Add(this, request.body["RecordClassOid"], request.body["Metadata"]["Record"]);
    }
}    