'use client';
import { useEffect, useRef } from 'react';

const stages = [
  { title:'یک مسیر روشن.\nاز گفت‌وگو تا انتشار.', text:'', label:'شروع مسیر' },
  { title:'اول، پروژه شما را می‌شناسم.', text:'درباره هدف، مخاطب و نیازهای واقعی کسب‌وکارتان گفت‌وگو می‌کنیم.', label:'شناخت پروژه' },
  { title:'ایده، شکل می‌گیرد.', text:'ساختار و طرح را می‌بینید؛ با بازخورد شما، جزئیات کامل و پیاده‌سازی می‌شوند.', label:'طراحی و ساخت' },
  { title:'وب‌سایت شما، آماده انتشار.', text:'نمایش در موبایل، عملکرد و مسیرهای اصلی را بررسی می‌کنیم و سایت را تحویل می‌دهیم.', label:'تست و راه‌اندازی' },
];
export default function Process() {
  const root=useRef<HTMLElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const section=root.current!, drawing=canvas.current!;
    const context=drawing.getContext('2d');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const cards=Array.from(section.querySelectorAll<HTMLElement>('.process-frame'));
    const labels=Array.from(section.querySelectorAll<HTMLElement>('.ruler-label'));
    let scheduled=0,lastTick:number|null=null,lastStage:number|null=null;
    function draw(){
      scheduled=0;
      if(reduced.matches){section.classList.remove('motion-ready');cards.forEach(card=>{card.removeAttribute('style');card.removeAttribute('aria-hidden');});return;}
      section.classList.add('motion-ready');
      const rect=section.getBoundingClientRect();
      const progress=Math.max(0,Math.min(3,-rect.top/(section.offsetHeight-innerHeight)*3));
      const tick=Math.round(progress*18),stage=Math.round(progress);
      if(rect.top<=0&&rect.bottom>=innerHeight){
        if(lastStage!==null&&stage!==lastStage)window.dispatchEvent(new CustomEvent('pixelplanet:process-sound',{detail:'stage'}));
        else if(lastTick!==null&&tick!==lastTick)window.dispatchEvent(new CustomEvent('pixelplanet:process-sound',{detail:'tick'}));
        lastTick=tick;lastStage=stage;
      }else{lastTick=null;lastStage=null;}
      section.dataset.stage=String(Math.round(progress));
      cards.forEach((card,index)=>{
        const distance=index-progress, fade=Math.max(0,Math.min(1,(.7-Math.abs(distance))/.28));
        card.style.opacity=String(fade);card.style.transform=`translate3d(0,${distance*72}px,0)`;card.style.filter=`blur(${(1-fade)*5}px)`;
        card.setAttribute('aria-hidden',String(Math.abs(distance)>.5));
      });
      const width=drawing.clientWidth,height=drawing.clientHeight;
      if(!context||!width||!height)return;
      const dpr=Math.min(devicePixelRatio,1.5);
      if(drawing.width!==Math.round(width*dpr)||drawing.height!==Math.round(height*dpr)){drawing.width=Math.round(width*dpr);drawing.height=Math.round(height*dpr);}
      context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,width,height);
      const spacing=height/54, center=height*.5, offset=progress*spacing*18;
      for(let row=-50;row<110;row++){
        const angle=(row*spacing-offset)/(height*.48);
        if(Math.abs(angle)>Math.PI/2)continue;
        const curve=Math.cos(angle),y=center+Math.sin(angle)*height*.46;
        const visibility=Math.pow(curve,1.6);
        if(visibility<.015)continue;
        const major=row%18===0, count=major?29:row%6===0?20:11;
        for(let dot=0;dot<count;dot++){
          const dotGap=width<220?Math.min(3,width*.48/29):5.8;
          const x=width*.48+(1-curve)*width*.07+dot*dotGap;
          context.fillStyle=`rgba(242,242,237,${visibility*(major?1:.9)})`;
          context.beginPath();context.arc(x,y,(width<220?1:major?2.1:1.7)*(.4+visibility*.6),0,Math.PI*2);context.fill();
        }
      }
      labels.forEach((label,index)=>{
        const angle=(index-progress)*18*spacing/(height*.48), y=center+Math.sin(Math.max(-Math.PI/2,Math.min(Math.PI/2,angle)))*height*.46;
        label.style.top=`${y/height*100}%`;label.style.opacity=String(Math.abs(angle)>Math.PI/2?0:Math.pow(Math.cos(angle),1.6));
        label.style.transform=`translateY(-50%) perspective(500px) rotateX(${Math.max(-65,Math.min(65,angle*40))}deg)`;
      });
    }
    const schedule=()=>{if(!scheduled)scheduled=requestAnimationFrame(draw);};
    const observer=new ResizeObserver(schedule);observer.observe(section);
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);draw();
    return()=>{cancelAnimationFrame(scheduled);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);};
  },[]);
  return <section ref={root} id="process" className="process-story" aria-labelledby="process-title">
    <h2 className="sr-only" id="process-title">مراحل همکاری، از گفت‌وگو تا انتشار</h2>
    <div className="process-stage">
      <div className="process-ruler" aria-hidden="true"><canvas ref={canvas}/>{stages.map((stage,i)=><div className="ruler-label" key={stage.label}><span>{stage.label}</span><small>{i===0?'شروع':`مرحله ${i.toLocaleString('fa-IR')}`}</small></div>)}</div>
      <div className="process-copy">{stages.map((stage,i)=><article key={stage.label} className="process-frame">{i>0&&<p className="process-step"><i/>مرحله {i.toLocaleString('fa-IR',{minimumIntegerDigits:2})}</p>}<h3>{stage.title}</h3>{stage.text&&<p className="process-description">{stage.text}</p>}</article>)}</div>
      <a className="process-skip" href="#faq">رفتن به بخش بعدی</a>
    </div>
  </section>;
}
