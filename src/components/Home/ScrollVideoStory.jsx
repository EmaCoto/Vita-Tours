import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoStory() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [step, setStep] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const steps = [
    { at: 0, title: "Caminar hacia afuera...", body: "Para encontrarte por dentro. Una pausa necesaria en las montañas de Medellín.", tag: "Bienvenido a Vita Tours", img: "/img/home/img1.jpg" },
    { at: 1, title: "La naturaleza regula tu sistema nervioso", body: "Cambiamos el ruido de la ciudad por el susurro del río y la calma del bosque.", tag: "Conexión Real", img: "/img/home/img2.jpg" },
    { at: 2, title: "Psicología aplicada a la vida real", body: "Conversaciones guiadas sobre ansiedad, estrés y propósito mientras el cuerpo se mueve.", tag: "Espacio Seguro", img: "/img/home/img3.jpg" },
    { at: 3, title: "No es solo un tour, es una transformación", body: "Sal del estancamiento mental. El movimiento libera lo que las palabras a veces no pueden.", tag: "Bienestar en Movimiento", img: "/img/home/img3.jpg" },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const currentStep = Math.floor(self.progress * (steps.length - 0.01));
          setStep(currentStep);
          // Ocultar el "Desliza" después del 5% de progreso
          if (self.progress > 0.05) setShowScrollHint(false);
          else setShowScrollHint(true);
        }
      }
    });

    video.onloadedmetadata = () => {
      tl.fromTo(video, 
        { currentTime: 0 }, 
        { currentTime: video.duration || 1, ease: "none" }
      );
    };

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <video
          ref={videoRef}
          src="/videos/home/hero-home.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-8">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${step}`}
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="max-w-xl bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10"
              >
                <span className="inline-block text-[#38F5C4] font-medium text-[10px] uppercase mb-3 bg-[#38F5C4]/10 px-3 py-1 rounded-full tracking-widest">
                  {steps[step].tag}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tighter">
                  {steps[step].title}
                </h2>
                <p className="text-base md:text-lg text-white/70 leading-relaxed font-light">
                  {steps[step].body}
                </p>
              </motion.div>

              <motion.div
                key={`img-${step}`}
                initial={{ opacity: 0, scale: 0.9, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, x: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="shrink-0"
              >
                <img 
                  src={steps[step].img} 
                  className="w-44 h-64 md:w-80 md:h-[450px] object-cover rounded-xl border border-white/20 shadow-2xl" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* INDICADOR: Desliza para sentir */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div 
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
            >
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Desliza para sentir
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#38F5C4] to-transparent relative overflow-hidden">
                <motion.div 
                  animate={{ y: [0, 48] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-white/60"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puntos de navegación lateral */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 transition-all duration-300 rounded-full ${
                step === i ? "h-6 bg-[#38F5C4]" : "h-2 bg-white/20"
              }`} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}