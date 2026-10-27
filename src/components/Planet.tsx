'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Offscreen luminance controls individual dot diameters; this is not a static overlay.
const fragmentShader = `
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uHero;
  uniform float uPitch;
  uniform vec2 uPointer;
  varying vec2 vUv;
  float noise(vec2 p) {return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main() {
    vec2 pixel=vUv*uResolution;
    vec2 cell=floor(pixel/uPitch);
    vec2 sampleUv=(cell+.5)*uPitch/uResolution;
    vec2 p=sampleUv*vec2(uResolution.x/uResolution.y,1.)+uPointer*.035;
    float wave=sin(p.x*5.4+sin(p.y*4.2-uTime*.22)*1.8+uTime*.17);
    wave+=.6*sin(p.y*8.1+p.x*2.1-uTime*.25);
    float field=smoothstep(-1.2,1.5,wave);
    vec4 shape=texture2D(uScene,sampleUv);
    float light=dot(shape.rgb,vec3(.2126,.7152,.0722));
    // The moving light field spans the entire viewport, including outside the relief.
    float cloud=.5+.25*sin(p.x*3.2+sin(p.y*2.4+uTime*.12)*1.4)+.25*cos(p.y*4.1+sin(p.x*2.1-uTime*.08)*1.7);
    float signal=pow(light,1.35)*shape.a*uHero;
    float ambient=(.025+cloud*.10)*(1.-shape.a*uHero*.65);
    float radius=clamp(.035+ambient+signal*.43,.035,.48);
    float distance=length(fract(pixel/uPitch)-.5);
    float dots=1.-smoothstep(radius-.045,radius+.025,distance);
    float grey=mix(.012+field*.06,.30+cloud*.16,uHero)-shape.a*uHero*.045;
    float glow=mix(.22+field*.24,.72,uHero);
    glow=mix(glow,.98,smoothstep(.15,.7,signal));
    float grain=(noise(pixel+fract(uTime)*.01)-.5)*.035;
    gl_FragColor=vec4(vec3(mix(grey,glow,dots)+grain),1.);
  }
`;
export default function Planet(){
 const container=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=container.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(37,1,.1,100);camera.position.z=10;
  const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.025);scene.environment=environment.texture;room.dispose();
  const geometry=new THREE.SphereGeometry(2.05,96,64);
  // A gently folded chrome sphere gives broad reflected ribbons instead of a knot.
  const positions=geometry.attributes.position;
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);const fold=1+.07*Math.sin(y*2.2+x*.8)*Math.cos(z*1.4);positions.setXYZ(i,x*fold,y*fold,z*fold);}
  geometry.computeVertexNormals();
  const material=new THREE.MeshPhysicalMaterial({color:0xe9e9e9,metalness:1,roughness:.13});
  const sculpture=new THREE.Mesh(geometry,material);scene.add(sculpture);
  const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-2,4,5);scene.add(key);
  const target=new THREE.WebGLRenderTarget(1,1,{depthBuffer:true});
  const uniforms={uScene:{value:target.texture},uResolution:{value:new THREE.Vector2(1,1)},uTime:{value:0},uHero:{value:1},uPitch:{value:5.5},uPointer:{value:new THREE.Vector2()}};
  const postMaterial=new THREE.ShaderMaterial({uniforms,fragmentShader,vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',depthTest:false,depthWrite:false});
  const plane=new THREE.PlaneGeometry(2,2);const postScene=new THREE.Scene();postScene.add(new THREE.Mesh(plane,postMaterial));const postCamera=new THREE.Camera();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,last=0,elapsed=0,disposed=false;const pointer=new THREE.Vector2();
  const resize=()=>{const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height);target.setSize(Math.max(1,Math.round(width*.6)),Math.max(1,Math.round(height*.6)));uniforms.uResolution.value.set(width,height);uniforms.uPitch.value=width<600?5:5.5;camera.aspect=width/height;camera.updateProjectionMatrix();sculpture.scale.setScalar(width<600?.52:1);sculpture.position.set(width<600?-.55:-.8,width<600?-1.25:.45,0);draw(0,true);};
  function draw(now:number,force=false){if(disposed||document.hidden)return;if(!force&&now-last<33)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches&&!force)elapsed+=dt;uniforms.uTime.value=elapsed;uniforms.uHero.value=Math.max(0,1-window.scrollY/window.innerHeight);uniforms.uPointer.value.lerp(pointer,.035);sculpture.rotation.set(.25+Math.sin(elapsed*.13)*.4,elapsed*.12,-.5+Math.sin(elapsed*.09)*.4);if(uniforms.uHero.value>0){renderer.setRenderTarget(target);renderer.clear();renderer.render(scene,camera);}renderer.setRenderTarget(null);renderer.render(postScene,postCamera);}
  function loop(now:number){frame=0;draw(now);if(!reduced.matches&&!document.hidden)frame=requestAnimationFrame(loop);}
  const restart=()=>{cancelAnimationFrame(frame);frame=0;if(!document.hidden){draw(performance.now(),true);if(!reduced.matches)frame=requestAnimationFrame(loop);}};
  const scroll=()=>{if(reduced.matches)draw(performance.now(),true);};const move=(event:PointerEvent)=>pointer.set(event.clientX/innerWidth-.5,event.clientY/innerHeight-.5);
  const ro=new ResizeObserver(resize);ro.observe(host);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);resize();restart();host.classList.add('ready');
  return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',restart);reduced.removeEventListener('change',restart);geometry.dispose();material.dispose();plane.dispose();postMaterial.dispose();target.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={container} className="halftone-backdrop" aria-hidden="true"/>;
}

