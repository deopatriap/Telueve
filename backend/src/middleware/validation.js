import { z } from 'zod';

// Schema untuk membuat event
export const createEventSchema = z.object({
  nama_event: z.string().min(3, "Nama event minimal 3 karakter"),
  deskripsi: z.string().optional(),
  tanggal_event: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), "Format tanggal tidak valid"),
  waktu_event: z.string().optional(),
  jam_mulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam mulai harus HH:mm").optional(),
  jam_selesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam selesai harus HH:mm").optional(),
  tempat: z.string().min(3, "Tempat minimal 3 karakter"),
  kuota_peserta: z.number().int().positive().optional(),
});

// Schema untuk update event
export const updateEventSchema = createEventSchema.partial();

// Schema untuk registrasi status update
export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected'], {
    errorMap: () => ({ message: "Status harus pending, accepted, atau rejected" })
  })
});

/**
 * Middleware factory untuk validasi request body menggunakan Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse(req.body);
    req.body = validData; // Replace body with validated data (cleaned)
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(error);
  }
};
