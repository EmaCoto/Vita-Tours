import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registramos el plugin necesario para el scroll
gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoStory() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const hintRef = useRef(null);
  
  const [step, setStep] = useState(0);

  const steps = [
    { 
      title: "Caminar hacia afuera...", 
      body: "Para encontrarte por dentro. Una pausa necesaria en las montañas de Medellín.", 
      tag: "Bienvenido a Vita Tours", 
      img: "/img/home/img1.jpg" 
    },
    { 
      title: "La naturaleza regula tu sistema nervioso", 
      body: "Cambiamos el ruido de la ciudad por el susurro del río y la calma del bosque.", 
      tag: "Conexión Real", 
      img: "/img/home/img2.jpg" 
    },
    { 
      title: "Psicología aplicada a la vida real", 
      body: "Conversaciones guiadas sobre ansiedad, estrés y propósito mientras el cuerpo se mueve.", 
      tag: "Espacio Seguro", 
      img: "/img/home/img3.jpg" 
    },
    { 
      title: "No es solo un tour, es una transformación", 
      body: "Sal del estancamiento mental. El movimiento libera lo que las palabras a veces no pueden.", 
      tag: "Bienestar en Movimiento", 
      img: "/img/home/img3.jpg" 
    },
  ];

  useEffect(() => {
    // Uso de gsap.context para asegurar una limpieza total al desmontar el componente
    let ctx = gsap.context(() => {
      const video = videoRef.current;
      if (!video) return;

      const esMovil = window.innerWidth < 768;

      // 1. Configuración del Timeline de Scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: esMovil ? 0.5 : 1, // Más directo en móvil, más suave en escritorio
          onUpdate: (self) => {
            // Calculamos el paso actual basado en el progreso (0 a 1)
            const currentStep = Math.floor(self.progress * (steps.length - 0.01));
            if (currentStep !== step) setStep(currentStep);
            
            // Ocultar el indicador "Desliza" suavemente
            gsap.to(hintRef.current, {
              opacity: self.progress > 0.05 ? 0 : 1,
              pointerEvents: "none",
              duration: 0.3
            });
          }
        }
      });

      // 2. Vinculamos el progreso del scroll al tiempo del video
      video.onloadedmetadata = () => {
        tl.fromTo(video, 
          { currentTime: 0 }, 
          { currentTime: video.duration || 1, ease: "none" }
        );
      };

      // Forzar carga del video
      video.load();

    }, sectionRef);

    return () => ctx.revert(); // Limpia todos los triggers y animaciones
  }, []);

  // 3. Animación de entrada para el contenido cuando cambia el paso (Step)
  useEffect(() => {
    // Animación tipo "Fade in + Blur + Slide"
    gsap.fromTo([textRef.current, imgRef.current], 
      { opacity: 0, y: 30, filter: "blur(12px)" },
      { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)", 
        duration: 0.8, 
        ease: "power3.out", 
        stagger: 0.15 // El texto entra un poco antes que la imagen
      }
    );
  }, [step]);

  return (
    <section ref={sectionRef} className="relative h-[450vh] bg-black">
      {/* Contenedor Sticky */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Video de Fondo */}
        <video
          ref={videoRef}
          src="/videos/home/hero-home.mp4"
          muted 
          playsInline 
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
        />

        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />

        {/* Contenido Principal (Texto e Imagen) */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-10">
            
            {/* Bloque de Texto */}
            <div ref={textRef} className="max-w-xl bg-black/30 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl">
              <span className="inline-block text-[#38F5C4] font-semibold text-[10px] md:text-xs uppercase mb-4 bg-[#38F5C4]/15 px-4 py-1.5 rounded-full tracking-[0.2em]">
                {steps[step].tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight leading-[1.1]">
                {steps[step].title}
              </h2>
              <p className="text-base md:text-xl text-white/80 leading-relaxed font-light">
                {steps[step].body}
              </p>
            </div>

            {/* Imagen a la Derecha */}
            <div ref={imgRef} className="shrink-0">
              <img 
                src={steps[step].img} 
                alt={steps[step].title}
                className="w-48 h-64 md:w-80 md:h-125 object-cover rounded-xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
              />
            </div>
          </div>
        </div>

        {/* Indicador de Scroll ("Desliza para sentir") */}
        <div ref={hintRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <span className="text-white/50 text-[10px] uppercase tracking-[0.4em] font-medium">
            Desliza para sentir
          </span>
          <div className="w-px h-14 bg-linear-to-b from-[#38F5C4] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-scroll-line" />
          </div>
        </div>

        {/* Navegación Lateral (Puntos) */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 transition-all duration-500 rounded-full ${
                step === i ? "h-10 bg-[#38F5C4] shadow-[0_0_10px_#38F5C4]" : "h-2 bg-white/20"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Estilos para la línea animada y ajustes de Tailwind */}
      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2.5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}