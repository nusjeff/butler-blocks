import React, { useLayoutEffect, useState } from 'react';
import { Box, makeStyles, Theme, Divider } from '@material-ui/core';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { FieldsPanelDisplayRow } from 'documentLabeler/components/fieldsPanel/fieldsPanelDisplayRow/FieldsPanelDisplayRow';
import { FieldType } from 'common/types/DocumentLabelerTypes';
import { FieldsPanelUtils } from 'documentLabeler/components/fieldsPanel/util/FieldsPanelUtils';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';
import { FieldsPanelDisplayUtils } from 'documentLabeler/common/util/FieldsPanelDisplayUtils';
import { FieldsPanelHeader } from 'documentLabeler/components/fieldsPanel/fieldsPanelHeader/FieldsPanelHeader';

import clsx from 'clsx';
import {
  ID_DOCUMENT_LABELER_CONTENT_ROOT,
  ID_FIELDS_PANEL_HEADER_ROOT,
} from 'documentLabeler/constants/DocumentLabelerConstants';

const DIVIDER_HEIGHT = 1;

const useStyles = makeStyles<Theme, { heightOfFieldsPanel: number | null }>(
  (theme) => ({
    Root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      width: theme.spacing(45),
      backgroundColor: theme.palette.common.white,
      '& > *': {
        width: '100%',
        boxSizing: 'border-box',
      },
    },
    FieldsContainer: {
      overflowY: 'auto',
      flex: 1,
      maxHeight: ({ heightOfFieldsPanel }) => heightOfFieldsPanel || 'auto',
    },
  }),
);

/**
 * Component responsible for rendering and managing the Fields
 */
export const FieldsPanel: React.FC = () => {
  const { state } = useDocumentLabeler();

  const [heightOfFieldsPanel, setHeightOfFieldsPanel] = useState<number | null>(
    null,
  );

  const classes = useStyles({
    heightOfFieldsPanel,
  });

  const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(
    state.docInfo,
  );

  useLayoutEffect(() => {
    const elDocumentLabelerContent = document.getElementById(
      ID_DOCUMENT_LABELER_CONTENT_ROOT,
    );
    const elFieldsPanelHeader = document.getElementById(
      ID_FIELDS_PANEL_HEADER_ROOT,
    );

    if (elDocumentLabelerContent && elFieldsPanelHeader) {
      const calcHeight =
        elDocumentLabelerContent?.offsetHeight -
        (elFieldsPanelHeader?.offsetHeight + DIVIDER_HEIGHT);
      setHeightOfFieldsPanel(calcHeight);
    }
  }, []);

  return (
    <Box className={classes.Root}>
      <FieldsPanelHeader />
      <Divider />
      <Box
        className={clsx(
          classes.FieldsContainer,
          'FieldsPanel__fieldsContainer',
        )}
      >
        {fields.map((field) => (
          <Box key={field.info.id}>
            <FieldsPanelDisplayRow
              {...field.info}
              value={FieldsPanelDisplayUtils.getTextValueFromField(field.info)}
              hasValue={FieldsPanelUtils.fieldHasLabeledValue(field.info)}
              color={field.color}
            />
            <Divider />
          </Box>
        ))}
        {tables.map((table) => (
          <Box key={table.info.id}>
            <FieldsPanelDisplayRow
              {...table.info}
              type={FieldType.Table}
              value={FieldsPanelDisplayUtils.getTextValueFromTable(table.info)}
              hasValue={FieldsPanelUtils.tableHasLabeledValue(table.info)}
              color={table.color}
            />
            <Divider />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
