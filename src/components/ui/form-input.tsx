import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

type FormInputProps = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
};

export function FormInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}