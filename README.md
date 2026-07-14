# Court Module — Le Tribunal Royal

هذه الحزمة تضيف عالم المحكمة بالتفصيل.

## الملفات

- `app/court/page.tsx`
- `data/court.ts`
- `court.css`

## طريقة الإضافة

1. انسخ مجلد `court` إلى داخل `app`.
2. انسخ `court.ts` إلى داخل `data`.
3. افتح `app/globals.css`.
4. انسخ محتوى `court.css` كاملًا والصقه في نهاية `globals.css`.
5. اربط بطاقة المحكمة بالمسار:

```tsx
window.location.href = "/court"
```

## المزايا

- شخصية القاضي Jules.
- شخصية كاتب المحكمة Omar.
- صوت للسؤال.
- صوت مستقل لكل إجابة.
- أصوات نجاح وخطأ.
- خمس قضايا تعليمية.
- ترجمة عربية اختيارية.
- XP وCoins.
- حفظ التقدم في `localStorage`.
- ميدالية العدالة.
- فتح القصر بعد إكمال المحكمة.