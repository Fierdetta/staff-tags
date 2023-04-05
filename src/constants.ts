import { ReactNative, chroma } from "@vendetta/metro/common"
import { rawColors } from "@vendetta/ui"

export const TAG_TEXTS = {
    OWNER: "OWNER",
    ADMINISTRATOR: "ADMIN",
    MANAGER: "MANAGER",
    MODERATOR: "MOD"
}

export const TAG_COLORS = {
    OWNER: ReactNative.processColor(chroma(rawColors.ORANGE_345).hex()),
    ADMINISTRATOR: ReactNative.processColor(chroma(rawColors.RED_560).hex()),
    MANAGER: ReactNative.processColor(chroma(rawColors.GREEN_345).hex()),
    MODERATOR: ReactNative.processColor(chroma(rawColors.BLUE_345).hex())
}
