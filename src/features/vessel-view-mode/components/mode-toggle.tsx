import Toggle from "@/shared/ui/toggle";
import { useViewMode } from "../hooks/use-view-mode";

export default function ModeToggle() {
  const { mode, setMode } = useViewMode();
  const isBoundsMode = mode === "bounds";

  function handleClick(): void {
    setMode(isBoundsMode ? "all" : "bounds");
  }

  return (
    <Toggle label="Bound View" checked={isBoundsMode} onClick={handleClick} />
  );
}
