import { defineCollection, z } from 'astro:content';

const tours = defineCollection({
  type: 'content',
  schema: z.object({
    tag: z.string(),
    nombre: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    fechaSalida: z.string(),
    horaSalida: z.string(),
    puntoEncuentro: z.string(),
    lugarDestino: z.string(),
    loQueIncluye: z.array(z.string()),
    loQueNoIncluye: z.array(z.string()).optional(),
    duracion: z.string(),
    imagen: z.string(), // Ruta a la imagen en public/img/tours/
  }),
});

export const collections = { tours };