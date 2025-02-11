import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';

import clsx from 'clsx';

export interface ButtonProps extends MuiButtonProps {
  loading: boolean;
  containerClassName?: string;
}

const useStyles = makeStyles(() => ({
  Root: {
    position: 'relative',
  },
  Button: {},
  ButtonProgress: {
    position: 'absolute',
    top: '30%',
    left: '40%',
  },
}));

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    loading,
    disabled,
    className,
    children,
    containerClassName,
    ...buttonProps
  } = props;

  const classes = useStyles();

  return (
    <div className={clsx(classes.Root, containerClassName)}>
      <MuiButton
        variant="contained"
        color="primary"
        className={clsx(classes.Button, className)}
        disabled={loading || disabled}
        {...buttonProps}
      >
        {children}
      </MuiButton>
      {loading && (
        <CircularProgress size={16} className={classes.ButtonProgress} />
      )}
    </div>
  );
};
