import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DuplicateDocumentActionComponent,
} from "sanity";
import { withoutPublicationDate } from "../../shared/content.ts";

export function resetDuplicatePublication(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const duplicate = original as DuplicateDocumentActionComponent;
  const action: DocumentActionComponent = (props) =>
    duplicate({ ...props, mapDocument: withoutPublicationDate });
  action.action = "duplicate";
  return action;
}

// Keep Sanity's validation, pending and error handling in the native publish action.
export function stampFirstPublication(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const action: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type);
    const native = original(props);
    if (!native) return null;
    return {
      ...native,
      onHandle: () => {
        patch.execute([
          {
            setIfMissing: {
              publishedAt:
                props.published?.publishedAt ?? new Date().toISOString(),
            },
          },
        ]);
        native.onHandle?.();
      },
    };
  };
  action.action = "publish";
  return action;
}
