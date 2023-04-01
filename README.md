# Boss Tools Oxygen JS

## Config

To add a planet to the oxygen system registry, simply add this to your globals:

```js
global.oxygen_planets = [<dimension ids>]
```

To add a oxygen-resistant entity, add this:

```js
global.oxygen_entity_blacklist = [
    "modid.entity_id",
    // or
    "modid" // excludes all entities from a mod
]
```

## Compatabilites

Compatable with:

* [Giselle Addon](https://www.curseforge.com/minecraft/mc-mods/space-bosstools-giselle-addon)
* [Avaritia Endless](https://www.curseforge.com/minecraft/mc-mods/avaritia-endless)
* [Corpse](https://www.curseforge.com/minecraft/mc-mods/corpse)
