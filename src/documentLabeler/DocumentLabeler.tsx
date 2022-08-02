import React from 'react';
import { DocumentLabelerProvider } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { DocumentLabelerContent } from 'documentLabeler/DocumentLabelerContent';

type Props = {
  data: DocumentLabelerData;
  // TODO: define documentLabelerOutput type
  onSaveCallback: (documentLabelerOutput: object) => void;
};

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, as well as an onSaveCallback to be executed when the save button
 * is clicked.  Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabeler: React.FC<Props> = ({data, onSaveCallback}) => {
  return (
    <DocumentLabelerProvider data={data} onSaveCallback={onSaveCallback}>
      <DocumentLabelerContent />
    </DocumentLabelerProvider>
  )
 }
