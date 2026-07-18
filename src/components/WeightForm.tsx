// src/components/WeightForm.tsx
import { useState } from "react";
import { useUpsertWeight } from "../hooks/useWeights";

// Local date as YYYY-MM-DD (avoids the UTC off-by-one that toISOString causes).
function todayLocal(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function WeightForm() {
  const [date, setDate] = useState(todayLocal);
  const [weight, setWeight] = useState("");
  const upsert = useUpsertWeight();

  const value = parseFloat(weight);
  const valid =
    date !== "" && Number.isFinite(value) && value >= 50 && value <= 500;

  function submit() {
    if (!valid) return;
    upsert.mutate(
      { entry_date: date, weight_lbs: value },
      { onSuccess: () => setWeight("") },
    );
  }

  return (
    <div className="wf">
      <div className="wf__row">
        <label className="wf__field">
          <span className="wf__label">Date</span>
          <input
            type="date"
            value={date}
            max={todayLocal()}
            onChange={(e) => setDate(e.target.value)}
            className="wf__input"
          />
        </label>

        <label className="wf__field">
          <span className="wf__label">Weight (lbs)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="171.4"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="wf__input"
          />
        </label>

        <button
          onClick={submit}
          disabled={!valid || upsert.isPending}
          className="wf__btn"
        >
          {upsert.isPending ? "Saving…" : "Log weight"}
        </button>
      </div>

      {upsert.isError && (
        <p className="wf__error">
          Couldn't save. {(upsert.error as Error).message}
        </p>
      )}
    </div>
  );
}
