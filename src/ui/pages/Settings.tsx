import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms } from "@vendetta/ui/components";

const { FormSection, FormSwitchRow } = Forms

export default function Settings() {
    useProxy(storage)

    return (<FormSection title="Tag style">
        <FormSwitchRow
            label="Use top role color"
            value={storage.useRoleColor}
            onValueChange={(v: boolean) => {
                storage.useRoleColor = v;
            }}
        />
    </FormSection>)
}
