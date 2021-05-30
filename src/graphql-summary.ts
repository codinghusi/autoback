import { ASTKindToNode, ASTNode, DocumentNode, NameNode, OperationDefinitionNode, VariableDefinitionNode, VariableNode } from "graphql";

interface Node {
    kind: string;
    [key: string]: Node | string | number
}

// FIXME: bad types
const collectGroups = (field: string) => {
    return (list: readonly any[]) => {
        const result: Record<string, any[]> = {};

        Object.values(list).forEach(item => {
            const id = item[field] as string;
            
            if (id in result) {
                result[id].push(item);
                return;
            }

            result[id] = [ item ];
        });

        return result;
    }
}

function mapKeys<T, R>(data: Record<string, T>, mappers: Record<string, (value: T) => R>) {
    const result = Object.fromEntries(Object.entries(mappers).map(([key, fn]) => {
        const value = data[key];
        if (!value) {
            return []; // FIXME: not nice: results to { ..., undefined: undefined }
        }

        const result = fn(value);

        return [key, result];
    }));

    return {
        ...data,
        ...result
    };
}

function serializeArray<T>(array: readonly T[], serializer: (node: T) => any) {
    if (!array.length) {
        return [];
    }
    return array.map(item => {
        const serializer = (Serializer as any)[(item as any).kind];
        
    });
}

function serializeArrayToObject<T>(array: readonly T[], serializer: (node: T) => any) {
    return Object.fromEntries(array.map(serializer));
}

function serialize(data: any) {
    
}

const Serializer = {
    Name(name: NameNode) {
        return name.value;
    },

    Variable(variable: VariableNode) {
        return this.Name(variable.name);
    },

    VariableDefinition(variableDefinition: VariableDefinitionNode) {
        const name = this.Variable(variableDefinition.variable);
        return [
            name,
            {
                node: variableDefinition,
                name,
                type: 
            }
        ]
    },

    OperationDefinition(operation: OperationDefinitionNode) {
        return [
            operation.name ?? 'default',
            {
                node: operation,
                name: operation.name,
                parameters: serializeArray(operation.variableDefinitions, this.VariableDefinition)
            }
        ]
    }
}

// function serializeParameters(variableDefinitions: ReadonlyArray<VariableDefinitionNode>) {
//     return Object.fromEntries(variableDefinitions.map(variable => {
//         const key = variable.variable.name.value;
//         const defaultValue = variable.defaultValue;

//     }));
// }

export function graphqlSummary(document: DocumentNode) {
    const definitions = collectGroups('kind')(document.definitions);
    const operations = collectGroups('operation')(definitions.OperationDefinition);
    const fragments = definitions.FragmentNode;

    return operations;
}