# Boss Tools Oxygen JS

[![kjspkg-available](https://github-production-user-asset-6210df.s3.amazonaws.com/79367505/250114674-fb848719-d52e-471b-a6cf-2c0ea6729f1c.svg)](https://kjspkglookup.modernmodpacks.site/#boss-tools-oxygen)

## Config

To add a planet to the oxygen system registry, simply add this to your globals:

```js
global.oxygen_planets = ["modid:dimension"]
global.oxygen_planets_whitelist = false // You can also set all planets to require oxygen except certain ones
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
