import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative, chroma, constants } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./ui/pages/Settings";
import { rawColors } from "@vendetta/ui";

const RowManager = findByName("RowManager")

// Stores
const GuildStore = findByStoreName("GuildStore")
const ChannelStore = findByStoreName("ChannelStore")

// Permissions
const { Permissions } = constants
const { computePermissions } = findByProps("computePermissions", "canEveryoneRole")

// Strings
const { Messages } = findByProps("Messages")

let unpatch

const builtInTags = [
    Messages.AI_TAG,
    //Messages.BOT_TAG_BOT, This is done in our own tags as webhooks use this
    Messages.BOT_TAG_SERVER,
    Messages.SYSTEM_DM_TAG_SYSTEM,
    Messages.GUILD_AUTOMOD_USER_BADGE_TEXT
]

const tags = [
    {
        text: "WEBHOOK",
        condition: (guild, channel, user) => user.isNonUserBot()
    },

    {
        text: "OWNER",
        color: rawColors.ORANGE_345,
        condition: (guild, channel, user) => (guild?.ownerId === user.id) || (channel.type === 3 && channel.ownerId === user.id)
    },
    { 
        text: Messages.BOT_TAG_BOT,
        condition: (guild, channel, user) => user.bot
    },
    {
        text: "ADMIN",
        color: rawColors.RED_560,
        permissions: ["ADMINISTRATOR"]
    },
    {
        text: "MANAGER",
        color: rawColors.GREEN_345,
        permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
    },
    {
        text: "MOD",
        color: rawColors.BLUE_345,
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    }
]

export default {
    onLoad: () => {
        storage.useRoleColor ??= false

        unpatch = after("generate", RowManager.prototype, ([row], { message }) => {
            // Return if it's not a message row
            if (row.rowType !== 1) return

            if (!builtInTags.includes(message.tagText)) {
                const { guildId, channelId } = message

                const guild = GuildStore.getGuild(guildId)
                const channel = ChannelStore.getChannel(channelId)

                let permissions
                if (guild) {
                    const permissionsInt = computePermissions({
                        user: row.message.author,
                        context: guild,
                        overwrites: channel.permissionOverwrites
                    })
                    permissions = Object.entries(Permissions)
                        .map(([permission, permissionInt]: [string, bigint]) =>
                            permissionsInt & permissionInt ? permission : "")
                        .filter(Boolean)
                }

                for (const tag of tags) {
                    if (tag.condition?.(guild, channel, row.message.author) ||
                        tag.permissions?.some(perm => permissions?.includes(perm))) {
                        message.tagText = tag.text
                        if (tag.color && !(storage.useRoleColor && row.message.colorString)) message.tagBackgroundColor = ReactNative.processColor(chroma(tag.color).hex())
                        break
                    }
                }
            }

            // Use top role color for tag
            if (storage.useRoleColor && row.message.colorString && message.tagText) message.tagBackgroundColor = ReactNative.processColor(chroma(row.message.colorString).hex())
        })
    },
    onUnload: () => unpatch(),
    settings: Settings
}
