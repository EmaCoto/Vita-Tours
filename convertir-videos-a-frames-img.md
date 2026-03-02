# 📦 Instalación y uso de FFmpeg para extraer frames

## 🛠 Instalación en Windows

1. Descargar FFmpeg desde:
   https://www.gyan.dev/ffmpeg/builds/

2. Descargar en versiones de lanzamiento: **ffmpeg-release-essentials.zip**.

3. Extraer el archivo `.zip`.

4. Copiar la ruta de la carpeta `bin`.  
   Ejemplo:

   C:\ffmpeg\bin

5. Agregar esa ruta en:

   Variables del sistema → Path

6. Verificar instalación abriendo una nueva terminal y ejecutando:

```bash
ffmpeg -version
```

Si muestra información de versión, la instalación fue exitosa.

---

## 🎬 Extraer imágenes (frames) de un video

Comando utilizado:

```bash
ffmpeg -i video.mp4 -vf fps=10 -q:v 5 frame_%04d.jpg
```

### 📌 Explicación del comando

- `-i video.mp4` → Archivo de entrada.
- `-vf fps=10` → Extrae **10 imágenes por segundo** del video.
- `-q:v 5` → Calidad del JPG (1 = máxima calidad / valores más altos = mayor compresión).
- `frame_%04d.jpg` → Nombre de salida numerado automáticamente (0001, 0002, 0003...).

---

## 🧮 Cálculo de cantidad total de imágenes

Fórmula:

```
fps × duración del video (en segundos)
```

Ejemplo:

Si el video dura **5 segundos** y usas:

```
fps=10
```

Resultado:

```
10 × 5 = 50 imágenes
```

---

## 🎯 Ajustar cantidad de imágenes

Para generar menos imágenes, reduce el valor de `fps`.

Ejemplos:

- `fps=1` → 1 imagen por segundo
- `fps=2` → 2 imágenes por segundo
- `fps=5` → 5 imágenes por segundo
- `fps=10` → 10 imágenes por segundo