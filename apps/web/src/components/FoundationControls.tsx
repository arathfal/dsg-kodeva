import { useState } from "react";
import { Button } from "./Button";

export function FoundationControls() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block font-semibold" htmlFor="example-name">
          Example name
        </label>
        <input
          className="input w-full"
          id="example-name"
          name="example-name"
          autoComplete="off"
          aria-describedby="example-help"
        />
        <p className="text-sm text-secondary" id="example-help">
          A control example. Nothing is submitted or saved.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button aria-pressed={selected} onClick={() => setSelected(!selected)}>
          Example action
        </Button>
        <Button disabled>Disabled action</Button>
      </div>
      <p role="status">{selected ? "Action selected." : "Ready."}</p>
    </div>
  );
}
