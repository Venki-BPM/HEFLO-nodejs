import { CustomContext, CustomRecordContext } from './Contexts/CustomContext';
import { WorkItemRecordContext, WorkItemFileContext } from './Contexts/WorkItemContext';
import { TokenWorkItemContext, TokenWorkItemExecuteContext, TokenWorkItemBeforeInitContext } from './Contexts/TokenWorkItemContext';
import { DepartmentRecordContext, DepartmentContext } from './Contexts/DepartmentContext';
import { PersonRecordContext, PersonContext } from './Contexts/PersonContext';

export module Events.WorkItem {
    export class OnInitRecordList extends WorkItemRecordContext { }
    export class OnAddedRecord extends WorkItemRecordContext { }
    export class OnRecordChanged extends WorkItemRecordContext { }
    export class OnRemovedRecord extends WorkItemRecordContext { }
    export class OnAddedFile extends WorkItemFileContext { }
    export class OnRemovedFile extends WorkItemFileContext { }
    export class OnChanged extends TokenWorkItemContext { }
    export class OnTrigger extends WorkItemRecordContext { }
    export class OnExecuteSequenceFlow extends TokenWorkItemExecuteContext { }
    export class OnResourceCalculation extends TokenWorkItemExecuteContext { }
    export class BeforeInit extends TokenWorkItemBeforeInitContext { }
}

export module Events.Custom {
    export class OnInitRecordList extends CustomRecordContext { }
    export class OnAddedRecord extends CustomRecordContext { }
    export class OnRecordChanged extends CustomRecordContext { }
    export class OnRemovedRecord extends CustomRecordContext { }
    export class OnChanged extends CustomContext { }
    export class OnTrigger extends CustomRecordContext { }
}

export module Events.Department {
    export class OnInitRecordList extends DepartmentRecordContext { }
    export class OnAddedRecord extends DepartmentRecordContext { }
    export class OnRecordChanged extends DepartmentRecordContext { }
    export class OnRemovedRecord extends DepartmentRecordContext { }
    export class OnChanged extends DepartmentContext { }
    export class OnTrigger extends DepartmentRecordContext { }
}

export module Events.Person {
    export class OnInitRecordList extends PersonRecordContext { }
    export class OnAddedRecord extends PersonRecordContext { }
    export class OnRecordChanged extends PersonRecordContext { }
    export class OnRemovedRecord extends PersonRecordContext { }
    export class OnChanged extends PersonContext { }
    export class OnTrigger extends PersonRecordContext { }
}

export * from './Classes/Department'
export { BaseModel, CustomType } from './BaseModel'
export * from './Classes/Account'
export * from './Classes/File'
export * from './Classes/FlowElement'
export * from './Classes/Person'
export * from './Classes/Group'
export * from './Classes/Process'
export * from './Classes/ProcessVersion'
export * from './Classes/Token'
export * from './Classes/WorkItem'
export * from './Context'
export {Status, TokenStatus} from './Types'
