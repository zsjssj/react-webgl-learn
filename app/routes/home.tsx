import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { ThreeTest } from '../three/three';
import { ThreeExam001 } from '../three/exam/index001';
import { ThreeExam002 } from '../three/exam/index002';
import { Gl001 } from '../three/webgl/index001';
// import { Gl002 } from '../three/webgl/index002';
import { Gl003 } from '../three/webgl/index003';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ReactRouterApp' }, { name: 'description', content: 'three test!' }];
}

export default function Home() {
  // return <Welcome />;
  // return <ThreeTest />;
  // return <ThreeExam001 />;
  // return <ThreeExam002 />;
  return <Gl003 />;
}
