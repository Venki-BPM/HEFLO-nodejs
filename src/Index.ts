import { CustomRecordContext } from './Contexts/CustomContext';
import { WorkItemRecordContext, WorkItemFileContext } from './Contexts/WorkItemContext';
import { TokenWorkItemContext, TokenWorkItemExecuteContext } from './Contexts/TokenWorkItemContext';
import { DepartmnetRecordContext, DepartmentContext } from './Contexts/DepartmentContext';

export module Events.WorkItem {
    export class OnInitRecordList extends WorkItemRecordContext { }
    export class OnAddedRecord extends WorkItemRecordContext { }
    export class OnRemovedRecord extends WorkItemRecordContext { }
    export class OnAddedFile extends WorkItemFileContext { }
    export class OnRemovedFile extends WorkItemFileContext { }
    export class OnChanged extends TokenWorkItemContext { }
    export class OnTrigger extends TokenWorkItemContext { }
    export class OnExecuteSequenceFlow extends TokenWorkItemExecuteContext { }
    export class OnResourceCalculation extends TokenWorkItemExecuteContext { }
}

export module Events.Custom {
    export class OnInitRecordList extends CustomRecordContext { }
    export class OnAddedRecord extends CustomRecordContext { }
    export class OnRemovedRecord extends CustomRecordContext { }
    export class OnTrigger extends CustomRecordContext { }
}

export module Events.Department {
    export class OnInitRecordList extends DepartmnetRecordContext { }
    export class OnAddedRecord extends DepartmnetRecordContext { }
    export class OnRemovedRecord extends DepartmnetRecordContext { }
    export class OnChanged extends DepartmentContext { }
    export class OnTrigger extends DepartmentContext { }
}

export * from './Classes/Department'
export { BaseModel, CustomType } from './BaseModel'
export * from './Classes/Account'
export * from './Classes/File'
export * from './Classes/FlowElement'
export * from './Classes/Person'
export * from './Classes/Process'
export * from './Classes/ProcessVersion'
export * from './Classes/Token'
export * from './Classes/WorkItem'
export * from './Context'
export {Status, TokenStatus} from './Types'
