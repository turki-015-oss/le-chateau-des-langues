type Props = {
  value: number;
};

export default function ReputationBar({ value }: Props) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <section className="reputation-board">
      <div><span>سمعة المقهى</span><b>{safeValue}/100</b></div>
      <div className="reputation-track"><span style={{ width: `${safeValue}%` }} /></div>
      <small>الإجابات الطبيعية وخدمة الطلب الصحيح ترفع ثقة Luc بك.</small>
    </section>
  );
}