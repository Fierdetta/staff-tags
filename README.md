# Staff Tags

Shows tags for staff members in chat.

<img src="preview.png" width="300">

The plugin will also patch the following regardless if Custom Tags enabled or not:
- Webhook
- Bot
- Owner

If Default settings used (Custom Tags Option Disabled) the plugin will shows the following:
| Display Name | Permissions                                                          |
|--------------|----------------------------------------------------------------------|
| ADMIN        | `ADMINISTRATOR`                                                      |
| MANAGER      | `MANAGE_GUILD`, `MANAGE_CHANNELS`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS` |
| MOD          | `MANAGE_MESSAGES`, `KICK_MEMBERS`, `BAN_MEMBERS`                     |

Note: _The default tags can't be themed._

Custom Tag Interface:
| Key          | Type     | Description                                                                                          |
|--------------|----------|------------------------------------------------------------------------------------------------------|
| Display Name | `String` | Text that will shown on the tag text.                                                                |
| Color        | `String` | Valid HEX Code for tag color, if somehow the color is invalid, it'll use `#68b5d9` as Default Color. |
| Permissions  | `Array`  | Permissions List for the tag to be visible. Can be added with button called `Set Pemissions`         |
