import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollVideoStory() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const requestRef = useRef();
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  const steps = [
    { 
      at: 0, 
      title: "Caminar hacia afuera...", 
      body: "Para encontrarte por dentro. Una pausa necesaria en las montañas de Medellín.",
      tag: "Bienvenido a Vita Tours",
      img: "/img/home/img1.jpg"
    },
    { 
      at: 0.25, 
      title: "La naturaleza regula tu sistema nervioso", 
      body: "Cambiamos el ruido de la ciudad por el susurro del río y la calma del bosque.",
      tag: "Conexión Real",
      img: "/img/home/img2.jpg"
    },
    { 
      at: 0.50, 
      title: "Psicología aplicada a la vida real", 
      body: "Conversaciones guiadas sobre ansiedad, estrés y propósito mientras el cuerpo se mueve.",
      tag: "Espacio Seguro",
      img: "/img/home/img3.jpg"
    },
    { 
      at: 0.75, 
      title: "No es solo un tour, es una transformación", 
      body: "Sal del estancamiento mental. El movimiento libera lo que las palabras a veces no pueden.",
      tag: "Bienestar en Movimiento",
      img: "/img/home/img3.jpg"
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!section || !video || !canvas) return;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      const cw = canvas.width, ch = canvas.height;
      const vw = video.videoWidth || cw;
      const vh = video.videoHeight || ch;
      const scale = Math.max(cw / vw, ch / vh);
      const w = vw * scale;
      const h = vh * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(video, x, y, w, h);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const update = () => {
      const diff = targetTimeRef.current - currentTimeRef.current;
      currentTimeRef.current += diff * 0.1;

      if (video.duration && Math.abs(diff) > 0.001) {
        video.currentTime = currentTimeRef.current;
        draw();
      }
      requestRef.current = requestAnimationFrame(update);
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const currentProgress = total > 0 ? passed / total : 0;
      
      setProgress(currentProgress);

      if (video.duration) {
        targetTimeRef.current = currentProgress * video.duration;
      }

      let s = 0;
      steps.forEach((step, i) => {
        if (currentProgress >= step.at) s = i;
      });
      setStep(s);
    };

    // 1. Forzar carga y "despertar" el video para producción
    video.load();
    
    const startApp = async () => {
      try {
        await video.play();
        video.pause();
        resize();
        requestRef.current = requestAnimationFrame(update);
      } catch (err) {
        console.warn("Video auto-play blocked, interaction needed or muted missing.");
        resize();
        requestRef.current = requestAnimationFrame(update);
      }
    };

    if (video.readyState >= 2) {
      startApp();
    } else {
      video.addEventListener("loadeddata", startApp);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/home/hero-home.mp4"
          muted playsInline preload="auto"
          className="hidden"
        />

        <canvas 
          ref={canvasRef} 
          className="block w-full h-full object-cover contrast-[1.02] brightness-[0.98]" 
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/70" />

        <div className="absolute inset-0 flex items-center justify-center px-8 md:px-24 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-12">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${step}`}
                initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl bg-black/20 backdrop-blur-md p-8 rounded-xl border border-white/10"
              >
                <span className="inline-block text-[#38F5C4] font-medium tracking-wider text-xs uppercase mb-3 bg-[#38F5C4]/10 px-3 py-1 rounded-full">
                  {steps[step].tag}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                  {steps[step].title}
                </h2>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  {steps[step].body}
                </p>
              </motion.div>

              <motion.div
                key={`img-${step}`}
                initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="shrink-0"
              >
                <img 
                  src={steps[step].img} 
                  alt={steps[step].title} 
                  className="w-48 h-72 md:w-80 md:h-112.5 object-cover rounded-xl border border-white/10 shadow-2xl" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {progress < 0.05 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/50 text-xs uppercase tracking-widest">Desliza para sentir</span>
            <div className="w-px h-12 bg-linear-to-b from-[#38F5C4] to-transparent animate-pulse" />
          </motion.div>
        )}

        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`w-1 transition-all duration-500 rounded-full ${
                step === i ? "h-8 bg-[#38F5C4]" : "h-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}