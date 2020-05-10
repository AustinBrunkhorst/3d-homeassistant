import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Object3D } from "three";
import * as actions from "store/actions/areaEditor.actions";
import { selectIsSelectionDisabled } from "store/selectors/areaEditor.selector";
import ThreeTransformControls from "../TransformControls";

export function useSceneObject(id: number, threeObject?: Object3D, selectThreeObject?: (objects: Object3D[]) => void) {
  const dispatch = useDispatch();
  const isSelectionDisabled = useSelector(selectIsSelectionDisabled);

  const saveTransform = useCallback((e) => {
    const { position, quaternion, scale } = e.target.object;

    switch (e.target.mode) {
      case "translate": {
        const { x, y, z } = position;

        dispatch(actions.updateObjectPosition({ id, position: { x, y, z } }));
        break;
      }
      case "rotate": {
        const { x, y, z, w } = quaternion;

        dispatch(actions.updateObjectRotation({ id, rotation: { x, y, z, w } }));
        break;
      }
      case "scale":
        const { x, y, z } = scale;

        dispatch(actions.updateObjectScale({ id, scale: { x, y, z } }));
        break;
    }
  }, [id, dispatch]);

  const selectObject = useCallback((e) => {
    if (isSelectionDisabled) {
      return;
    }

    if (selectThreeObject) {
      const objects: Object3D[] = [];

      e.eventObject.traverse((object: Object3D) => {
        if (object.type === "Mesh") {
          objects.push(object);
        }
      });

      selectThreeObject(objects);
    }

    e.stopPropagation();

    dispatch(actions.selectObject({ id }))
  }, [isSelectionDisabled, selectThreeObject, dispatch, id]);

  const timerHandle = useRef<any>(0);

  const onMouseDown = useCallback(() => {
    dispatch(actions.setIsSelectionDisabled(true));
  }, [dispatch]);

  const onMouseUp = useCallback(() => {
    timerHandle.current = setTimeout(() => dispatch(actions.setIsSelectionDisabled(false)));
  }, [dispatch]);

  useEffect(() => {
    const currentHandle = timerHandle.current;

    return () => {
      if (currentHandle) {
        clearTimeout(currentHandle);
      }
    };
  }, []);

  const renderTransformControls = useCallback(() => {
    if (!threeObject) {
      return null;
    }

    return (
      <ThreeTransformControls
        object={threeObject}
        onChange={saveTransform}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    );
  }, [onMouseDown, onMouseUp, saveTransform, threeObject]);

  return { selectObject, renderTransformControls };
}