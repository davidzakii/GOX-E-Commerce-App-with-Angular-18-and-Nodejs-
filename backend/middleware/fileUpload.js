import multer from 'multer';
import path from 'path';
import fs from 'fs';

// وظيفة لتنظيف الاسم من أي رموز غير مسموحة
const sanitizeEmail = (name) => name.replace(/[^a-zA-Z0-9_-]/g, '_');

// إعدادات multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // تحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error('Invalid file type. Only JPG, PNG, JPEG, WEBP are allowed!')
      );
    }
    // الحصول على اميل المستخدم  من الطلب
    const { email } = req.user;
    // console.log('Name from request body:', email);
    if (!email) {
      return cb(new Error('Invalid request. Missing or incorrect name.'));
    }
    const sanitizedUserEmail = sanitizeEmail(email); // تنسيق الاسم
    req.userEmail = sanitizedUserEmail;
    const folderPath = path.join(
      process.cwd(),
      'public',
      'Products',
      `${sanitizedUserEmail}`
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath); // إتمام العملية
  },
  filename: (req, file, cb) => {
    // تعيين اسم فريد لكل ملف
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // حفظ الاسم الفريد مع الامتداد
  },
});

export const upload = multer({
  storage,
});
