import { useRef, useEffect, use, type MouseEvent } from 'react';
// import type { MouseEvent as ReactMouseEvent } from 'react';

//创建顶点着色器
const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  varying vec4 v_color;
  void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0; // 设置点的大小
    gl_Position.z = 0.0; // 确保点在视图平面上
    v_color = a_color; // 将颜色传递给片段着色器
  }
`;
// 创建片段着色器
const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_color;
  void main() {
    gl_FragColor = v_color; // 设置颜色自定义
  }
`;

//创建着色器
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader!, source); // 设置着色器源代码
  gl.compileShader(shader!); // 编译着色器
  const success = gl.getShaderParameter(shader!, gl.COMPILE_STATUS); // 检查编译状态
  return success ? shader : (console.error(gl.getShaderInfoLog(shader!)), null);
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram(); // 创建程序对象
  gl.attachShader(program!, vertexShader); // 附加顶点着色器
  gl.attachShader(program!, fragmentShader); // 附加片段着色器
  gl.linkProgram(program!); // 链接程序
  const success = gl.getProgramParameter(program!, gl.LINK_STATUS); // 检查链接状态
  return success ? program : (console.error(gl.getProgramInfoLog(program!)), null);
}

// 初始化 WebGL 上下文
function initgl(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return { gl: null, program: null };
  }
  canvas.width = canvas.clientWidth; // 设置画布宽度
  canvas.height = canvas.clientHeight; // 设置画布高度
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource); // 创建顶点着色器
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource); // 创建片段着色器
  const program = createProgram(gl, vertexShader!, fragmentShader!); // 创建并链接程序
  gl.useProgram(program!); // 使用程序
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置清除颜色为黑色
  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
  gl.drawArrays(gl.POINTS, 0, 1); // 绘制点
  console.log('%c WebGL initialized', 'color: #00dbff;');
  return { gl: gl, program: program! };
}

export function Gl001() {
  useEffect(() => {
    const { gl: gl1, program: program1 } = initgl(canvasContaner.current as HTMLCanvasElement);
    (gl = gl1), (program = program1);
  }, []);
  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  const threeContainer = useRef<HTMLDivElement>(null);
  const canvasContaner = useRef<HTMLCanvasElement>(null);

  //点击事件
  const pointList: { x: number; y: number; color: readonly [number, number, number, 1] }[] = [];
  function handleClick(event: MouseEvent<HTMLCanvasElement>, gl: WebGLRenderingContext, program: WebGLProgram) {
    const x = ((event.clientX - canvasContaner.current!.offsetLeft) / canvasContaner.current!.clientWidth) * 2 - 1; // 将鼠标位置转换为 WebGL 坐标系
    const y = -((event.clientY - canvasContaner.current!.offsetTop) / canvasContaner.current!.clientHeight) * 2 + 1; // 将鼠标位置转换为 WebGL 坐标系
    const positionLocation = gl.getAttribLocation(program!, 'a_position'); // 获取顶点位置属性的位置
    const a_color = gl.getAttribLocation(program!, 'a_color'); // 获取颜色属性的位置
    const color = [Math.random(), Math.random(), Math.random(), 1.0] as const; // 随机颜色
    pointList.push({ x, y, color });
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置清除颜色为黑色
    gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
    for (let i = 0; i < pointList.length; i++) {
      const element = pointList[i];
      gl.vertexAttrib3f(positionLocation, element.x, element.y, 0.0); // 设置顶点位置
      gl.vertexAttrib4f(a_color, ...element.color); // 设置颜色
      gl.drawArrays(gl.POINTS, 0, 1); // 绘制点
    }
  }

  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 relative w-screen h-screen flex flex-col justify-center items-center">
      <span className="mb-2">webgl001-point</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10" onMouseDown={(event) => handleClick(event, gl!, program!)}></canvas>
    </div>
  );
}
