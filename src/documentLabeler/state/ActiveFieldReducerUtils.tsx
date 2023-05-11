import {
  ActiveField,
  DocumentLabelerInternalState,
} from 'documentLabeler/state/DocumentLabelerState';

export type SetActiveFieldAction = {
  type: 'setActiveField';
  payload: ActiveField | undefined;
};

export type SetState = {
  type: 'setState';
  payload: DocumentLabelerInternalState;
};

const setActiveField = (
  state: DocumentLabelerInternalState,
  action: SetActiveFieldAction,
): DocumentLabelerInternalState => {
  return {
    ...state,
    localState: {
      ...state.localState,
      activeField: action.payload,
      fieldViewing: undefined,
    },
  };
};

export const ActiveFieldReducerUtils = {
  setActiveField,
};
