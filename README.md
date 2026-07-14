# Court + Extra Worlds Module

هذه نسخة مطورة من آخر حزمة.

## المضاف

- المحكمة الملكية `/court`
- المقهى `/cafe`
- الشرطة `/police`
- أمراء القلعة `/princes`
- مكوّن بطاقات جاهز للواجهة الرئيسية:
  - `components/ExtraWorlds.tsx`
- تنسيقات:
  - `court.css`
  - `extra-worlds.css`

## الربط بالصفحة الرئيسية

داخل `app/page.tsx` أضف في الأعلى:

```tsx
import ExtraWorlds from "@/components/ExtraWorlds";
```

ثم أضف قبل `footer`:

```tsx
<ExtraWorlds />
```

## التنسيقات

انسخ محتوى:
- `court.css`
- `extra-worlds.css`

وألصقه في نهاية:

```text
app/globals.css
```