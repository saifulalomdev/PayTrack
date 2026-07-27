import { FormInput } from "@/components/ui/form-input";
import { logInFields } from "@/config/login-fields";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useLogIn from "../auth.hooks";

export function LogInForm() {
    const { form, isLoading, onSubmit } = useLogIn();

    return (
        <Form {...form}>
            <Toaster />
            <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6 px-4 max-w-sm w-full">
                <h1 className="text-3xl text-center">Admin log in</h1>
                {logInFields.map((field) => (
                    <FormInput
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        type={field.type}
                        disabled={isLoading}
                    />
                ))}
                <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Log in"}
                </Button>
            </form>
        </Form>
    )
}