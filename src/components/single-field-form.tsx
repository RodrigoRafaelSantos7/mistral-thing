import { useForm } from "@tanstack/react-form";
import { useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { defaultSingleFieldSchema } from "@/lib/schemas/default";

type SingleFieldSchema = z.ZodObject<{ value: z.ZodString }>;

type SingleFieldFormProps = {
  label: string;
  description: string;
  defaultValue: string;
  footerMessage?: string;
  schema?: SingleFieldSchema;
  renderInput: (props: {
    onChange: (value: string) => void;
    value: string;
  }) => React.ReactNode;
  onSubmit: (value: string) => void | Promise<void>;
};

/**
 * The `SingleFieldForm` component is a form that allows the user to input a single field
 *
 * @param props - The props of the component
 * @param props.label - The label of the form it will be displayed on top of the description
 * @param props.description - The description of the form it will be displayed below the label
 * @param props.defaultValue - The default value of the form it will be displayed in the input
 * @param props.footerMessage - The footer message of the form it will be displayed below the input
 * @param props.schema - The schema of the form if not provided, the default schema will be used
 * @param props.renderInput - The render input of the form it will be called with the value and onChange function it will return a ReactNode
 * @param props.onSubmit - The on submit function, it will be called with the value and will be used to submit the form
 *
 * @returns The `SingleFieldForm` component
 */
export function SingleFieldForm(props: SingleFieldFormProps) {
  const [isPending, startTransition] = useTransition();

  const schema = props.schema ?? defaultSingleFieldSchema;

  const form = useForm({
    defaultValues: {
      value: props.defaultValue,
    },
    validators: {
      onBlur: schema,
      onSubmit: schema,
      onMount: schema,
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const toastId = toast.loading("Updating...");
        try {
          await props.onSubmit(value.value);
          form.reset();
          toast.success("Changes saved", { id: toastId });
        } catch (error) {
          console.error(error);
          toast.error("Failed to save changes", { id: toastId });
        }
      });
    },
  });
  return (
    <form
      className="flex flex-col overflow-hidden rounded-lg border bg-card"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="value">
        {(field) => (
          <>
            <div className="flex flex-col gap-4 p-4">
              <Label className="font-semibold text-lg">{props.label}</Label>
              <p className="text-muted-foreground text-sm">
                {props.description}
              </p>
              {props.renderInput({
                value: field.state.value,
                onChange: field.handleChange,
              })}
            </div>
            <div className="flex items-center justify-between border-t bg-sidebar p-4">
              {field.state.meta.errors.length > 0 ? (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]?.message}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {props.footerMessage}
                </p>
              )}
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                  isValid: state.isValid,
                  isDirty: state.isDirty,
                })}
              >
                {({ isSubmitting, isDirty, isValid }) => (
                  <Button
                    disabled={isSubmitting || !isValid || !isDirty || isPending}
                    size="sm"
                    type="submit"
                  >
                    <span>Save</span>
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </>
        )}
      </form.Field>
    </form>
  );
}
