import { useRef, useEffect, use, type MouseEvent } from 'react';
//绘制矩形

//创建顶点着色器
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec4 a_color;
  uniform vec2 screenSize; 
  varying vec4 v_color;
  void main() {
  float x = a_position.x * 2.0 / screenSize.x - 1.0; 
  float y = 1.0 - (a_position.y * 2.0 / screenSize.y); 
    gl_Position = vec4(x, y, 0.0, 1.0); 
    gl_PointSize = 10.0;
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
  const screenSize = gl.getUniformLocation(program, 'screenSize'); // 获取屏幕大小的 uniform 位置
  const positonBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // 绑定索引缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, positonBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([50.0, 50.0, 1, 0, 0, 50, 100, 0, 1, 0, 150, 100, 0, 0, 1, 150, 50, 1, 1, 0]), gl.STATIC_DRAW);
  //扇形绘制矩形时候的顶点数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([100, 75, 1, 1, 1, 50.0, 50.0, 1, 0, 0, 50, 100, 0, 1, 0, 150, 100, 0, 0, 1, 150, 50, 1, 1, 0, 50.0, 50.0, 1, 0, 0]), gl.STATIC_DRAW);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW); // 定义三角形的索引
  gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * 5, 0); // 指定顶点属性的格式
  gl.uniform2f(screenSize, gl.canvas.width, gl.canvas.height); // 设置屏幕大小 uniform
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 4 * 5, 4 * 2); // 指定颜色属性的格式
  gl.enableVertexAttribArray(a_positon); // 启用顶点属性数组
  gl.enableVertexAttribArray(a_color); // 启用颜色属性数组
  // gl.vertexAttrib4f(a_color, 1, 0, 0, 1); // 设置颜色
  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
  // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); // 三角面的方式绘制矩形
  // gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 0); // 使用三角带绘制矩形
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6); // 使用三角扇绘制矩形

  console.log('%c Triangle drawn', 'color: #00ff00;');
}

export function Gl004() {
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
  function handleClick(event: MouseEvent<HTMLCanvasElement>, gl: WebGLRenderingContext, program: WebGLProgram) {
    // const x = event.clientX - canvasContaner.current!.offsetLeft; // 将鼠标位置转换为 WebGL 坐标系
    // const y = event.clientY - canvasContaner.current!.offsetTop; // 将鼠标位置转换为 WebGL 坐标系
    // pointList.push(x, y, 10.0);
    // if (pointList.length % 3 == 0) {
    //   const a_positon = gl.getAttribLocation(program, 'a_position'); // 获取顶点位置属性的位置
    //   const a_color = gl.getAttribLocation(program, 'a_color'); // 获取颜色属性的位置
    //   const screenSize = gl.getUniformLocation(program, 'screenSize'); // 获取屏幕大小的 uniform 位置
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);
    //   gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * 3, 0); // 指定顶点属性的格式
    //   gl.uniform2f(screenSize, gl.canvas.width, gl.canvas.height); // 设置屏幕大小 uniform
    //   gl.enableVertexAttribArray(a_positon); // 启用顶点属性数组
    //   gl.vertexAttrib4f(a_color, 1, 0, 0, 1); // 设置颜色
    //   gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置清除颜色为黑色
    //   gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
    //   gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 3); // 绘制三角形
    // }
  }

  return (
    <div ref={threeContainer} id="three-container" className="bg-amber-100 relative w-screen h-screen flex flex-col justify-center items-center">
      <span className="mb-2">webgl002-矩形</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10" onMouseDown={(event) => handleClick(event, gl!, program!)}></canvas>
    </div>
  );
}
