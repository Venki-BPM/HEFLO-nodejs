import { CustomContext, CustomRecordContext } from './Contexts/CustomContext';
import { WorkItemRecordContext, WorkItemFileContext } from './Contexts/WorkItemContext';
import { TokenWorkItemContext, TokenWorkItemExecuteContext, TokenWorkItemBeforeInitContext } from './Contexts/TokenWorkItemContext';
import { DepartmentRecordContext, DepartmentContext } from './Contexts/DepartmentContext';
import { PersonRecordContext, PersonContext } from './Contexts/PersonContext';

/**
 * Events of business process instances.
 */
export module Events.WorkItem {
    /**
     * Initialize the content of a new row in a record lists.
     */
    export class OnInitRecordList extends WorkItemRecordContext { }
    /**
     * Record list row added.
     */
    export class OnAddedRecord extends WorkItemRecordContext { }
    /**
     * Record list row changed.
     */
    export class OnRecordChanged extends WorkItemRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRemovedRecord extends WorkItemRecordContext { }
    /**
     * File attached to a business process instance.
     */
    export class OnAddedFile extends WorkItemFileContext { }
    /**
     * File removed from the business process instance.
     */
    export class OnRemovedFile extends WorkItemFileContext { }
    /**
     * Business process instance changed. It is fired when the user change the value of a field.
     */
    export class OnChanged extends TokenWorkItemContext { }
    /**
     * Button clicked.
     */
    export class OnTrigger extends WorkItemRecordContext { }
    /**
     * Execution of a sequence flow (transition to the next task).
     */
    export class OnExecuteSequenceFlow extends TokenWorkItemExecuteContext { }
    /**
    * @deprecated Revert a sequence flow (transtion to the previous task)
    */
    export class OnResourceCalculation extends TokenWorkItemExecuteContext { }
    /**
     * Determine whether the business process instance should be created.
     */
    export class BeforeInit extends TokenWorkItemBeforeInitContext { }
}

/**
 * Events of custom entities.
 */
export module Events.Custom {
    /**
     * Initialize the content of a new row in a record lists.
     */
    export class OnInitRecordList extends CustomRecordContext { }
    /**
     * Record list row added.
     */
    export class OnAddedRecord extends CustomRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRecordChanged extends CustomRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRemovedRecord extends CustomRecordContext { }
    /**
     * Record changed. It is fired when the user change the value of a field.
     */
    export class OnChanged extends CustomContext { }
    /**
     * Button clicked.
     */
    export class OnTrigger extends CustomRecordContext { }
}

/**
 * Events of Department records.
 */
export module Events.Department {
    /**
     * Initialize the content of a new row in a record lists.
     */
    export class OnInitRecordList extends DepartmentRecordContext { }
    /**
     * Record list row added.
     */
    export class OnAddedRecord extends DepartmentRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRecordChanged extends DepartmentRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRemovedRecord extends DepartmentRecordContext { }
    /**
     * Department changed. It is fired when the user change the value of a field.
     */
    export class OnChanged extends DepartmentContext { }
    /**
     * Button clicked.
     */
    export class OnTrigger extends DepartmentRecordContext { }
}

/**
 * Events of People records.
 */
export module Events.Person {
    /**
     * Initialize the content of a new row in a record lists.
     */
    export class OnInitRecordList extends PersonRecordContext { }
    /**
     * Record list row added.
     */
    export class OnAddedRecord extends PersonRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRecordChanged extends PersonRecordContext { }
    /**
     * Record list row removed.
     */
    export class OnRemovedRecord extends PersonRecordContext { }
    /**
     * Person changed. It is fired when the user change the value of a field.
     */
    export class OnChanged extends PersonContext { }
    /**
     * Button clicked.
     */
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
