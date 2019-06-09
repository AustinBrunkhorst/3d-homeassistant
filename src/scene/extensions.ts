import { extend } from 'react-three-fiber';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { GridHelper } from 'three/src/helpers/GridHelper';

import TransformControls from 'lib/three/TransformControls';

extend({ AxesHelper, GridHelper, MapControls, TransformControls });
