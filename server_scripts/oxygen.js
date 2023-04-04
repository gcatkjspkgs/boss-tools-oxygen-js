function oxygenCheck(dim) {
    if (global.oxygen_planets==null) return true

    let oxygen = true 
    global.oxygen_planets.forEach(p => {
        if (dim.toString().contains(p)) oxygen = false
    })

    return oxygen
}
function includes(arr, e) {
    let returnval = false
    arr.forEach(i => {
        if (i==e) returnval = true
    })
    return returnval
}

onEvent("player.tick", event => {
    if (event.player.getTicksExisted() % 5 != 0 || event.player.isCreative() || oxygenCheck(event.player.getLevel().getDimension())) return

    const acceptablearmor = [
        ["boss_tools:space_boots", "boss_tools:netherite_space_boots"],
        ["boss_tools:space_pants", "boss_tools:netherite_space_pants"],
        ["boss_tools:space_suit", "boss_tools:netherite_space_suit"],
        ["boss_tools:oxygen_mask", "boss_tools:netherite_oxygen_mask"]
    ]

    const armor = []
    let suit

    const enchantments = []
    let helmet
    let oxygencan

    let modules = []

    const effects = []
    
    event.player.fullNBT.Inventory.forEach(i => {
        const slot = i.func_74762_e("Slot")
        if (slot>99 && slot<104) armor.push(i.func_74779_i("id"))
        if (slot==102) suit = i
        if (slot==103) helmet = i
        if (i.func_74779_i("id")=="boss_tools_giselle_addon:oxygen_can" && i.func_74775_l("tag").func_74775_l("boss_tools_giselle_addon:oxygen_capacitor_capability").func_74775_l("oxygencharger").func_74779_i("chargemode")!="boss_tools_giselle_addon:none") oxygencan = i
    })
    if (helmet!=undefined) {
        if (helmet.func_74775_l("tag").Enchantments!=undefined) helmet.func_74775_l("tag").Enchantments.forEach(e => {enchantments.push(e.func_74779_i("id"))})
        if (helmet.func_74775_l("tag").func_74775_l("mekData").func_74775_l("modules")!=undefined) modules = helmet.func_74775_l("tag").func_74775_l("mekData").func_74775_l("modules").func_150296_c()
        if (helmet.func_74779_i("id")=="endless:infinity_helmet") return
    }
    if(event.player.fullNBT.ActiveEffects!=undefined)
        event.player.fullNBT.ActiveEffects.forEach(e => {effects.push(e.func_74762_e("Id"))})

    if (event.player.potionEffects.isActive("boss_tools:oxygen_bubble_effect")) return

    if(
        includes(acceptablearmor[0], armor[0]) &&
        includes(acceptablearmor[1], armor[1]) &&
        includes(acceptablearmor[2], armor[2]) &&
        includes(acceptablearmor[3], armor[3]) &&
        suit.func_74775_l("tag").func_74762_e("Energy") > 0
    ) {
        return
    }

    if (oxygencan!=undefined) {
        let data = oxygencan.func_74775_l("tag").func_74775_l("boss_tools_giselle_addon:oxygen_capacitor_capability")
        if (
            (
                includes(enchantments, "boss_tools_giselle_addon:space_breathing") ||
                includes(modules, "boss_tools_giselle_addon:space_breathing_unit")
            ) &&
            oxygencan!=undefined &&
            data.func_74775_l("oxygenstorage").func_74762_e("oxygen") > 0
        ) {
            Utils.server.runCommandSilent(`replaceitem entity ${event.player.getName().string} container.${oxygencan.func_74762_e("Slot")} boss_tools_giselle_addon:oxygen_can{"boss_tools_giselle_addon:oxygen_capacitor_capability":{oxygenstorage:{oxygen:${data.func_74775_l("oxygenstorage").func_74762_e("oxygen")-1}}, oxygencharger:{chargemode:"${data.func_74775_l("oxygencharger").func_74779_i("chargemode")}"}}}`)
            return
        }
    }

    event.player.attack("oxygen", 1)
})

onEvent("entity.spawned", event => {
    if (oxygenCheck(event.entity.getLevel().getDimension())) return

    function entityOxygenCheck() {
        if (!event.entity) return
    
        if (!event.entity.potionEffects.isActive("boss_tools:oxygen_bubble_effect")) event.entity.attack("oxygen", 5)

        event.server.scheduleInTicks(50, () => {
            entityOxygenCheck()
        })
    }

    const blacklist = [
        "minecraft.player",
        "corpse.corpse",

        "minecraft.item",
        "minecraft.arrow"
    ]

    let include = true
    global.oxygen_entity_blacklist.concat(blacklist).forEach(e => {
        if (event.entity.getType().toString().contains(e)) include = false
    })
    
    if (include) entityOxygenCheck()
})

onEvent("block.right_click", event => {
    if (oxygenCheck(event.player.getLevel().getDimension())) return

    const replacements = {
        "minecraft:torch": "boss_tools:coal_torch",
        "minecraft:lantern": "boss_tools:coal_lantern",

        "minecraft:campfire": "minecraft:campfire[lit=false]",

        "minecraft:flint_and_steel": "minecraft:air"
    }

    if (!includes(Object.keys(replacements), event.item.getId())) return

    const position = event.player.position()
    Utils.server.runCommandSilent(`execute in ${event.player.getLevel().getDimension()} positioned ${position.x} ${position.y} ${position.z} run playsound block.fire.extinguish block @a[distance=..20] ${position.x} ${position.y} ${position.z} 1`)
    
    if (event.item.getId()=="minecraft:flint_and_steel") {
        event.cancel()
        return
    }

    const pos = event.block.offset(event.getFacing()).getPos()
    Utils.server.runCommandSilent(`execute in ${event.player.getLevel().getDimension()} run setblock ${pos.x} ${pos.y} ${pos.z} ${replacements[event.item.getId()]}`)
})