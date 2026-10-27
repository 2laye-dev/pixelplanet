'use client';
import {useEffect,useRef,useState} from 'react';

type Cue='click'|'tick'|'stage';
export function useInterfaceSound(){
 const [sound,setSound]=useState(true);
 const enabled=useRef(true);
 const play=useRef<(cue:Cue)=>void>(()=>{});
 useEffect(()=>{
  let context:AudioContext|null=null,master:GainNode|null=null,lastTick=0;
  const voices=new Set<OscillatorNode>();
  try{enabled.current=localStorage.getItem('pixelplanet:sound')!=='off';}catch{}
  setSound(enabled.current);
  function unlock(){
   if(!enabled.current||document.hidden)return;
   try{
    if(!context){context=new AudioContext();master=context.createGain();master.gain.value=.28;master.connect(context.destination);}
    if(context.state==='suspended')void context.resume().catch(()=>{});
   }catch{/* Audio is optional; ordinary interactions continue. */}
  }
  function cue(kind:Cue){
   if(!enabled.current||document.hidden||!context||context.state!=='running'||!master)return;
   const now=context.currentTime;
   if(kind==='tick'&&now-lastTick<.055)return;
   if(kind==='tick')lastTick=now;
   const voice=context.createOscillator(),gain=context.createGain();
   const duration=kind==='stage'?.16:kind==='click'?.065:.026;
   voice.type=kind==='stage'?'sine':'triangle';
   voice.frequency.setValueAtTime(kind==='stage'?660:kind==='click'?1250:1700,now);
   voice.frequency.exponentialRampToValueAtTime(kind==='stage'?330:kind==='click'?380:1050,now+duration);
   gain.gain.setValueAtTime(.0001,now);
   gain.gain.exponentialRampToValueAtTime(kind==='tick'?.08:.2,now+.003);
   gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   voice.connect(gain);gain.connect(master);voices.add(voice);
   voice.onended=()=>{voices.delete(voice);voice.disconnect();gain.disconnect();};
   voice.start(now);voice.stop(now+duration+.01);
  }
  play.current=(kind)=>{unlock();if(context?.state==='running')cue(kind);else if(context)void context.resume().then(()=>cue(kind)).catch(()=>{});};
  const click=(event:MouseEvent)=>{
   const control=event.target instanceof Element?event.target.closest('a,button,summary,[role="button"],input[type="checkbox"],input[type="radio"],select'):null;
   if(!control||control.matches('.sound-button,:disabled,[aria-disabled="true"]'))return;
   play.current('click');
  };
  const process=(event:Event)=>{const kind=(event as CustomEvent<Cue>).detail;if(kind==='tick'||kind==='stage')cue(kind);};
  const visibility=()=>{if(document.hidden&&context)void context.suspend().catch(()=>{});else if(enabled.current&&context)void context.resume().catch(()=>{});};
  const preference=()=>{if(master&&context)master.gain.setTargetAtTime(enabled.current?.28:0,context.currentTime,.015);};
  window.addEventListener('pointerdown',unlock,{passive:true});window.addEventListener('keydown',unlock);
  document.addEventListener('click',click,true);window.addEventListener('pixelplanet:process-sound',process);
  window.addEventListener('pixelplanet:sound-preference',preference);document.addEventListener('visibilitychange',visibility);
  return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);document.removeEventListener('click',click,true);window.removeEventListener('pixelplanet:process-sound',process);window.removeEventListener('pixelplanet:sound-preference',preference);document.removeEventListener('visibilitychange',visibility);play.current=()=>{};voices.forEach(v=>v.stop());if(context)void context.close().catch(()=>{});};
 },[]);
 function toggleSound(){enabled.current=!enabled.current;setSound(enabled.current);try{localStorage.setItem('pixelplanet:sound',enabled.current?'on':'off');}catch{}window.dispatchEvent(new Event('pixelplanet:sound-preference'));if(enabled.current)play.current('click');}
 return {sound,toggleSound};
}
