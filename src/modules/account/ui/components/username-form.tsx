import { toast } from "sonner";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type UsernameFormProps = {
  username: string;
};

const UsernameForm = ({ username }: UsernameFormProps) => (
  <SingleFieldForm
    defaultValue={username}
    description="What do you want to be called?"
    footerMessage="Please use 32 characters or less."
    label="Username"
    onSubmit={async (value) => {
      await authClient.updateUser({
        name: value,
      });
      toast.success("Username updated");
    }}
    renderInput={({ onChange, value }) => (
      <Input onChange={(e) => onChange(e.target.value)} value={value} />
    )}
  />
);

export { UsernameForm };
