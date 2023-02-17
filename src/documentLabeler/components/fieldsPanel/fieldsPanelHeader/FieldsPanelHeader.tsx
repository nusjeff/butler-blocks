import React from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

import { Box, makeStyles, Theme, BoxProps } from '@material-ui/core';
import { DocumentLabelerState } from 'documentLabeler/state/DocumentLabelerState';
import { DocumentPanelToolbar } from 'documentLabeler/components/documentPanel/documentPanelToolbar/DocumentPanelToolbar';
import { Button } from 'common/button/Button';

import clsx from 'clsx';
import { ID_FIELDS_PANEL_HEADER_ROOT } from 'documentLabeler/constants/DocumentLabelerConstants';

import type { ButtonProps } from 'common/button/Button';

const useStyles = makeStyles<Theme, { showPdf: boolean }>((theme) => ({
  Root: {
    padding: ({ showPdf }) => (showPdf ? theme.spacing(2) : 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ButtonRoot: {
    width: ({ showPdf }) => (showPdf ? '100%' : 'auto'),
  },
  Button: {
    width: ({ showPdf }) => (showPdf ? '100%' : theme.spacing(12)),
    textTransform: 'none',
  },
}));

// const FIELDS = 'Fields';

const SAVE = 'Save';

/**
 * Header component for the fields panel which contains the title of the panel
 * and the save button which dispatches the onSaveCallback action
 */
export const FieldsPanelHeader: React.FC<BoxProps> = (props) => {
  const { className, ...boxProps } = props;

  const {
    saveActionButtonText,
    displayOnly,
    hideSaveButton,
    saveActionButtonProps,
    onSaveCallback,
  } = useBBConfiguration();

  const { state, dispatch } = useDocumentLabeler();
  const { showPdf, isModifiedField } = state.localState;

  const classes = useStyles({ showPdf });

  const onSaveClick = () => {
    onSaveCallback(
      DocumentLabelerState.convertInternalStateToOutputData(state),
    );
    dispatch({
      type: 'setIsModifiledField',
      payload: false,
    });
  };

  const shouldShowSaveButton = !hideSaveButton && !displayOnly;

  return (
    <Box
      id={ID_FIELDS_PANEL_HEADER_ROOT}
      className={clsx(classes.Root, className)}
      {...boxProps}
    >
      {!showPdf && <DocumentPanelToolbar />}
      {shouldShowSaveButton && (
        <Button
          variant="contained"
          color="primary"
          className={classes.Button}
          containerClassName={classes.ButtonRoot}
          onClick={onSaveClick}
          disableElevation
          disabled={!isModifiedField}
          {...(saveActionButtonProps as ButtonProps)}
        >
          {saveActionButtonText || SAVE}
        </Button>
      )}
    </Box>
  );
};
