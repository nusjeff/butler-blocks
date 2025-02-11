import { useState, useLayoutEffect } from 'react';
import { useDocumentDisplayer } from 'documentLabeler/components/documentPanel/documentDisplayer/useDocumentDisplayer';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';

import { Box, makeStyles, Theme } from '@material-ui/core';
import { DocumentDisplayer } from 'documentLabeler/components/documentPanel/documentDisplayer/DocumentDisplayer';

import { DocumentBlockLayer } from 'documentLabeler/components/documentPanel/documentBlockLayer/DocumentBlockLayer';
import { DocumentContainer } from 'documentLabeler/components/documentPanel/documentContainer/DocumentContainer';
import { DocumentPanelToolbar } from 'documentLabeler/components/documentPanel/documentPanelToolbar/DocumentPanelToolbar';
import { DocumentImageDisplayer } from 'documentLabeler/components/documentPanel/documentImageDisplayer/DocumentImageDisplayer';

import { FieldType } from 'common/types/DocumentLabelerTypes';
import { withSize, SizeMeProps } from 'react-sizeme';
import clsx from 'clsx';
import { MimeType } from 'common/types/DocumentLabelerTypes';
import {
  ID_DOCUMENT_LABELER_CONTENT_ROOT,
  ID_DOCUMENT_PANEL_TOOLBAR__ROOT,
} from 'documentLabeler/constants/DocumentLabelerConstants';

const useStyles = makeStyles<
  Theme,
  { heightOfDocumentContainer: number | null }
>((theme) => ({
  Root: {
    flex: 1,
  },
  DocumentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: ({ heightOfDocumentContainer }) =>
      heightOfDocumentContainer || 'auto',

    '&.FullHeight': {
      height: '100%',
    },
  },
  PreviewCard: {
    width: '100%',
  },
  DropzoneWrapper: {
    height: theme.spacing(50),
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TableHeightCover: {
    height: theme.spacing(41),
  },
}));

type Props = SizeMeProps;

const SPACING_DOCUMENT_LABELER = 16;

const DocumentPanelInternal = withSize({
  monitorHeight: true,
})(({ size }: Props) => {
  const [heightOfDocumentContainer, setHeightOfDocumentContainer] = useState<
    null | number
  >(null);

  const classes = useStyles({ heightOfDocumentContainer });

  const { state } = useDocumentLabeler();

  const width = size?.width ?? 0;
  const height = size?.height ?? 0;

  const docDisplayerState = useDocumentDisplayer(
    state.docInfo.mimeType,
    { width, height },
    state.docInfo.tempDocUrl,
  );

  const isPdf = state.docInfo.mimeType === MimeType.Pdf;

  useLayoutEffect(() => {
    const elDocumentLabelerContent = document.getElementById(
      ID_DOCUMENT_LABELER_CONTENT_ROOT,
    );
    const elDocumentToolbar = document.getElementById(
      ID_DOCUMENT_PANEL_TOOLBAR__ROOT,
    );
    if (elDocumentLabelerContent) {
      const heightDocumentToolbar = elDocumentToolbar?.offsetHeight || 0;
      const calHeight =
        elDocumentLabelerContent.offsetHeight -
        (heightDocumentToolbar + SPACING_DOCUMENT_LABELER);
      setHeightOfDocumentContainer(calHeight);
    } else {
      setHeightOfDocumentContainer(null);
    }
  }, []);

  return (
    <Box className={classes.Root}>
      <DocumentPanelToolbar />

      <Box className={classes.DocumentContainer} data-testid="document-labeler">
        <DocumentContainer className={classes.PreviewCard}>
          <DocumentBlockLayer
            docPageHeights={docDisplayerState.pageHeights}
            width={width}
          />
          {isPdf && (
            <DocumentDisplayer
              document={state.docInfo.tempDocUrl}
              loaders={docDisplayerState.loaders}
              pages={docDisplayerState.pages}
            />
          )}
          {!isPdf && (
            <DocumentImageDisplayer
              document={state.docInfo.tempDocUrl}
              width={width}
            />
          )}
        </DocumentContainer>
        {state.localState.activeField &&
          state.localState.activeField.type === FieldType.Table && (
            <Box className={classes.TableHeightCover} />
          )}
      </Box>
    </Box>
  );
});

const useExternalStyles = makeStyles((theme: Theme) => ({
  Root: {
    display: 'flex',
    flex: 1,
    backgroundColor: theme.palette.background.default,
    overflow: 'scroll',
    maxHeight: '100%',
  },
}));

/**
 * Component responsible for displaying & labeling the document.
 */
export const DocumentPanel: React.FC = () => {
  const classes = useExternalStyles();
  return (
    <Box className={clsx(classes.Root, 'DocumentPanel__root')}>
      <DocumentPanelInternal />
    </Box>
  );
};
