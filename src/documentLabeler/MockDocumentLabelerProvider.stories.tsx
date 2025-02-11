/* eslint-disable storybook/default-exports */

import React, { useReducer } from 'react';
import {
  DocumentLabelerDispatchContext,
  DocumentLabelerStateContext,
} from 'documentLabeler/DocumentLabelerProvider';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import { documentLabelerReducer } from 'documentLabeler/state/DocumentLabelerReducer';
import {
  DocumentLabelerInternalState,
  DocumentLabelerState,
} from 'documentLabeler/state/DocumentLabelerState';

type Props = {
  children?: React.ReactNode;
  internalState?: DocumentLabelerInternalState;
};

/**
 * Takes in an internal state of the Document Labeler Provider to allow for
 * testing of internal components with particular state configurations.
 */
export const MockDocumentLabelerProvider: React.FC<Props> = ({
  children,
  internalState,
}) => {
  const [state, dispatch] = useReducer(
    documentLabelerReducer,
    internalState === undefined
      ? DocumentLabelerState.generateInitialState(
          {
            data: MockDocumentLabelerData.documentLabelerData,
            config: {} as any,
          },
          null,
        )
      : internalState,
  );

  return (
    <DocumentLabelerStateContext.Provider value={state}>
      <DocumentLabelerDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentLabelerDispatchContext.Provider>
    </DocumentLabelerStateContext.Provider>
  );
};
