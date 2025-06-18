import { useRef, useEffect, use, type MouseEvent } from 'react';
import { Matrix4 } from 'cuon-matrix';
//绘制矩形

//创建正视投影矩阵
const projectionMatrix = new Matrix4().setOrtho(-1, 1, -1, 1, -1, 1); // 设置正视投影矩阵
//创建透视投影矩阵
const perspectiveMatrix = new Matrix4().setPerspective(45, 1, 0.1, 100); // 设置透视投影矩阵

//创建顶点着色器
const vertexShaderSource = `
  attribute vec3 a_position;
  attribute vec4 a_color;
  uniform vmat4 u_Matrix;  //正视投影矩阵
  varying vec4 v_color;
  void main() {
    gl_Position = u_Matrix * vec4(a_position,  1.0); // 使用矩阵变换顶点位置
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
  const positonBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // 绑定索引缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, positonBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([50.0, 50.0, 1, 0, 0, 50, 100, 0, 1, 0, 150, 100, 0, 0, 1, 150, 50, 1, 1, 0]), gl.STATIC_DRAW);
  //扇形绘制矩形时候的顶点数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x,y,z,r,g,b]), gl.STATIC_DRAW); //后期自行完善
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, ...]), gl.STATIC_DRAW); //后期自行完善
  gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * 6, 0); // 指定顶点属性的格式
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 4 * 6, 4 * 3); // 指定颜色属性的格式
  gl.enableVertexAttribArray(a_positon); // 启用顶点属性数组
  gl.enableVertexAttribArray(a_color); // 启用颜色属性数组
  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); // 三角面的方式绘制立方体




  /*
                                                  使用正视投影矩阵进行矩形变换
   */
  gl.enable(gl.DEPTH_TEST); // 启用深度测试  
  gl.enable(gl.CULL_FACE); // 启用面剔除.只能看到法线正向的面
  // gl.cullFace(gl.BACK); // 设置剔除背面

  const u_Matrix = gl.getUniformLocation(program, 'u_Matrix'); // 获取矩阵 uniform 位置
  //创建旋转矩阵,并于视图矩阵参与计算
  const rotationMatrix = new Matrix4().setRotate(45, 1, 1, 0); // 创建旋转矩阵，绕 x, y中间的斜线旋转 45 度
  const viewMatrix = new Matrix4().setOrtho(-2, 2, -2, 2, -10, 10); // 设置正视投影矩阵
  const viewMatrix1 = viewMatrix.multiply(rotationMatrix); // 将正视投影矩阵与旋转矩阵相乘
  gl.uniformMatrix4fv(u_Matrix, false, viewMatrix.elements); // 设置矩阵 uniform

  console.log('%c Triangle drawn', 'color: #00ff00;');
}

export function Gl008() {
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
      <span className="mb-2">webgl002-矩形</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10" onMouseDown={(event) => handleClick(event, gl!, program!)}></canvas>
    </div>
  );
}
