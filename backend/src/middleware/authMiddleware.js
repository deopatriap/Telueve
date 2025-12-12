import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi JWT token
 * Mengecek apakah user sudah login
 */
export const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    console.log("🔐 Auth Header:", authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan.' 
      });
    }

    // Format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    console.log("🎫 Token:", token ? token.substring(0, 20) + "..." : "null");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Format token tidak valid.' 
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ Decoded JWT:", decoded);
    
    // PERBAIKAN: Simpan data user ke request object
    // Pastikan userId diambil dari decoded.user_id (bukan decoded.userId)
    req.user = {
      userId: decoded.user_id,  // ← PENTING: Ambil dari decoded.user_id
      email: decoded.email,
      role: decoded.role,
      username: decoded.username
    };
    
    console.log("👤 req.user set to:", req.user);
    console.log("👤 userId value:", req.user.userId, "type:", typeof req.user.userId);
    
    // VALIDASI: Pastikan userId tidak null/undefined
    if (!req.user.userId) {
      console.error("❌ CRITICAL: userId is null or undefined!");
      return res.status(401).json({ 
        success: false,
        message: 'Token tidak valid: user_id tidak ditemukan.' 
      });
    }
    
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token sudah expired. Silakan login kembali.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token tidak valid.' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token.' 
    });
  }
};

/**
 * Middleware untuk memverifikasi role admin
 * Harus dipanggil setelah verifyToken
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'User tidak terautentikasi.' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini.' 
    });
  }
  
  next();
};

/**
 * Middleware untuk memverifikasi role organizer
 * Harus dipanggil setelah verifyToken
 */
export const isOrganizer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'User tidak terautentikasi.' 
    });
  }

  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Akses ditolak. Hanya organizer atau admin yang dapat mengakses resource ini.' 
    });
  }
  
  next();
};

/**
 * Middleware untuk memverifikasi role participant
 * Harus dipanggil setelah verifyToken
 */
export const isParticipant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'User tidak terautentikasi.' 
    });
  }

  if (req.user.role !== 'participant') {
    return res.status(403).json({ 
      success: false,
      message: 'Akses ditolak. Hanya participant yang dapat mengakses resource ini.' 
    });
  }
  
  next();
};

/**
 * Middleware untuk memverifikasi bahwa user adalah pemilik resource
 * atau admin
 */
export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'User tidak terautentikasi.' 
    });
  }

  const resourceUserId = parseInt(req.params.userId || req.params.id);
  
  if (req.user.role === 'admin' || req.user.userId === resourceUserId) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false,
    message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.' 
  });
};

/**
 * Optional authentication - tidak wajib login
 * Jika ada token, akan diverifikasi dan data user disimpan
 * Jika tidak ada token, request tetap dilanjutkan
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.user_id,  // ← PERBAIKAN: dari decoded.user_id
      email: decoded.email,
      role: decoded.role,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    // Jika token invalid, tetap lanjutkan tanpa user data
    next();
  }
};