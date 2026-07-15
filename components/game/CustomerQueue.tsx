"use client";

import type { NpcProfile } from "@/engine/types";

type Props = {
  customers: NpcProfile[];
  activeIndex: number;
  servedIds: string[];
};

export default function CustomerQueue({ customers, activeIndex, servedIds }: Props) {
  return (
    <section className="customer-queue" aria-label="طابور زبائن المقهى">
      <div className="queue-heading">
        <div>
          <span>File d’attente</span>
          <h2>طابور الزبائن</h2>
        </div>
        <b>{servedIds.length}/{customers.length}</b>
      </div>
      <div className="queue-list">
        {customers.map((customer, index) => {
          const id = customer.id ?? customer.name;
          const served = servedIds.includes(id);
          return (
            <article
              key={id}
              className={served ? "served" : index === activeIndex ? "active" : "waiting"}
            >
              <span>{customer.avatar}</span>
              <div>
                <strong>{customer.name}</strong>
                <small>{served ? "Servi ✓" : index === activeIndex ? "À servir" : "En attente"}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
