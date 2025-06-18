import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { ThreeTest } from '../three/three';
import { ThreeExam001 } from '../three/exam/index001';
import { ThreeExam002 } from '../three/exam/index002';
import { Gl001 } from '../three/webgl/index001'; //绘制点
import { Gl002 } from '../three/webgl/index002'; //绘制三角形
import { Gl003 } from '../three/webgl/index003'; //线段、线条、回路线
import { Gl004 } from '../three/webgl/index004'; //绘制矩形
import { Gl005 } from '../three/webgl/index005'; //绘制圆形,圆环
import { Gl006 } from '../three/webgl/index006'; //
import { Gl007 } from '../three/webgl/index007'; // 数据计算 - 平移、旋转、缩放
// import { Gl008 } from '../three/webgl/index008'; // 数据计算 - 矩阵变换

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ReactRouterApp' }, { name: 'description', content: 'three test!' }];
}

export default function Home() {
  return <Gl007 />;
}
