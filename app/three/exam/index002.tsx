import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useRef, useEffect } from 'react';

//材质剪裁

function initThree(canvasContaner: HTMLCanvasElement) {
  const scene: THREE.Scene = new THREE.Scene();
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(40, canvasContaner.clientWidth / canvasContaner.clientHeight, 1, 200);
  camera.position.set(20, 0, 0);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasContaner, antialias: true });
  renderer.setSize(canvasContaner.clientWidth, canvasContaner.clientHeight);
  renderer.localClippingEnabled = true; // 启用局部裁剪
  renderer.setPixelRatio(window.devicePixelRatio);
  console.log('%c react-three', 'color: #00dbff;');

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', renderer); // use only if there is no animation loop
  // controls.minDistance = 1;
  // controls.maxDistance = 10;
  controls.autoRotate = true;
  controls.enablePan = false;
  return { scene, camera, renderer, controls };
}

//创建球体
function createSphere(scene: THREE.Scene) {
  for (let i = 0; i < 1; i += 2) {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      roughness: 0.3,
      side: THREE.FrontSide,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  }
}

//创建灯光
function createLight(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  const pointLight = new THREE.PointLight(0xffffff, 100, 100);
  pointLight.position.set(5, 0, 0);
  const geometry = new THREE.SphereGeometry(0.1, 64, 64);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.FrontSide, emissive: 0xffffff, emissiveIntensity: 100 });
  const sphere = new THREE.Mesh(geometry, material);
  pointLight.add(sphere);
  scene.add(ambientLight, pointLight);
}

export function ThreeExam002() {
  useEffect(() => {
    const { scene: scene1, camera: camera1, renderer: render, controls: controls1 } = initThree(canvasContaner.current as HTMLCanvasElement);
    (scene = scene1), (camera = camera1), (renderer = render);
    controls = controls1;
    createSphere(scene);
    createLight(scene);
    animate();
    return () => {
      // 清理资源
      scene && scene.clear();
      renderer && renderer.dispose();
      controls && controls.dispose();
      camera = null;
      renderer = null;
      scene = null;
      controls = null;
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

  const threeContainer = useRef<HTMLDivElement>(null);
  const canvasContaner = useRef<HTMLCanvasElement>(null);
  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 relative w-screen h-screen flex flex-col justify-center items-center">
      <span className="mb-2">灯光效果</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10"></canvas>
    </div>
  );
}
