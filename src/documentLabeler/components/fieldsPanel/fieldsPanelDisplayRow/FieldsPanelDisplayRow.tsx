import {
  alpha,
  Box,
  Button,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Close, Create, CenterFocusStrong } from '@material-ui/icons';
import { OutlinedTextField } from 'common/display/OutlinedTextField/OutlinedTextField';
import { TruncatableTypography } from 'common/display/TruncatableTypography/TruncatableTypography';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { FieldType } from 'common/types/DocumentLabelerTypes';
import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

const SAVE = 'Save';

const EMPTY_VALUE = 'No Value Specified';

type Props = {
  id: string;
  type: FieldType;
  name: string;
  value: string;
  color: string;
  hasValue?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    cursor: 'pointer',
    justifyContent: 'space-between',
    height: theme.spacing(6),
  },
  TopRowContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  FieldIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    paddingLeft: 0,
  },
  FieldInfoContainer: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  FieldActionContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  FieldLabelTypography: {
    color: theme.palette.text.disabled,
  },
  FieldValueTypography: {
    color: theme.palette.text.secondary,

    '&.Disabled': {
      color: theme.palette.text.disabled,
    },
  },
  Button: {
    textTransform: 'none',
  },
  IconButton: {
    padding: 0,
    marginRight: theme.spacing(1),
    '&.Hide': {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
  ViewingField: {
    color: blue[500],
  },
}));

/**
 * Component responsible for rendering a field in the fields panel.
 * Takes in information about the field and its associated display color
 * and handles selecting the field and editing the field value.
 * @param Props
 */
export const FieldsPanelDisplayRow: React.FC<Props> = ({
  id,
  type,
  name,
  value,
  color,
  hasValue = true,
}) => {
  const classes = useStyles();

  const { fieldDisplayNameFormatter, displayOnly } = useBBConfiguration();
  const { state, dispatch } = useDocumentLabeler();

  const [editingText, setEditingText] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value);

  const fieldIsActive = state.localState.activeField?.id === id;
  const fieldIsViewing = state.localState.fieldViewing?.id === id;

  const displayFieldName = fieldDisplayNameFormatter
    ? fieldDisplayNameFormatter(name)
    : name;

  const handleFieldClick = () => {
    if (fieldIsActive) {
      dispatch({
        type: 'setActiveField',
        payload: undefined,
      });
    } else {
      dispatch({
        type: 'setActiveField',
        payload: {
          id: id,
          type: type,
        },
      });
    }
  };

  const handleClearLabels = () =>
    dispatch({
      type: 'removeAllBlocksFromField',
      payload: {
        fieldId: id,
        fieldType: type,
      },
    });

  const handleSaveValue = () => {
    dispatch({
      type: 'setFieldTextOverride',
      payload: {
        fieldId: id,
        textOverride: localValue,
      },
    });
    setEditingText(false);
  };

  const handleFocusField = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        type: 'setViewingField',
        payload: {
          id,
          type,
        },
      });
    },
    [state.localState.fieldViewing, id, type],
  );

  return (
    <Box
      className={clsx(classes.Root, 'FieldsPanelDisplayRow__root')}
      onClick={handleFieldClick}
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: fieldIsActive ? alpha(color, 0.1) : 'transparent',
      }}
      data-testid={`field-${name}`}
    >
      <Box className={classes.FieldInfoContainer}>
        {editingText ? (
          <OutlinedTextField
            className="FieldsPanelDisplayRow__textField"
            value={localValue}
            placeholder={EMPTY_VALUE}
            onChange={(e) => setLocalValue(e.target.value)}
            inputProps={{
              'data-testid': 'field-value-input',
            }}
          />
        ) : (
          <>
            <Box className={classes.TopRowContainer}>
              <TruncatableTypography
                value={displayFieldName}
                paragraph={false}
                typographyProps={{
                  variant: 'caption',
                  className: classes.FieldLabelTypography,
                }}
              />
            </Box>
            <TruncatableTypography
              value={value}
              paragraph={false}
              typographyProps={{
                variant: 'subtitle2',
              }}
            />
          </>
        )}
      </Box>
      {!displayOnly && (
        <>
          {editingText ? (
            <Button
              variant="text"
              color="primary"
              className={classes.Button}
              disableElevation
              onClick={(event) => {
                event.stopPropagation();
                handleSaveValue();
              }}
              data-testid="save-field-value-btn"
            >
              {SAVE}
            </Button>
          ) : (
            <Box
              className={clsx(
                classes.FieldActionContainer,
                'FieldsPanelDisplayRow__fieldActionContainer',
              )}
            >
              <IconButton
                className={clsx(classes.IconButton, {
                  Hide: type === FieldType.Table,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  setLocalValue(value);
                  setEditingText(true);
                }}
                data-testid="edit-field-icon"
              >
                <Create fontSize="small" />
              </IconButton>
              <IconButton
                className={clsx(classes.IconButton, {
                  Hide: !hasValue,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClearLabels();
                }}
                data-testid="clear-field-label-icon"
              >
                <Close fontSize="small" />
              </IconButton>

              <IconButton
                className={clsx(classes.IconButton, {
                  Hide: !hasValue,
                })}
                onClick={handleFocusField}
                data-testid="clear-field-label-icon"
              >
                <CenterFocusStrong
                  className={clsx({
                    [classes.ViewingField]: fieldIsViewing,
                  })}
                  fontSize="small"
                />
              </IconButton>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
