import {
  BlockDto,
  Confidence,
  TrainingDocumentLabelsDto,
  DocumentLabelerOutputDataDto,
  ExtractedFieldDto,
  ExtractedTableDto,
  ExtractionResultDto,
  FieldLabelOutputDto,
  FieldType,
  LabelDto,
  MimeType,
  SignatureLabelOutputDto,
  TableLabelOutputDto,
} from 'common/types/DocumentLabelerTypes';
import { FieldsPanelDisplayUtils } from 'documentLabeler/common/util/FieldsPanelDisplayUtils';
import { BBConfigurations } from 'documentLabeler/context/BBConfigurationProvider';
import { ZOOM_VALUES } from 'documentLabeler/constants/DocumentLabelerConstants';

// Initial data passed in from external api calls to generate Internal State.
export type DocumentLabelerData = {
  modelId: string;
  documentId: string;
  fileName: string;
  mimeType: MimeType;
  tempDocUrl: string;
  wordBlocks: Array<BlockDto>;
  results: LabelDto;
};

export type ActiveCell = {
  columnId: string;
  rowId: string;
};

export type ActiveTable = {
  id: string;
  type: FieldType.Table;
  activeCell?: ActiveCell;
};

export type ActiveField =
  | {
      id: string;
      type: FieldType.Text | FieldType.Checkbox | FieldType.Signature;
    }
  | ActiveTable;

export enum LabelingSelectionType {
  Block = 'Block',
  Region = 'Region',
}

// Possible local state configurations for the Document Labeler
export type DocumentLabelerLocalState = {
  activeField?: ActiveField;
  selectionType: LabelingSelectionType;
  rootRef: HTMLDivElement | null;
  showPdf: boolean;
  pdfScale: number;
  zoomMaxScale: number;
  zoomMinScale: number;
  renderedImgHeight: number;
  fieldViewing?: ActiveField;
  isModifiedField: boolean;
};

// Internal State, used to maintain local state within the Document Labeler
export type DocumentLabelerInternalState = {
  docInfo: DocumentLabelerData;
  localState: DocumentLabelerLocalState;
};

/** Generates initial state from initializer data */
const generateInitialState = (
  initialState: { data: DocumentLabelerData; config: BBConfigurations },
  rootRef: HTMLDivElement | null,
): DocumentLabelerInternalState => {
  let showPdf = true;
  let zoomMaxScale = ZOOM_VALUES.max;
  let zoomMinScale = ZOOM_VALUES.min;
  if (typeof initialState.config?.toolbarProps?.showPdf === 'boolean') {
    showPdf = initialState.config.toolbarProps?.showPdf;
  }

  if (typeof initialState.config?.toolbarProps?.zoomMaxScale === 'number') {
    zoomMaxScale = initialState.config.toolbarProps?.zoomMaxScale;
  }

  if (typeof initialState.config?.toolbarProps?.zoomMinScale === 'number') {
    zoomMinScale = initialState.config.toolbarProps?.zoomMinScale;
  }

  return {
    docInfo: initialState.data,
    localState: {
      activeField: undefined,
      selectionType: LabelingSelectionType.Block,
      rootRef: rootRef,
      showPdf,
      pdfScale: 1,
      zoomMaxScale,
      zoomMinScale,
      fieldViewing: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderedImgHeight: null as any,
      isModifiedField: true,
    },
  };
};

const convertInternalStateToOutputData = (
  state: DocumentLabelerInternalState,
): DocumentLabelerOutputDataDto => {
  const trainingSimpleFields: Array<FieldLabelOutputDto> =
    state.docInfo.results.fields.filter(
      (field) =>
        field.type === FieldType.Text || field.type === FieldType.Checkbox,
    );
  const trainingSignatureFields: Array<SignatureLabelOutputDto> =
    state.docInfo.results.fields.filter(
      (field) => field.type === FieldType.Signature,
    );
  const trainingTables: Array<TableLabelOutputDto> =
    state.docInfo.results.tables.map((table) => ({
      ...table,
      type: FieldType.Table,
      rows: table.rows,
    }));
  const trainingDocumentLabels: TrainingDocumentLabelsDto = {
    modelId: state.docInfo.modelId,
    docId: state.docInfo.documentId,
    results: {
      fields: trainingSimpleFields,
      signatures: trainingSignatureFields,
      tables: trainingTables,
    },
    documentId: state.docInfo.documentId,
    fileName: state.docInfo.fileName,
    mimeType: state.docInfo.mimeType,
    tempDocUrl: state.docInfo.tempDocUrl,
    wordBlocks: state.docInfo.wordBlocks,
  };
  const extractedFormFields: Array<ExtractedFieldDto> =
    state.docInfo.results.fields.map((field) => ({
      fieldName: field.name,
      value: FieldsPanelDisplayUtils.getTextValueFromField(field),
      confidenceScore: field.confidenceScore,
    }));

  const extractedTables: Array<ExtractedTableDto> =
    state.docInfo.results.tables.map((table) => ({
      tableName: table.name,
      confidenceScore: table.confidenceScore,
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell, idx) => ({
          columnName: table.columns[idx].name,
          value: FieldsPanelDisplayUtils.getTextValueFromCell(cell),
          confidenceScore: cell.confidenceScore,
        })),
      })),
    }));
  const extractionResult: ExtractionResultDto = {
    ...state.docInfo,
    documentId: state.docInfo.documentId,
    documentStatus: 'Completed',
    confidenceScore: Confidence.UserReviewed,
    formFields: extractedFormFields,
    tables: extractedTables,
  };
  return {
    trainingDocumentLabels,
    extractionResult,
  };
};

export const DocumentLabelerState = {
  generateInitialState,
  convertInternalStateToOutputData,
};
