import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative, constants, stylesheet, clipboard } from "@vendetta/metro/common";
import { findByName, findByProps } from "@vendetta/metro";
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput } = General;
const { FormLabel, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

// find stuff
const Icon = findByName("Icon");
const useIsFocused = findByName("useIsFocused");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");

// Icons idk
const Add = getAssetIDByName("ic_add_24px");
const Mod = getAssetIDByName("ic_arrow");
const Remove = getAssetIDByName("ic_minus_circle_24px");
const Checkmark = getAssetIDByName("Check");
const Crossmark = getAssetIDByName("Small");


// uhhh dont ask
const Capitalize = (str) => { return `${str[0].toUpperCase()}${str.toLowerCase().slice(1)}`; };
const Clean = (str) => { return str.replaceAll('_', ' ') };


const styles = stylesheet.createThemedStyleSheet({
    basicPad: {
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,        
    },
    header: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "3%",
        fontSize: 24
    },
    sub: {
        color: semanticColors.TEXT_POSITIVE,
        fontFamily: constants.Fonts.DISPLAY_NORMAL,
        paddingLeft: "4%",
        fontSize: 18  
    },
    flagsText: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "4%",
        fontSize: 16
    }
});


// storage.customTags


const placeholder = 'MissingNo';
const HEX_regex = /[0-9A-Fa-f]{6}/;

let switches = [
    {
        id: `useCustomTags`,
        default: false,
        label: `Use Custom Tags settings`,
        subLabel: `Use Custom Tags Settings for this plugin.`,
    },
    {
        id: `useRoleColor`,
        default: false,
        label: `Use top role color`,
        subLabel: `This may result in unreadable tags as it isn't possible to change the tag's text color.`,
    },
]

export default function Settings() {
    useProxy(storage)


    const { Permissions } = constants;
    const unsorted_perm = Object.keys(Permissions);
    const perm = unsorted_perm.sort()


    const navigation = NavigationNative.useNavigation();
    useIsFocused();

    storage.customTags ??= [];

    // console.log(storage)

    const CustomTagsClick = (inx) => {
        


        if(inx < 0) inx = 0;

        /*
            name, color, perms[]
        */

        // console.log(inx)

        // console.log(storage.customTags[inx])

        if(!storage.customTags[inx]) {
            storage.customTags[inx] = { name: '' , color: '' , perms: [] };
        }

        let bob = storage.customTags[inx];


        // console.log(bob)


        navigation.push("VendettaCustomPage", {
            title: `Editing Custom Tag`,
            render: () => <>
                <ScrollView>
                    <FormSection title="Customize Tag" style={[styles.header, styles.basicPad]}>
                        <View style={[styles.basicPad, styles.sub]}>
                            <FormInput
                                title="Display Tag Name"
                                value={bob?.name}
                                placeholder="Tag Name Here"
                                onChange={(v) => bob.name = v}
                            />
                            <FormInput
                                title="Tag Color | HEX Code without Hashtag [#]"
                                value={bob?.color}
                                placeholder="HEX Code"
                                onChange={(v) => bob.color = v}
                            />
                        </View>
                    </FormSection>
                    <FormSection title="Tag Permissions" style={[styles.header, styles.basicPad]}>
                        <View style={[styles.basicPad, styles.sub]}>
                            <Text style={[styles.basicPad, styles.flagsText]}>{
                                `${bob.perms.join(" | ") || 'No Permissions Added.'}`
                            }</Text>
                        </View>
                        <FormDivider />
                        <FormRow
                            label="Set Permissions"
                            subLabel="Add what permissions to be used to mark user with this tag."
                            leading={<FormRow.Icon source={Mod} />}
                            onPress={() => {
                                navigation.push("VendettaCustomPage", {
                                    title: `Custom Tag Permissions`,
                                    render: () => <>
                                        <ScrollView style={{ flex: 1 }} >
                                            <FormSection title="Permissions List" style={[styles.header, styles.basicPad]}>
                                                <View style={[styles.basicPad, styles.sub]}>{
                                                    perm?.map((component) => {
                                                        return (<>
                                                            <FormRow 
                                                                label={component}
                                                                trailing={ <FormRow.Icon source={bob?.perms?.includes(component) ? Remove : Add} />}
                                                                onPress={() => {
                                                                    if(bob?.perms?.includes(component)) {
                                                                        showToast(`${component} removed!`, Crossmark)
                                                                        bob?.perms.splice(component, 1)
                                                                    }
                                                                    else {
                                                                        showToast(`${component} added!`, Checkmark)
                                                                        bob?.perms.push(component)
                                                                    }
                                                                    navigation.pop()
                                                                    navigation.pop()
                                                                    CustomTagsClick(inx)
                                                                }}
                                                            />
                                                        </>)
                                                    })
                                                }
                                                </View>
                                            </FormSection>
                                        </ScrollView>
                                    </>
                                })
                            }}
                        />
                    </FormSection>

                    <FormRow 
                        label={<FormLabel text="Save Custom Tag" style={{ color: rawColors.GREEN_400 }}/> } 
                        onPress={() => {

                            if(!bob?.name?.length) return showToast('Tag Name Cannot be Empty', Crossmark);
                            if(!bob?.perms?.length) return showToast('Tag Permissions Cannot be Empty', Crossmark);

                            if(!bob.color.match(HEX_regex)) {
                                return showToast('Invalid HEX Code', Crossmark);
                            }

                            if(inx > -1) {
                                storage.customTags[inx] = bob;
                            } 
                            else {
                                storage.customTags.push(bob)
                            }
                            showToast(`Custom Tag Saved`, Checkmark)
                            navigation.pop()
                            navigation.pop()
                            ListCustomTags(true)
                        }
                    }/>
                    <FormRow 
                        label={<FormLabel text="Delete Custom Tag" style={{ color: rawColors.RED_400 }}/> } 
                        onPress={() => {
                            storage.customTags.splice(inx, 1);
                            navigation.pop()
                            navigation.pop()
                            ListCustomTags(true)
                        }
                    }/>
                </ScrollView>
            </>
        })
    };

    const ListCustomTags = (newTag) => {
        navigation.push("VendettaCustomPage", {
            title: `List of Custom Tags`,
            render: () => <>
                <ScrollView style={{ flex: 1 }} >
                    <FormSection title="Tags List" style={[styles.header, styles.basicPad]}>
                        <View style={[styles.header, styles.sub]}>{
                            storage.customTags?.map((comp, i) => {
                                return (<>
                                    <FormRow 
                                        label={
                                            <FormLabel 
                                                text={ comp?.name }
                                            /> 
                                        }
                                        onPress={ () => {
                                            // console.log(comp)
                                            let ifx = storage.customTags.findIndex(e => e.name == comp.name)
                                            CustomTagsClick(ifx) 
                                        }}
                                    />
                                    {i !== storage.customTags?.length - 1 && <FormDivider />}
                                </>);
                            })
                        }</View>
                    </FormSection>
                    <View style={[styles.header, styles.sub]}>
                        <FormRow
                            label="Add New Tags"
                            trailing={
                                <TouchableOpacity onPress={() => {;
                                    let ifx = storage?.customTags?.length;
                                    CustomTagsClick(ifx)
                                }}>
                                    <Icon source={Add} />
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </ScrollView>  
            </>
        })
    };

    return (<>
        <ScrollView style={{ flex: 1 }} >
            <FormSection title="Note" style={[styles.header, styles.basicPad]}>
                <Text style={[styles.basicPad, styles.sub]}>{
                    Capitalize("to enable custom tags, disable use default option and reload the plugin")
                }</Text>
            </FormSection>

            <FormSection title="Preferences" style={[styles.header, styles.basicPad]}>
                <View style={[styles.basicPad, styles.sub]}>{
                    switches.map((component, index) => {
                        return(<>
                            <FormSwitchRow
                                label={ component.label || placeholder }
                                subLabel={ component.subLabel || placeholder }
                                value={storage[component.id] ?? component.default}
                                onValueChange={(value) => (storage[component.id] = value) }
                            />
                            {index !== switches?.length - 1 && <FormDivider />}
                        </>)
                    })
                }</View>
            </FormSection>

            <FormSection title="Customize" style={[styles.header, styles.basicPad]}>
                <View style={[styles.basicPad, styles.sub]}>
                    <FormRow
                        label="Custom Tags"
                        onPress={ListCustomTags}
                        trailing={
                            <TouchableOpacity onPress={ListCustomTags}>
                                <Icon source={Add} />
                            </TouchableOpacity>
                        }
                    />
                </View>
            </FormSection>

        </ScrollView>
    </>);
}

