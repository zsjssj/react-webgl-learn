import { useRef, useEffect, use, type MouseEvent } from 'react';
//平移

//创建顶点着色器
const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  uniform mat4 Txy;
  varying vec4 v_color;
  void main() {
    gl_Position = Txy * a_position; // 使用矩阵变换顶点位置
    // gl_Position = a_position;
    v_color = a_color; 
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
  if (!success) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader!));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
//创建程序
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram(); // 创建程序对象
  gl.attachShader(program!, vertexShader); // 附加顶点着色器
  gl.attachShader(program!, fragmentShader); // 附加片段着色器
  gl.linkProgram(program!); // 链接程序
  const success = gl.getProgramParameter(program!, gl.LINK_STATUS); // 检查链接状态
  if (!success) {
    console.error('Shader program error:', gl.getProgramInfoLog(program!));
    return null;
  }
  gl.useProgram(program);
  return program;
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
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置清除颜色为黑色
  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
  console.log('%c WebGL initialized', 'color: #00dbff;');
  return { gl: gl, program: program! };
}

//绘制矩形
function drawTriangle(gl: WebGLRenderingContext, program: WebGLProgram) {
  const a_positon = gl.getAttribLocation(program, 'a_position'); // 获取顶点位置属性的位置
  const a_color = gl.getAttribLocation(program, 'a_color'); // 获取颜色属性的位置
  const Txy = gl.getUniformLocation(program, 'Txy'); // 获取平移的 uniform 位置
  const positonBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positonBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 1, 1, -0.5, 0.5, 1, 0, 0, 0.5, 0.5, 0, 1, 0, 0.5, -0.5, 0, 0, 1, -0.5, -0.5, 1, 1, 0, -0.5, 0.5, 1, 0, 0]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * 5, 0); // 指定顶点属性的格式

  /*
                                        gl.enable(gl.DEPTH_TEST); // 启用深度测试  
   */

  /*  const deg = 30; // 旋转角度
  const cosb = Math.cos((deg * Math.PI) / 180); // 将角度转换为弧度
  const sinb = Math.sin((deg * Math.PI) / 180); // 将角度转换为弧度
  gl.uniformMatrix4fv(Txy, false, new Float32Array([cosb, sinb, 0, 0, -sinb, cosb, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])); // 设置旋转矩阵 */
  /* gl.uniformMatrix4fv(Txy, false, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0.5, -0.5, 0, 1])); // 设置平移的 uniform */
  //设置缩放矩阵
  // let sx = 0.5,
  //   sy = 2,
  //   sz = 1; // 缩放因子
  // gl.uniformMatrix4fv(Txy, false, new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1])); // 设置缩放矩阵

  //复合的平移、旋转、缩放矩阵
  let [sx, sy, sz] = [0.5, 2, 1];
  const deg = 45; // 旋转角度
  const cosb = Math.cos((deg * Math.PI) / 180); // 将角度转换为弧度
  const sinb = Math.sin((deg * Math.PI) / 180); // 将角度转换为弧度
  gl.uniformMatrix4fv(Txy, false, new Float32Array([sx * cosb, sinb, 0, 0, -sinb * sy, cosb, 0, 0, 0, 0, sz, 0, 0.5, -0.5, 0, 1])); // 设置旋转平移缩放矩阵
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 4 * 5, 4 * 2); // 指定颜色属性的格式
  gl.enableVertexAttribArray(a_positon); // 启用顶点属性数组
  gl.enableVertexAttribArray(a_color); // 启用颜色属性数组
  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6); // 使用三角扇绘制矩形
  console.log('%c Triangle drawn', 'color: #00ff00;');
}

export function Gl007() {
  useEffect(() => {
    const { gl: gl1, program: program1 } = initgl(canvasContaner.current as HTMLCanvasElement);
    (gl = gl1), (program = program1);
    drawTriangle(gl!, program!); // 绘制矩形
  }, []);
  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  const threeContainer = useRef<HTMLDivElement>(null);
  const canvasContaner = useRef<HTMLCanvasElement>(null);

  //点击事件
  const pointList: number[] = [];
  function handleClick(event: MouseEvent<HTMLCanvasElement>, gl: WebGLRenderingContext, program: WebGLProgram) {}

  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 relative w-screen h-screen flex flex-col justify-center items-center">
      <span className="mb-2">webgl002-数学计算</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10" onMouseDown={(event) => handleClick(event, gl!, program!)}></canvas>
    </div>
  );
}
