import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const DEFAULT_MAX_VALUE = 32;
export const DEFAULT_MIN_VALUE = 1;

const DefaultSingleFieldSchema = z.object({
  value: z
    .string()
    .min(DEFAULT_MIN_VALUE, "Value must be at least 1 character.")
    .max(DEFAULT_MAX_VALUE, "Value must be at most 32 characters."),
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
    "aria-invalid"?: boolean;
  }) => React.ReactNode;
  onSubmit: (value: string) => void | Promise<void>;
}) {
  const schema = props.schema || DefaultSingleFieldSchema;

  const form = useForm({
    defaultValues: {
      value: props.defaultValue,
    },
    validators: {
      onBlur: schema.safeParse,
      onSubmit: schema.safeParse,
      onMount: schema.safeParse,
      onChange: schema.safeParse,
    },
    onSubmit: async ({ value }) => {
      await props.onSubmit(value.value);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="value">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const errors = field.state.meta.errors.map((error) => ({
              message: error,
            }));
            return (
              <Field
                className="flex flex-col overflow-hidden rounded-lg border bg-card"
                data-invalid={isInvalid ? true : undefined}
              >
                <div className="flex flex-col gap-4 p-4">
                  <FieldLabel htmlFor={field.name}>{props.label}</FieldLabel>
                  <FieldDescription>{props.description}</FieldDescription>
                  {props.renderInput({
                    value: field.state.value,
                    onChange: field.handleChange,
                    "aria-invalid": isInvalid,
                  })}
                  <FieldError errors={errors} />
                </div>
                <div className="flex items-center justify-between border-t bg-sidebar p-4">
                  {!isInvalid && props.footerMessage && (
                    <p className="text-muted-foreground text-sm">
                      {props.footerMessage}
                    </p>
                  )}
                  {isInvalid && <div />}
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
                        <span>Save</span>
                      </Button>
                    )}
                  </form.Subscribe>
                </div>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
