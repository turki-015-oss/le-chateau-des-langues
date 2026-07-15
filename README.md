# Le Château des Langues — v2.1-dev1

أول Milestone فعلي لمحرك Royal Café.

## ما تم
- فصل الصوت في `engine/audioEngine.ts`.
- فصل منطق الشخصيات والطلبات في `engine/npcEngine.ts`.
- إضافة محرك مهام عام في `engine/missionEngine.ts`.
- إضافة محرك مكافآت ونجوم في `engine/rewardEngine.ts`.
- إضافة محرك حالات الحوار في `engine/dialogueEngine.ts`.
- تحويل خريطة المهام وشريط السمعة وبطاقة الزبون إلى Components قابلة لإعادة الاستخدام.
- ربط صفحة المقهى بالمحركات الجديدة.
- مكافآت النهاية أصبحت محسوبة حسب الدقة والسمعة.
- الأساس الآن قابل لإعادة الاستخدام في المستشفى والجامعة والملعب وحديقة الحيوانات مستقبلًا.

## Commit
`v2.1-dev1 - Modularize Royal Cafe game engine`