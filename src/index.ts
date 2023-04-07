import { findByName, findByStoreName } from "@vendetta/metro";
import { ReactNative, chroma, constants } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { TAG_COLORS, TAG_TEXTS } from "./constants";
import Settings from "./ui/pages/Settings";

const RowManager = findByName("RowManager")

const GuildStore = findByStoreName("GuildStore")
const GuildMemberStore = findByStoreName("GuildMemberStore")
const ChannelStore = findByStoreName("ChannelStore")

const { Permissions } = constants

let unpatch
export default {
    onLoad: () => {
        storage.useRoleColor ??= false

        unpatch = after("generate", RowManager.prototype, ([row], { message }) => {
            if (row.rowType !== 1) return

            const { guildId, channelId, authorId } = message

            // Return if the message author is a bot
            if (message.tagText) return

            if (guildId) {
                const guild = GuildStore.getGuild(guildId)

                // Owner tag
                if (guild.ownerId === authorId) {
                    message.tagText = TAG_TEXTS.OWNER
                    message.tagBackgroundColor = TAG_COLORS.OWNER
                }

                const member = GuildMemberStore.getMember(guildId, authorId)
                for (const roleId of (!message.tagText ? member?.roles ?? [] : [])) {
                    const role = guild.roles[roleId]
                    if (!role) continue

                    // Administrator tag
                    if (role.permissions & Permissions.ADMINISTRATOR) {
                        message.tagText = TAG_TEXTS.ADMINISTRATOR
                        message.tagBackgroundColor = TAG_COLORS.ADMINISTRATOR
                        // Manager tag
                    } else if (role.permissions & (0n | Permissions.MANAGE_GUILD | Permissions.MANAGE_CHANNELS | Permissions.MANAGE_ROLES | Permissions.MANAGE_WEBHOOKS)) {
                        message.tagText = TAG_TEXTS.MANAGER
                        message.tagBackgroundColor = TAG_COLORS.MANAGER
                        // Moderator tag
                    } else if (role.permissions & (0n | Permissions.MANAGE_MESSAGES | Permissions.KICK_MEMBERS | Permissions.BAN_MEMBERS)) {
                        message.tagText = TAG_TEXTS.MODERATOR
                        message.tagBackgroundColor = TAG_COLORS.MODERATOR
                    }

                    if (message.tagText) break
                }

                if (message.tagText && storage.useRoleColor && member?.colorString) {
                    message.tagBackgroundColor = ReactNative.processColor(chroma(member.colorString).hex())
                }
            } else {
                const channel = ChannelStore.getChannel(channelId)
                // Owner tag
                if (channel.type === 3 && channel.ownerId === authorId) {
                    message.tagText = TAG_TEXTS.OWNER
                    message.tagBackgroundColor = TAG_COLORS.OWNER
                }
            }
        })
    },
    onUnload: () => unpatch(),
    settings: Settings
}
