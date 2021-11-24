import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Token } from '../Classes/Token';
import { FlowElement } from '../Classes/FlowElement';
import { WorkItem } from '../Classes/WorkItem';

export class TokenWorkItemContext extends Context {
    private token: Token;
    private workitem: WorkItem;

    constructor (request: any) {
        super(request);
        Metadata.Add(this, WorkItem.ClassOid, request.body["Metadata"]["WorkItem"]);
        Metadata.Add(this, Token.ClassOid, request.body["Metadata"]["Token"]);
        this.workitem = WorkItem.Parse(this, request.body["WorkItem"]);
        this.token = Token.Parse(this, request.body["Token"]);
        this.token.WorkItem = this.workitem;
    }

    public get Token(): Token {
        return this.token;
    }

    public get WorkItem(): WorkItem {
        return this.workitem;
    }
}

export class TokenWorkItemExecuteContext extends TokenWorkItemContext {
    private source: FlowElement;
    private target: FlowElement;

    public get Source(): FlowElement {
        return this.source;
    }

    public get Target(): FlowElement {
        return this.target;
    }

    constructor(request: any) {
        super(request);
        this.source = FlowElement.Parse(this, request.body["Source"]);
        this.target = FlowElement.Parse(this, request.body["Target"]);
    }
}