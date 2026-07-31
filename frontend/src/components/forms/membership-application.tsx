"use client";

import { useState } from "react";
import { EMPTY_MEMBERSHIP_VALUES, MembershipForm, MembershipFormValues } from "./membership-form";
import { LiveMembershipCard } from "./live-membership-card";
import { LedgerCard } from "../ui/ledger-card";

export function MembershipApplication() {
  const [values, setValues] = useState<MembershipFormValues>(EMPTY_MEMBERSHIP_VALUES);
  const [sealed, setSealed] = useState(false);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
      <LedgerCard tone="light" interactive={false} className="p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)] sm:p-8">
        <MembershipForm onValuesChange={setValues} onSealedChange={setSealed} />
      </LedgerCard>
      <div className="lg:sticky lg:top-28">
        <LiveMembershipCard values={values} sealed={sealed} />
      </div>
    </div>
  );
}
