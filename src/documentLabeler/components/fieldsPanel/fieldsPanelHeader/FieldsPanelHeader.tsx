import React from 'react';
import { Box, Button, makeStyles, Theme, Typography } from '@material-ui/core';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
 
const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Button: {
    width: theme.spacing(12),
  },
}));

const FIELDS = 'Fields';

const SAVE = 'Save';

/**
* Header component for the fields panel which contains the title of the panel
* and the save button which dispatches the onSaveCallback action
*/
export const FieldsPanelHeader: React.FC = () => {
 const classes = useStyles();

 const { state } = useDocumentLabeler();
 
 return (
  <Box className={classes.Root}>
    <Typography variant='subtitle2'>{FIELDS}</Typography>
    <Button 
      variant='contained' 
      color='primary' 
      className={classes.Button}
      onClick={() => state.onSaveCallback(state.docInfo)}
    >
      {SAVE}
    </Button>
  </Box>
 );
};
