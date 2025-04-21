import { Button } from "@/components/ui/button";

interface OptimizationOption {
  id: string;
  label: string;
}

interface OptimizationOptionsProps {
  selectedStyle: string | null;
  onSelectStyle: (style: string | null) => void;
}

export default function OptimizationOptions({ selectedStyle, onSelectStyle }: OptimizationOptionsProps) {
  const options: OptimizationOption[] = [
    { id: "concise", label: "Concise" },
    { id: "professional", label: "Professional" },
    { id: "friendly", label: "Friendly" },
    { id: "persuasive", label: "Persuasive" },
    { id: "technical", label: "Technical" }
  ];

  const handleClick = (id: string) => {
    onSelectStyle(selectedStyle === id ? null : id);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          className={`px-3 py-1 text-sm ${
            selectedStyle === option.id 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "bg-neutral-light hover:bg-neutral-medium"
          } rounded-full`}
          onClick={() => handleClick(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
