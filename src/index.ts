import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative, chroma, constants, i18n } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";
import { rawColors } from "@vendetta/ui";

const RowManager = findByName("RowManager")

// Stores
const GuildStore = findByStoreName("GuildStore")
const ChannelStore = findByStoreName("ChannelStore")

// Permissions
const { Permissions } = constants
const { computePermissions } = findByProps("computePermissions", "canEveryoneRole")

// Strings

let unpatch;

const HEX_regex = /[0-9A-Fa-f]{6}/;

const builtInTags = [
    i18n.Messages.AI_TAG,
    //Messages.BOT_TAG_BOT, This is done in our own default_tags as webhooks use this
    i18n.Messages.BOT_TAG_SERVER,
    i18n.Messages.SYSTEM_DM_TAG_SYSTEM,
    i18n.Messages.GUILD_AUTOMOD_USER_BADGE_TEXT
]

// name String, color String, perms String[]

const builtInReplace = [
    {
        name: "WEBHOOK",
        condition: (guild, channel, user) => user.isNonUserBot()
    },
    {
        name: "OWNER",
        color: rawColors.ORANGE_345,
        condition: (guild, channel, user) => (guild?.ownerId === user.id) || (channel?.type === 3 && channel?.ownerId === user.id)
    },
    { 
        name: i18n.Messages.BOT_TAG_BOT,
        condition: (guild, channel, user) => user.bot
    }
]

const default_tags = [
    ...builtInReplace,
    {
        name: "ADMIN",
        color: '7f1c1e',
        perms: ["ADMINISTRATOR"]
    },
    {
        name: "MANAGER",
        color: "26b968",
        perms: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
    },
    {
        text: "MOD",
        color: "00aafc",
        perms: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    }
]

export default {
    onLoad: () => {
        storage.useCustomTags ??= false
        storage.useRoleColor ??= false
        storage.customTags ??= [];

        unpatch = after("generate", RowManager.prototype, ([row], { message }) => {
            // Return if it's not a message row
            if (row.rowType !== 1) return

            if (!builtInTags.includes(message.tagText)) {
                const { guildId, channelId } = message

                const guild = GuildStore.getGuild(guildId)
                const channel = ChannelStore.getChannel(channelId)

                let permissions, usedTags;

                if (guild) {
                    const permissionsInt = computePermissions({
                        user: row.message.author,
                        context: guild,
                        overwrites: channel?.permissionOverwrites
                    })
                    permissions = Object.entries(Permissions)
                        .map(([permission, permissionInt]: [string, bigint]) =>
                            permissionsInt & permissionInt ? permission : "")
                        .filter(Boolean)
                }

                if(storage.useCustomTags) {
                    usedTags = [...builtInReplace, ...storage.customTags]
                } 
                else {
                    usedTags = default_tags;
                }

                // console.log(usedTags)

                for (const tag of usedTags) {
                    if ( tag.condition?.(guild, channel, row.message.author) || tag.perms?.some(p => permissions?.includes(p)) ) {
                        message.tagText = tag.name
                        if ( tag.color && !(storage.useRoleColor && row.message.colorString) ) {
                            
                            if(!tag.color.match(HEX_regex)) tag.color = "68b5d9";

                            if(!tag.color.startsWith('#')) tag.color = `#${tag.color}`;

                            message.tagBackgroundColor = ReactNative.processColor(chroma(tag.color).hex());
                        }

                        break;
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
