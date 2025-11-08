import { Label } from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { Fragment } from "react/jsx-runtime";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const MIN_VALUE_LENGTH = 1;
const MAX_VALUE_LENGTH = 32;

const DefaultSingleFieldSchema = z.object({
  value: z
    .string()
    .min(MIN_VALUE_LENGTH, {
      message: `Value must be at least ${MIN_VALUE_LENGTH} characters`,
    })
    .max(MAX_VALUE_LENGTH, {
      message: `Value must be less than ${MAX_VALUE_LENGTH} characters`,
    }),
});

export function SingleFieldForm(props: {
  label: string;
  description: string;
  defaultValue: string;
  footerMessage?: string;
  schema?: z.ZodSchema<{ value: string }>;
  renderInput: (props: {
    onChange: (value: string) => void;
    value: string;
  }) => React.ReactNode;
  onSubmit: (value: string) => void | Promise<void>;
}) {
  const schema = (props.schema ??
    DefaultSingleFieldSchema) as typeof DefaultSingleFieldSchema;

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
    onSubmit: async ({ value }) => {
      await props.onSubmit(value.value);
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
          <Fragment>
            <div className="flex flex-col gap-4 p-4">
              <Label className="font-semibold text-lg" htmlFor="username">
                {props.label}
              </Label>
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
                    disabled={isSubmitting || !isValid || !isDirty}
                    size="sm"
                    type="submit"
                  >
                    {isSubmitting ? <Spinner /> : <span>Save</span>}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </Fragment>
        )}
      </form.Field>
    </form>
  );
}
