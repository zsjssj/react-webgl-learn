import * as THREE from 'three';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useRef, useEffect } from 'react';

//材质剪裁

function initThree(canvasContaner: HTMLCanvasElement) {
  const scene: THREE.Scene = new THREE.Scene();
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(40, canvasContaner.clientWidth / canvasContaner.clientHeight, 1, 200);
  camera.position.set(-1, 2, 2.0);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasContaner, antialias: true });
  renderer.setSize(canvasContaner.clientWidth, canvasContaner.clientHeight);
  renderer.localClippingEnabled = true; // 启用局部裁剪
  console.log('%c react-three', 'color: #00dbff;');

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', renderer); // use only if there is no animation loop
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.autoRotate = true;
  controls.enablePan = false;

  const light = new THREE.HemisphereLight(0xffffff, 0x080808, 4.5);
  light.position.set(-1.25, 1, 1.25);
  scene.add(light);

  return { scene, camera, renderer, controls };
}

//创建嵌套球体
function createSphere(scene: THREE.Scene) {
  console.log('%c createSphere', 'color: #00dbff;');
  const clippingPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
  const helpers = new THREE.Group();
  helpers.add(new THREE.PlaneHelper(clippingPlanes[0], 2, 0xff0000));
  helpers.add(new THREE.PlaneHelper(clippingPlanes[1], 2, 0x00ff00));
  helpers.add(new THREE.PlaneHelper(clippingPlanes[2], 2, 0x0000ff));

  scene.add(helpers);
  for (let i = 0; i < 30; i += 2) {
    const geometry = new THREE.SphereGeometry(i / 30, 48, 24);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      side: THREE.DoubleSide,
      clipIntersection: true,
      clippingPlanes: clippingPlanes,
      alphaToCoverage: true,
      dithering: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  }
}

export function ThreeExam001() {
  useEffect(() => {
    const { scene: scene1, camera: camera1, renderer: render, controls: controls1 } = initThree(canvasContaner.current as HTMLCanvasElement);
    (scene = scene1), (camera = camera1), (renderer = render);
    controls = controls1;
    onResize();
    createSphere(scene);
    animate();

    window.addEventListener('resize', onResize);
    return () => {
      // 清理资源
      scene && scene.clear();
      renderer && renderer.dispose();
      controls && controls.dispose();
      camera = null;
      renderer = null;
      scene = null;
      controls = null;
      window.removeEventListener('resize', onResize);
    };
  }, []);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  function animate() {
    requestAnimationFrame(animate);
    renderer!.render(scene!, camera!);
    controls!.update();
  }

  function onResize() {
    if (!camera || !renderer) return;
    console.log('%c onResize', 'color: #00dbff;');
    console.log('onResize', canvasContaner.current!.clientWidth, canvasContaner.current!.clientHeight);
    renderer.setSize(canvasContaner.current!.clientWidth, canvasContaner.current!.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = canvasContaner.current!.clientWidth / canvasContaner.current!.clientHeight;
    camera.updateProjectionMatrix();
  }

  const threeContainer = useRef<HTMLDivElement>(null);
  const canvasContaner = useRef<HTMLCanvasElement>(null);
  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 relative w-screen h-screen flex flex-col justify-center items-center">
      <span className="mb-2"> 材质切割效果</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10"></canvas>
    </div>
  );
}
