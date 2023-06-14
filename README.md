# Staff Tags

Shows tags for staff members in chat.

<img src="preview.png" width="300">


### Setting Page and Buttons Descriptions and Actions.
| Option                   | Category           | Action                                                                                          |
|--------------------------|--------------------|-------------------------------------------------------------------------------------------------|
| Note                     | Note               | Note from developer(s).                                                                         |
| Use Custom Tags settings | Preferences        | If enabled, will use custom tags, and override default tags.                                    |
| Use Top Color            | Preferences        | If enabled, will use highest role's color of the user's in a server, and override tag color.    |
| Custom Tags              | Customize          | When clicked, will open a new page with list of custom tags.                                    |
| [TAG_NAME]               | Tags List          | When clicked, will open a new page for editing said tag.                                        |
| Add New Tags             | Tags List          | When clicked, will open a new page to add new tag.                                              |
| Set Permissions          | Tag Permissions    | When clicked, will open a new page with list of permissions.                                    |
| [PERMISSION_NAME]        | Permisions List    | When clicked, will add the permission to the tag's permissions, and return to editing tag page. |
| Save Custom Tag          | Editing Custom Tag | When clicked, will save the tag and return to tag list page.                                    |
| Delete Custom Tag        | Editing Custom Tag | When clicked, will delete the tag and return to tag list page.                                  |


### The plugin will also patch the following regardless if Custom Tags enabled or not:
- Webhook
- Bot
- Owner

### If Default settings used (Custom Tags Option Disabled) the plugin will shows the following:
| Display Name | Permissions                                                          |
|--------------|----------------------------------------------------------------------|
| ADMIN        | `ADMINISTRATOR`                                                      |
| MANAGER      | `MANAGE_GUILD`, `MANAGE_CHANNELS`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS` |
| MOD          | `MANAGE_MESSAGES`, `KICK_MEMBERS`, `BAN_MEMBERS`                     |

Note: _The default tags can't be themed._

### Custom Tag Interface:
| Key          | Type     | Description                                                                                          |
|--------------|----------|------------------------------------------------------------------------------------------------------|
| Display Name | `String` | Text that will shown on the tag text.                                                                |
| Color        | `String` | Valid HEX Code for tag color, if somehow the color is invalid, it'll use `#68b5d9` as Default Color. |
| Permissions  | `Array`  | Permissions List for the tag to be visible. Can be added with button called `Set Pemissions`         |


### Developers
| Name       |             |                                     |
|------------|-------------|-------------------------------------|
| Fiery      | Author      | Created Staff Tags plugin.          |
| Angel~     | Contributor | Adding Customization to the plugin. |


