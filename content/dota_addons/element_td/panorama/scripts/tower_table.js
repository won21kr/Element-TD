var Root = $.GetContextPanel()
var Container = $("#Container")
var Filter = $("#FilterButtonContainer")
var Btn = $("#ToggleBtn")
var glows = []
var hovering
var hidden = true
var elements = ['light','dark','water','fire','nature','earth']
var towers = {}
towers['vapor'] = ['water','fire']
towers['well']  = ['water','nature']
towers['poison'] = ['dark','water']
towers['windstorm'] = ['water','fire','light']
towers['flooding'] = ['water','dark','nature']
towers['polar'] = ['water','light','earth']
towers['tidal'] = ['water','nature','light']
towers['blacksmith'] = ['fire','earth']
towers['electricity'] = ['fire','light']
towers['flame'] = ['fire','nature']
towers['haste'] = ['fire','earth','water']
towers['flamethrower'] = ['fire','dark','earth']
towers['erosion'] = ['fire','dark','water'] //corrosion
towers['life'] = ['nature','light']
towers['moss'] = ['nature','earth']
towers['impulse'] = ['nature','fire','water']
towers['roots'] = ['nature','dark','earth']
towers['ephemeral'] = ['nature','earth','water']
towers['enchantment'] = ['nature','light','earth'] //incantation
towers['gunpowder'] = ['earth','dark']
towers['hydro'] = ['earth','water'] //geyser
towers['gold'] = ['earth','fire','light']
towers['quake'] = ['earth','fire','nature']
towers['muck'] = ['earth','dark','water']
towers['ice'] = ['light','water']
towers['trickery'] = ['light','dark']
towers['quark'] = ['light','earth'] //atom
towers['hail'] = ['light','dark','water']
towers['nova'] = ['light','fire','nature']
towers['laser'] = ['light','dark','earth']
towers['disease'] = ['dark','nature']
towers['magic'] = ['dark','fire']
towers['jinx'] = ['dark','fire','nature']
towers['runic'] = ['dark','fire','light']
towers['obliteration'] = ['dark','light','nature']

Root.Elements = {}

Categories = {}
Categories['Buff_Towers'] = ["well","blacksmith","trickery","life","gold"]
Categories['Slow_Towers'] = ["windstorm", "roots", "nova","muck"]
Categories['Amp_Towers'] = ["erosion", "enchantment", "polar", "jinx"]
Categories['AoE_Towers'] = ["fire", "water", "earth", "ice", "hail", "runic", "obliteration", "vapor", "poison", "flooding", "tidal", "electricity", "moss", "gunpowder", "hydro", "quake", "quark", "flamethrower", "flame"]
Categories['700'] = ["fire", "moss", "quake", "nature", "flame", "vapor", "quark", "disease", "flamethrower", "tidal", "muck", "nova", "erosion", "jinx"]
Categories['900'] = ["water", "earth", "blacksmith", "well", "trickery", "ice", "poison", "hydro", "flooding", "haste", "roots", "enchantment", "polar", "laser", "ephemeral"]
Categories['1150'] = ["dark", "electricity", "life", "hail", "windstorm", "runic", "obliteration", "gold"]
Categories['1500'] = ["light", "gunpowder", "magic", "impulse"]

function Hover(name, arg1, arg2, arg3) {
    AddElementGlow(arg1)
    if (arg2) AddElementGlow(arg2)
    if (arg3)
    {
        AddElementGlow(arg3)
        AddDualsGlow(arg1, arg2, arg3)
    }
    else
    {
        GlowTriplesWithBoth(arg1, arg2)
    }

    hovering = $("#"+name)
    hovering.AddClass("Glow_white")
    var tooltip_name = "item_upgrade_to_"+name+"_tower"
    if (hovering.BHasClass("DisabledAbility"))
        tooltip_name = tooltip_name+"_disabled"

    $.DispatchEvent( "DOTAShowAbilityTooltip", hovering, tooltip_name);
}

function HoverElement(name){
    AddElementGlow(name)
    hovering = $("#"+name)
    var tooltip_name = "build_"+name+"_tower"

    if (hovering.BHasClass("DisabledElement"))
        tooltip_name = tooltip_name+"_disabled"

    $.DispatchEvent( "DOTAShowAbilityTooltip", hovering, tooltip_name);

    GlowTowersWith(name)
}

function OnMouseOutElement() {
    for (var i in glows)
    {
        glows[i].RemoveClass(glows[i].glow);
    }
    glows = []

    $.DispatchEvent( "DOTAHideAbilityTooltip", hovering );
}

function AddElementGlow(elem) {
    var panel = $("#"+elem)
    panel.AddClass("Glow_"+elem)
    panel.glow = "Glow_"+elem
    glows.push(panel)
}

function AddDualsGlow(elem1, elem2, elem3) {
    // Find each of the 3 possible dual combinations
    ResolveDualGlows(elem1, elem2, elem3)
    ResolveDualGlows(elem2, elem1, elem3)
    ResolveDualGlows(elem3, elem1, elem2)
}

function GlowTowersWith(elem1) {
    GlowTypeWith(elem1, "Duals")
    GlowTypeWith(elem1, "Triples")
}

function GlowTypeWith(elem, string_type)
{
    for (var i in elements)
    {
        var primary = elements[i]
        var panel = $("#"+primary+string_type)
        var childN = panel.GetChildCount()
        for (var i = 0; i < childN; i++) {
            var dual = panel.GetChild(i).GetChild(0)
            if (towers[dual.id] !== undefined && (towers[dual.id].indexOf(elem) != -1))
            {
                dual.AddClass("Glow_"+primary)
                dual.glow = "Glow_"+primary
                glows.push(dual)
            }
        };
    }
}

function GlowTriplesWithBoth(elem1, elem2)
{
    for (var i in elements)
    {
        var primary = elements[i]
        var panel = $("#"+primary+"Triples")
        var childN = panel.GetChildCount()
        for (var i = 0; i < childN; i++) {
            var dual = panel.GetChild(i).GetChild(0)
            if (towers[dual.id] !== undefined && (towers[dual.id].indexOf(elem1) != -1) && (towers[dual.id].indexOf(elem2) != -1))
            {
                dual.AddClass("Glow_"+primary)
                dual.glow = "Glow_"+primary
                glows.push(dual)
            }
        };
    }
}

function ResolveDualGlows(primary, secondary1, secondary2) {
    var panel = $("#"+primary+"Duals")
    var childN = panel.GetChildCount()
    for (var i = 0; i < childN; i++) {
        var dual = panel.GetChild(i).GetChild(0)
        if (towers[dual.id] !== undefined && (towers[dual.id].indexOf(secondary1) != -1 || towers[dual.id].indexOf(secondary2) != -1))
        {
            dual.AddClass("Glow_"+primary)
            dual.glow = "Glow_"+primary
            glows.push(dual)
        }
    };
}

function Toggle() {
    Game.EmitSound("ui_generic_button_click");
    hidden = !hidden
    Container.SetHasClass("Hidden", hidden)
    Filter.SetHasClass("Hidden", hidden)

    if (!hidden)
    {
        GameUI.CloseProfilePanels()
        GameUI.CloseLeaderboard()
    }
}

GameUI.CloseTowerTable = function() {
    Container.AddClass("Hidden")
    Filter.AddClass("Hidden")
    hidden = true
}

function UpdateElements(data){
    Root.Elements = data
    for (var element in data)
    {
        var panel = $("#"+element)
        if (panel)
        {
            var level = data[element]
            panel.SetHasClass("DisabledElement", level==0)
        }
    }
    for (var towerName in towers)
    {
        CheckRequirements(towerName, towers[towerName], data)
        UpdateLabel(towerName)
    }
}

function CheckRequirements(towerName, requirements, data) {
    var panel = $("#"+towerName)
    if (panel)
    {
        var bRequirementFailed = false
        for (var i in requirements)
        {
            if (data[requirements[i]] == 0)
            {
                bRequirementFailed = true
                break
            }
        }
        panel.SetHasClass("DisabledAbility", bRequirementFailed)
    }
}

function OnMouseOut() {
    for (var i in glows)
    {
        glows[i].RemoveClass(glows[i].glow);
    }
    glows = []

    hovering.RemoveClass("Glow_white")
    $.DispatchEvent( "DOTAHideAbilityTooltip", hovering );
}

function HoverToggle()
{
    $.DispatchEvent("DOTAShowTitleTextTooltip", $("#ImageLabel"), "#etd_tower_table", "#etd_tower_table_description");
}

function OnMouseOutToggle()
{
    $.DispatchEvent( "DOTAHideAbilityTooltip", $("#ImageLabel"));
}

function UpdateLabel(name)
{
    var label = $("#"+name+"_level")

    var levels = []
    if (label)
    {
        var requirements = towers[name]
        for (var i in requirements)
        {
            levels.push(Root.Elements[requirements[i]])
        }
    }

    var level = Math.min.apply(Math, levels)

    // Triples can only go to level 2
    //if (towers[name].length == 3 && level > 2)
    //    level = 2

    if (level > 3)
        level = 3
    
    if (level > 1)
        //label.text = "Level "+level
        label.text = Array(level+1).join("I")
    else
        label.text = ""
}

function HideLabel(name)
{
    var label = $("#"+name+"_level")
    if (label)
        label.text = ""
}

function HoverFilter(name) {
    var cat = Categories[name]
    for (var i in cat)
    {
        var tower = Root.FindChildTraverse(cat[i])
        if (tower)
        {
            var tab = cat[i]
            if (towers[tab])
            {
                var primary = towers[tab][0]
                tower.AddClass("Glow_"+primary)
                tower.glow = "Glow_"+primary
                glows.push(tower)
            }
        }
    }
}

function OnMouseOutFilter() {
    for (var i in glows)
    {
        glows[i].RemoveClass(glows[i].glow);
    }
    glows = []
}

function CheckHudFlipped() {

    if (Game.IsHUDFlipped())
    {
        Flip($("#TowerTableButton"))
        Flip($("#ToggleGlyph"))
        Flip($("#ToggleButtonGlyph"))
        Flip($("#TowersLabel"))

        $("#TowerTableButton").style['margin-left'] = "65px;"
        $("#ToggleGlyph").style['margin-left'] = "-25px;"
        $("#ToggleButtonGlyph").style['margin-left'] = "-5px;"
        $("#TowersLabel").style['margin-left'] = "10px;"
    }
    else
    {
        AlignRight($("#TowerTableButton"))
        AlignRight($("#ToggleGlyph"))
        AlignRight($("#ToggleButtonGlyph"))
        AlignRight($("#TowersLabel"))

        $("#TowerTableButton").style['margin-left'] = "0px;"
        $("#ToggleGlyph").style['margin-left'] = "0px;"
        $("#ToggleButtonGlyph").style['margin-left'] = "0px;"
        $("#TowersLabel").style['margin-left'] = "-10px;"
    }

    $.Schedule(1, CheckHudFlipped)
}

function Flip (panel) {
    panel.AddClass("Flipped")
    panel.RemoveClass("AlignRight")
}

function AlignRight (panel) {
    panel.RemoveClass("Flipped")
    panel.AddClass("AlignRight")
}

(function(){
    $.Schedule(0.1, CheckHudFlipped)
    Container.AddClass("Hidden")
    GameEvents.Subscribe("glyph_override", Toggle )
    GameEvents.Subscribe("etd_update_elements", UpdateElements )

    Game.AddCommand( "+ToggleTowerTable", Toggle, "", 0 );
})()