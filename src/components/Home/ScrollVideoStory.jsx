import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoStory() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const hintRef = useRef(null);
  
  // Iniciamos en 0 para que la primera tarjeta esté presente
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Caminar hacia afuera...", body: "Para encontrarte por dentro. Una pausa necesaria en las montañas de Medellín.", tag: "Bienvenido a Vita Tours", img: "/img/home/img1.jpg" },
    { title: "La naturaleza regula tu sistema nervioso", body: "Cambiamos el ruido de la ciudad por el susurro del río y la calma del bosque.", tag: "Conexión Real", img: "/img/home/img2.jpg" },
    { title: "Psicología aplicada a la vida real", body: "Conversaciones guiadas sobre ansiedad, estrés y propósito mientras el cuerpo se mueve.", tag: "Espacio Seguro", img: "/img/home/img3.jpg" },
    { title: "No es solo un tour, es una transformación", body: "Sal del estancamiento mental. El movimiento libera lo que las palabras a veces no pueden.", tag: "Bienestar en Movimiento", img: "/img/home/img3.jpg" },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const video = videoRef.current;
      if (!video) return;

      const esMovil = window.innerWidth < 768;

      // 1. Timeline del Video
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: esMovil ? 0.4 : 1,
          onUpdate: (self) => {
            // Lógica corregida para detectar los 4 pasos correctamente
            const progress = self.progress;
            let current;
            
            if (progress < 0.25) current = 0;
            else if (progress < 0.50) current = 1;
            else if (progress < 0.75) current = 2;
            else current = 3;

            setStep(current);
            
            gsap.to(hintRef.current, {
              opacity: progress > 0.05 ? 0 : 1,
              duration: 0.3
            });
          }
        }
      });

      video.onloadedmetadata = () => {
        tl.fromTo(video, 
          { currentTime: 0 }, 
          { currentTime: video.duration || 1, ease: "none" }
        );
      };

      video.load();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Animación de entrada al cambiar de paso
  useEffect(() => {
    gsap.fromTo([textRef.current, imgRef.current], 
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out", stagger: 0.1 }
    );
  }, [step]);

  return (
    /* Ajuste de altura: menos scroll en móvil (300vh) que en desktop (500vh) */
    <section ref={sectionRef} className="relative h-[300vh] md:h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <video
          ref={videoRef}
          src="/videos/home/hero-home.mp4"
          muted playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] contrast-[1.05]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-12">
            
            {/* Texto con bordes LG y títulos más pequeños */}
            <div ref={textRef} className="max-w-lg bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-lg border border-white/10 shadow-2xl">
              <span className="inline-block text-[#38F5C4] font-medium text-[9px] md:text-xs uppercase mb-3 bg-[#38F5C4]/10 px-3 py-1 rounded-full tracking-widest">
                {steps[step].tag}
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-5 uppercase tracking-tight leading-tight">
                {steps[step].title}
              </h2>
              <p className="text-sm md:text-lg text-white/70 leading-relaxed font-light">
                {steps[step].body}
              </p>
            </div>

            {/* Imagen con bordes LG */}
            <div ref={imgRef} className="shrink-0">
              <img 
                src={steps[step].img} 
                alt={steps[step].title}
                className="w-36 h-48 md:w-72 md:h-[400px] object-cover rounded-lg border border-white/20 shadow-2xl" 
              />
            </div>
          </div>
        </div>

        {/* Indicador de Scroll */}
        <div ref={hintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">Desliza</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#38F5C4] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-scroll-line" />
          </div>
        </div>

        {/* Puntos laterales */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 transition-all duration-500 rounded-full ${
                step === i ? "h-6 md:h-8 bg-[#38F5C4]" : "h-1.5 md:h-2 bg-white/20"
              }`} 
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}