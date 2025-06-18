import { useRef, useEffect, use, type MouseEvent } from 'react';
import img from '../../../public/test.jpg';
//纹理

//创建顶点着色器
const vertexShaderSource = `
  attribute vec4 a_position;
  uniform vec2 screenSize; 
  attribute vec2 a_texCoord;
  varying vec2 v_TexCoord;
  void main() {
  float x = a_position.x * 2.0 / screenSize.x - 1.0; 
  float y = 1.0 - (a_position.y * 2.0 / screenSize.y); 
    gl_Position = vec4(x, y, 0.0, 1.0); 
    v_TexCoord = a_texCoord; 
  }
`;
// 创建片段着色器
const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_sampler; // 纹理采样器
  void main() {
    gl_FragColor = texture2D(u_sampler, v_TexCoord); // 从纹理中获取颜色
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
  const a_texCoord = gl.getAttribLocation(program, 'a_texCoord'); // 获取颜色属性的位置
  const screenSize = gl.getUniformLocation(program, 'screenSize'); // 获取屏幕大小的 uniform 位置
  const u_sampler = gl.getUniformLocation(program, 'u_sampler'); // 获取纹理采样器的 uniform 位置
  // const indexBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // 绑定索引缓冲区
  const positonBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positonBuffer); // 绑定顶点缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([50.0, 50.0, 0, 0, 50, 200, 0, 1, 250, 200, 1, 1, 250, 200, 1, 1, 250, 50, 1, 0, 50.0, 50.0, 0, 0]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * 4, 0); // 指定顶点属性的格式
  gl.uniform2f(screenSize, gl.canvas.width, gl.canvas.height); // 设置屏幕大小 uniform
  gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 4 * 4, 4 * 2); // 指定纹理坐标属性的格式
  gl.enableVertexAttribArray(a_positon); // 启用顶点属性数组
  gl.enableVertexAttribArray(a_texCoord); // 启用纹理坐标属性数组
  // 创建纹理
  const texture = gl.createTexture();
  // 创建一个图像对象
  const image = new Image();
  image.src = img; // 设置图像源
  image.onload = () => {
    console.log('image', image);
    // 当图像加载完成后，绑定纹理并上传图像数据
    gl.activeTexture(gl.TEXTURE0); // 激活纹理单元0};
    gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象
    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // 设置纹理环绕方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // 设置纹理环绕方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // 设置纹理过滤方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // 设置纹理过滤方式

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // 上传图像数据

    gl.uniform1i(u_sampler, 0); // 设置纹理采样器的 uniform 位置
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置清除颜色为黑色
    gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区
    gl.drawArrays(gl.TRIANGLES, 0, 6); // 绘制三角形
  };

  gl.clear(gl.COLOR_BUFFER_BIT); // 清除颜色缓冲区

  console.log('%c Triangle drawn', 'color: #00ff00;');
}

export function Gl006() {
  useEffect(() => {
    const { gl: gl1, program: program1 } = initgl(canvasContaner.current as HTMLCanvasElement);
    (gl = gl1), (program = program1);
    drawTriangle(gl!, program!);
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
      <span className="mb-2">webgl002-纹理</span>
      <canvas ref={canvasContaner} id="three-canvas" className=" w-9/10  h-9/10" onMouseDown={(event) => handleClick(event, gl!, program!)}></canvas>
    </div>
  );
}
