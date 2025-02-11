import React, { useEffect, useMemo, useRef, useState } from 'react';
import { alpha, makeStyles, Theme } from '@material-ui/core';
import { BlockDto, FieldType } from 'common/types/DocumentLabelerTypes';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { HtmlVisibilityUtil } from 'common/util/HtmlVisibilityUtil';
import { EndUserBlockRenderUtils } from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';

const TABLE_AREA_HEIGHT = 305;

type Props = {
  block: BlockDto;
  color: string;
  onClick?: (event: React.MouseEvent) => void;
  docPageHeights: Array<number>;
  docRenderWidth: number;
  opacity?: number;
  autoScroll?: boolean;
  isFieldViewing?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    position: 'absolute',
    borderRadius: theme.shape.borderRadius,
    scrollMargin: `${theme.spacing(5)}px`,
    // recenter blocks to offset the border radius
    marginLeft: theme.shape.borderRadius * -0.5,
    marginTop: theme.shape.borderRadius * -0.5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

/**
 * Component used for rendering a colored block over the DocumentColoredBlockLayer
 * @param props
 */
export const ColoredBlock: React.FC<Props> = ({
  block,
  color,
  onClick,
  docPageHeights,
  docRenderWidth,
  opacity = 1,
  autoScroll = false,
  isFieldViewing,
}) => {
  const classes = useStyles();
  const { state } = useDocumentLabeler();
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [bgColor, setBGColor] = useState(alpha(color, 0.2));

  useEffect(() => {
    const bottomOffset =
      state.localState.activeField?.type === FieldType.Table
        ? TABLE_AREA_HEIGHT
        : 0;
    if (
      blockRef.current &&
      state.localState.activeField &&
      autoScroll &&
      state.localState.rootRef &&
      !HtmlVisibilityUtil.isInContainer(
        blockRef.current,
        state.localState.rootRef,
        {
          bottomOffset,
        },
      )
    ) {
      blockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [
    state.localState.activeField,
    blockRef.current,
    state.localState.rootRef,
  ]);

  useEffect(() => {
    setBGColor(alpha(color, 0.2));
  }, [color]);

  const handleOnHover = () => {
    setBGColor(alpha(color, 0.8));
  };

  const handleOnHoverExit = () => {
    setBGColor(alpha(color, 0.2));
  };

  const coords = useMemo(() => {
    const result = EndUserBlockRenderUtils.getBlockRenderCoords(
      block.boundingBox,
      docPageHeights,
      docRenderWidth,
    );

    if (isFieldViewing) {
      result.height *= 2.5;
      result.width *= 2.5;
      result.top = 250;
      result.left = 250;
    }

    return result;
  }, [block.boundingBox, docPageHeights, docRenderWidth, isFieldViewing]);

  return (
    <div
      style={{
        ...coords,
        opacity,
        backgroundColor: bgColor,
        border: `2px solid ${color}`,
      }}
      className={classes.Root}
      onClick={onClick}
      ref={blockRef}
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnHoverExit}
    />
  );
};
