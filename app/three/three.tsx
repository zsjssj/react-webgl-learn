import * as THREE from 'three';
import { useRef, useEffect } from 'react';

function initThree(canvasContaner: HTMLCanvasElement) {
  const scene: THREE.Scene = new THREE.Scene();
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasContaner, antialias: true });
  renderer.setSize(canvasContaner.clientWidth, canvasContaner.clientHeight);
  const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
  camera.position.z = 10;
  renderer.render(scene, camera);
  renderer.localClippingEnabled = true; // 启用局部裁剪
  console.log('%c react-three', 'color: #00dbff;');
  return { scene, camera, renderer };
}

//创建三角面
type type_mat = ConstructorParameters<typeof THREE.MeshBasicMaterial>[0];
type CreatePlaneProps = { scene: THREE.Scene; mat?: type_mat; verts?: [number, number, number, number, number, number, number, number, number] };
export function createPlane({ scene, verts, mat }: CreatePlaneProps) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(verts ?? [-100.0, 0.0, 0.0, 100.0, 0.0, 0.0, 0.0, 100.0, 0.0]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial(mat ?? { color: 0xff0000 });
  const plane = new THREE.Mesh(geometry, material);
  console.log('%c createPlane', 'color: #00dbff;');
  scene.add(plane);
}

export function ThreeTest() {
  useEffect(() => {
    const { scene: scene1, camera: camera1, renderer: render } = initThree(canvasContaner.current as HTMLCanvasElement);
    (scene = scene1), (camera = camera1), (renderer = render);
    const mat1 = { color: 0x0000ff } as type_mat;
    createPlane({ scene, mat: mat1, verts: [-100.0, 0.0, 0.0, 100.0, 0.0, 0.0, 0.0, 100.0, 0.0] });
    const mat2 = {
      color: 0x00ff00,
      transparent: true,
      opacity: 1,
      blending: THREE.CustomBlending,
      // blendEquation: THREE.MaxEquation,
      // blendSrc: THREE.ZeroFactor,
      // blendDst: THREE.SrcAlphaFactor,
      // blendSrc: THREE.OneFactor, // 完全使用源颜色
      // blendDst: THREE.OneFactor, // 完全使用目标颜色
      clipIntersection: true, // 启用裁剪交集
      clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, 1, 0), -50)],
    } as type_mat;
    createPlane({ scene, mat: mat2, verts: [0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 200.0, 0.0] });
    renderer.render(scene, camera);
  }, []);
  let scene: THREE.Scene | null = null;
  let camera: THREE.OrthographicCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  function animate() {
    requestAnimationFrame(animate);
    renderer!.render(scene!, camera!);
  }

  const threeContainer = useRef<HTMLDivElement>(null);
  const canvasContaner = useRef<HTMLCanvasElement>(null);
  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 w-screen h-screen flex justify-center items-center">
      <canvas ref={canvasContaner} id="three-canvas" className="w-9/10  h-9/10"></canvas>
    </div>
  );
}
