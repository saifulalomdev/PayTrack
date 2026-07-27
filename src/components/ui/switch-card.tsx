import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch";

interface SwitchChoiceCardProps {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: boolean;
    title: string;
    description: string;
}

export function SwitchChoiceCard({ name, onChange, value, title, description }: SwitchChoiceCardProps) {
    const switchId = `switch-${name}`;

    return (
        <FieldGroup className="w-full">
            <FieldLabel htmlFor={switchId}>
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>{title}</FieldTitle>
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                    </FieldContent>
                    <Switch
                        id={switchId}
                        checked={value}
                        onCheckedChange={(checked) => onChange({ target: { name, value: checked } as any, } as React.ChangeEvent<HTMLInputElement>)}
                    />
                </Field>
            </FieldLabel>
        </FieldGroup>
    )
}
