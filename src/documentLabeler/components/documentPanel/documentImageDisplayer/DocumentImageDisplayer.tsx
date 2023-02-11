import { useMemo, useEffect, useRef } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

import { EndUserBlockRenderUtils } from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';

type Props = {
  document: string;
  width: number;
};

const DocumentImageDisplayer = (props: Props) => {
  const { document, width } = props;

  const { state, dispatch } = useDocumentLabeler();
  const { localState, docInfo } = state;
  const { renderedImgHeight, fieldViewing, activeField } = localState;

  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const imageProps = useMemo(() => {
    if (typeof state.localState.renderedImgHeight === 'number') {
      return {
        height: renderedImgHeight,
      };
    }

    return {};
  }, [state]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onImgLoad = (event: any) => {
    dispatch({
      type: 'setImageHeight',
      payload: event.target.offsetHeight,
    });
  };

  useEffect(() => {
    if (fieldViewing) {
      const { id } = fieldViewing;
      const { results } = docInfo;
      const findSelectedField = results.fields.find((field) => field.id === id);
      const [firstBlock] = findSelectedField?.blocks || [];

      if (firstBlock) {
        const { boundingBox } = firstBlock;
        const coords = EndUserBlockRenderUtils.getBlockRenderCoords(
          boundingBox,
          [imageProps.height || 0],
          width,
        );
        const scale = 2.5;
        const xPosition = coords.left * scale;
        const yPosition = coords.top * scale;

        transformComponentRef.current?.setTransform(
          -(xPosition - 250),
          -(yPosition - 250),
          scale,
        );
      } else {
        transformComponentRef.current?.setTransform(0, 0, 1);
      }
    } else {
      transformComponentRef.current?.setTransform(0, 0, 1);
    }
  }, [fieldViewing, docInfo, activeField]);

  return (
    <TransformWrapper ref={transformComponentRef}>
      <TransformComponent>
        <img
          {...imageProps}
          src={document}
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
