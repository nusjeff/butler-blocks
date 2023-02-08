import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

import { coloredBlockPrefixId } from 'documentLabeler/constants/DocumentLabelerConstants';
import { ActiveField } from 'documentLabeler/state/DocumentLabelerState';

type Props = {
  document: string;
  width: number;
};

const DocumentImageDisplayer = (props: Props) => {
  const { document: butlerDocument, width } = props;

  const { state, dispatch } = useDocumentLabeler();
  const { localState, docInfo } = state;
  const { renderedImgHeight, activeField } = localState;

  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const mapActiveField = useMemo(() => {
    const result = docInfo.results.fields.find(
      (field) => field.id === activeField?.id,
    );

    return result;
  }, [activeField, docInfo.results.fields]);

  const boundingBoxActiveField = useMemo(() => {
    try {
      if (!mapActiveField) {
        return null;
      }
      const { boundingBox, id } = mapActiveField.blocks[0];

      return { boundingBox, id };
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }, [mapActiveField]);

  const imageProps = useMemo(() => {
    if (typeof state.localState.renderedImgHeight === 'number') {
      return {
        height: renderedImgHeight,
      };
    }

    return {};
  }, [state]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onImgLoad = useCallback((event: any) => {
    dispatch({
      type: 'setImageHeight',
      payload: event.target.offsetHeight,
    });
  }, []);

  // useEffect(() => {

  // }, [activeField]);

  useEffect(() => {
    if (boundingBoxActiveField) {
      const coloredBlockId = `${coloredBlockPrefixId}__${boundingBoxActiveField.id}`;
      const coloredBlockEl = document.getElementById(coloredBlockId);
      const boundingBlock = coloredBlockEl?.getBoundingClientRect() as DOMRect;
      const scale = 3;
      let xPosition = boundingBlock.x * (scale / 1.5);
      console.log('xPosition', xPosition);

      if (xPosition < 200) {
        xPosition -= 50;
      }

      const yPosition = boundingBlock.y;

      transformComponentRef.current?.setTransform(
        -xPosition,
        -yPosition,
        scale,
      );
      // transformComponentRef.current?.setTransform(-204.01875, -270.5, 3);
    } else {
      transformComponentRef.current?.setTransform(0, 0, 1);
    }
  }, [boundingBoxActiveField]);

  return (
    <TransformWrapper
      ref={transformComponentRef}
      onTransformed={(ref, state) => {
        console.log('state', state);
      }}
    >
      <TransformComponent>
        <img
          {...imageProps}
          src={butlerDocument}
          width={width}
          alt="DocumentImageDisplayer"
          id="DocumentImageDisplayer"
          onLoad={onImgLoad}
        />
      </TransformComponent>
    </TransformWrapper>
  );
};

export { DocumentImageDisplayer };
