import { toast } from "sonner";
import z from "zod";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-database";

const MIN_INSTRUCTIONS_LENGTH = 0;
const MAX_INSTRUCTIONS_LENGTH = 1000;

const instructionsSchema = z.object({
  value: z
    .string()
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at most ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
});

type InstructionsFormProps = {
  defaultValue: string;
};

export function InstructionsForm({ defaultValue }: InstructionsFormProps) {
  const { updateSettings } = useSettings();
  return (
    <SingleFieldForm
      defaultValue={defaultValue}
      description="How do you want Mistral Thing to behave?"
      footerMessage={`Please use ${MAX_INSTRUCTIONS_LENGTH} characters or less.`}
      label="Instructions"
      onSubmit={async (value) => {
        await updateSettings({ instructions: value });
        toast.success("Instructions saved");
      }}
      renderInput={({ onChange, value }) => (
        <Textarea
          className="resize-none border border-foreground/15 bg-muted/50 backdrop-blur-md"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your instructions"
          rows={5}
          value={value}
        />
      )}
      schema={instructionsSchema}
    />
  );
}
