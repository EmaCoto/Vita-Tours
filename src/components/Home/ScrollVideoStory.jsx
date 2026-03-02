import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const totalFrames = 50; 
const frameBaseUrl = "/img/home/videos/hero-home/frame_"; 

export default function ScrollVideoStory() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const hintRef = useRef(null);

  const [step, setStep] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]); 

  const steps = [
    { title: "Caminar hacia afuera...", body: "Para encontrarte por dentro. Una pausa necesaria en las montañas de Medellín.", tag: "Bienvenido a Vita Tours", img: "/img/home/img1.jpg" },
    { title: "La naturaleza regula tu sistema nervioso", body: "Cambiamos el ruido de la ciudad por el susurro del río y la calma del bosque.", tag: "Conexión Real", img: "/img/home/img2.jpg" },
    { title: "Psicología aplicada a la vida real", body: "Conversaciones guiadas sobre ansiedad, estrés y propósito mientras el cuerpo se mueve.", tag: "Espacio Seguro", img: "/img/home/img3.jpg" },
    { title: "No es solo un tour, es una transformación", body: "Sal del estancamiento mental. El movimiento libera lo que las palabras a veces no pueden.", tag: "Bienestar en Movimiento", img: "/img/home/img3.jpg" },
  ];

  useEffect(() => {
    let loadedCount = 0;
    const tmpImages = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(4, '0');
      img.src = `${frameBaseUrl}${frameNumber}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => console.error("Error cargando frame:", img.src);
      tmpImages.push(img);
    }
    imagesRef.current = tmpImages;

    let ctx = gsap.context(() => {
      if (!imagesLoaded) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const renderFrame = (index) => {
        const img = imagesRef.current[index];
        if (!img || !img.complete) return;

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, w, h);
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(Math.floor(ScrollTrigger.getById("videoScroll")?.progress * (totalFrames - 1)) || 0);
      };

      window.addEventListener("resize", resize);
      resize();

      gsap.to({}, {
        scrollTrigger: {
          id: "videoScroll",
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, 
          onUpdate: (self) => {
            const frameIndex = Math.min(
              Math.floor(self.progress * totalFrames),
              totalFrames - 1
            );
            renderFrame(frameIndex);

            const p = self.progress;
            if (p < 0.25) setStep(0);
            else if (p < 0.50) setStep(1);
            else if (p < 0.75) setStep(2);
            else setStep(3);

            gsap.to(hintRef.current, { opacity: p > 0.05 ? 0 : 1, duration: 0.3 });
          }
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", () => {});
    };
  }, [imagesLoaded]);

  useEffect(() => {
    if (imagesLoaded) {
      gsap.fromTo([textRef.current, imgRef.current], 
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out", stagger: 0.1 }
      );
    }
  }, [step, imagesLoaded]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] md:h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-50 bg-black">
            <span className="animate-pulse tracking-widest uppercase text-xs">Cargando experiencia...</span>
          </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.05]" />

        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-12">
            
            <div ref={textRef} className="max-w-lg bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-lg border border-white/10">
              <span className="inline-block text-[#38F5C4] font-medium text-base md:text-sm uppercase mb-3 bg-[#38F5C4]/10 px-3 py-1 rounded-full tracking-widest">
                {steps[step].tag}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                {steps[step].title}
              </h2>
              <p className="text-md md:text-lg text-white/80 leading-relaxed font-light">
                {steps[step].body}
              </p>
            </div>

            <div ref={imgRef} className="shrink-0">
              <img src={steps[step].img} className="w-98 h-48 md:w-127 md:h-96 object-cover rounded-lg border border-white/20 shadow-2xl" />
            </div>
          </div>
        </div>

        {/* INDICADOR REESTABLECIDO: Desliza para sentir */}
        <div ref={hintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Desliza para sentir
          </span>
          <div className="w-px h-12 bg-linear-to-b from-[#38F5C4] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-scroll-line" />
          </div>
        </div>

        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {steps.map((_, i) => (
            <div key={i} className={`w-1 transition-all duration-500 rounded-full ${step === i ? "h-8 bg-[#38F5C4]" : "h-2 bg-white/20"}`} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .animate-scroll-line { animation: scroll-line 2s infinite ease-in-out; }
      `}</style>
    </section>
  );
}