import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TourDetailHero({ tour, totalFrames, framePath }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null); // Ref para el indicador de scroll
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const tmpImages = [];

    const loadSequence = async () => {
      const promises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          const frameNumber = String(i + 1).padStart(4, '0');
          img.src = `${framePath}frame_${frameNumber}.jpg`;
          img.onload = () => {
            loadedCount++;
            tmpImages[i] = img;
            if (i === 0) renderFrame(img); 
            resolve();
          };
          img.onerror = () => resolve();
        });
      });
      await Promise.all(promises);
      imagesRef.current = tmpImages;
      setImagesLoaded(true);
    };

    const renderFrame = (img) => {
      if (!canvasRef.current || !img) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, w, h);
    };

    loadSequence();

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          // Lógica del Canvas
          if (imagesRef.current.length > 0) {
            const frameIndex = Math.min(
              Math.floor(self.progress * totalFrames),
              totalFrames - 1
            );
            renderFrame(imagesRef.current[frameIndex]);
          }

          // Lógica de opacidad del indicador "Desliza"
          const p = self.progress;
          gsap.to(hintRef.current, { 
            opacity: p > 0.05 ? 0 : 1, 
            duration: 0.3,
            overwrite: true 
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [imagesLoaded, totalFrames, framePath]);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Canvas de fondo */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.05]" 
        />
        
        {/* Overlay para contraste */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40" />

        {/* Contenido Central */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full text-center">
             <span className="inline-block text-black font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 bg-[#38F5C4] px-4 py-1 rounded-full">
                {tour.tag}
              </span>
              <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic leading-none mb-6 drop-shadow-lg">
                {tour.nombre}
              </h1>
              <p className="text-lg text-white md:text-xl font-light italic bg-black/40 backdrop-blur-xl border border-white/10 inline-block px-6 py-2 rounded-lg">
                "{tour.titulo}"
              </p>
          </div>
        </div>

        {/* INDICADOR: Desliza para sentir */}
        <div ref={hintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Desliza para sentir
          </span>
          <div className="w-px h-12 bg-linear-to-b from-[#38F5C4] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-scroll-line" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .animate-scroll-line { animation: scroll-line 2s infinite ease-in-out; }
      `}</style>
    </section>
  );
}