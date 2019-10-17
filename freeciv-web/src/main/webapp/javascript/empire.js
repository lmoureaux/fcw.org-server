/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://play.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/





var master_empire_checkbox;
var empire_checkbox_states= {};
var empire_mode = 0;
var empire_show_hitpoints = false;

var EMPIRE_UNIT_TYPE_MODE      = 0;
var EMPIRE_UNIT_HOMECITY_MODE  = 1;
var EMPIRE_UNIT_IN_CITY_MODE   = 2;

var EMPIRE_ECON_IMPROVEMENTS   = 3;
var EMPIRE_ECON_UPKEEP         = 4;
var EMPIRE_ECON_WORKLISTS      = 5;



/**************************************************************************
 Creates the hover pane when hovering over a row in the empire list
**************************************************************************/
function show_empire_pane(row_id)
{
  
 // $("#empire_improvements_hover_list").html(improvements_html);
}


/**************************************************************************
 Display Empire tab when it's in EMPIRE_UNIT_HOMECITY_MODE
**************************************************************************/
function empire_unit_homecity_screen(wide_screen,narrow_screen,small_screen,
  landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("Home City Units");
  $("#empire_list").html("Upcoming feature.");

}
/**************************************************************************
 Display Empire tab when it's in EMPIRE_UNIT_IN_CITY_MODE
**************************************************************************/
function empire_unitcity_screen(wide_screen,narrow_screen,small_screen,
  landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("City Deployment");
  $("#empire_list").html("Upcoming feature.");
}
/**************************************************************************
 Display Empire tab when it's in EMPIRE_ECON_IMPROVEMENTS
**************************************************************************/
function empire_econ_improvements_screen(wide_screen,narrow_screen,small_screen,
  landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("Economic Improvements and Infrastructure");
  $("#empire_list").html("Upcoming feature.");
}
/**************************************************************************
 Display Empire tab when it's in EMPIRE_ECON_UPKEEP
**************************************************************************/
function empire_econ_upkeep_screen(wide_screen,narrow_screen,small_screen,
  landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("Economic Upkeep Report");
  $("#empire_list").html("Upcoming feature.");
}
/**************************************************************************
 Display Empire tab when it's in EMPIRE_ECON_WORKLISTS
**************************************************************************/
function empire_econ_worklists_screen(wide_screen,narrow_screen,small_screen,
  landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("National Production");
  $("#empire_list").html("Upcoming feature.");
}

function toggle_empire_show_hitpoints()
{
  empire_show_hitpoints = !empire_show_hitpoints;
  update_empire_screen();
}

/**************************************************************************
 Display Empire tab when it's in EMPIRE_UNIT_TYPE_MODE
**************************************************************************/
function empire_unittype_screen(wide_screen,narrow_screen,small_screen,
                                landscape_screen,tiny_screen,redux_screen)
{
  $("#empire_title").html("National Units");
  $("empire_mode_panel").html("<input type='checkbox' id='show_hp' title='Show hitpoints' name='cbHP' value='false' onclick='toggle_empire_show_hitpoints();'>")

  var sortList = [];
  var headers = $('#empire_table thead th');
  headers.filter('.tablesorter-headerAsc').each(function (i, cell) {
    sortList.push([cell.cellIndex, 0]);
  });
  headers.filter('.tablesorter-headerDesc').each(function (i, cell) {
    sortList.push([cell.cellIndex, 1]);
  });

  if (narrow_screen || tiny_screen) $("#empire_prompt").hide();
  else $("#empire_prompt").show();

  var updown_sort_arrows = "<img class='lowered_gov' src='data:image/gif;base64,R0lGODlhFQAJAIAAAP///////yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw=='>";

  var empire_list_html = "";
  var empire_table_html = "";

  if (true /*wide_screen*/)  // fully standard deluxe wide-screen mode, include all info
  {
    //console.log("MODE: Widescreen")
    empire_list_html = "<table class='tablesorter-dark' id='empire_table' style='border=0px;border-spacing=0;padding=0;'>"
        + "<thead id='empire_table_head'>"
        + "<tr>"
        + "<th title='Sort by total' style='text-align:right;'>"+updown_sort_arrows+"</th>"
        + "<th title='Sort alphabetically' style=''>Type"+updown_sort_arrows+"</th>"
        + "<th title='Sort by similar types' style='text-align:left;'>&nbsp;Units"+updown_sort_arrows+"</th>"
        + "</tr>"
        + "</thead><tbody>";

  } else if (redux_screen) // semi-standard rendition of the above with minor trimming
  { // -1 column (selection box). Economised columns: Sort Arrows, Grows In>>Grows, Name of Production/Image >> Image only, Turns/Progress>>Progress
    //console.log("MODE: Reduced Standard")
  } else {  // tiny - brutally cut non-crucial info
    // -2 columns (selection box, cost). Economised: Sort arrows, Grows In>>grows, Granary>>Grain, Producing>>Output:Image only, Turns/Progress>>Turns
    //console.log("MODE: Small Narrow")
  }
        
  var adjust_oversize = "";               // for style-injecting margin/alignment adjustment on oversize unit images
  var unit_row_html = "";
  var type_count = 0; // number of types of units (total rows)

  // Pre-sort units by type to avoid exponentially more iterations:
  var units_sorted_by_type = [];
  for (var unit_type_id in unit_types) {
    units_sorted_by_type[unit_type_id] = []; // new blank array for each unit of this unit type
  }
  for (var unit_id in units) {  // pre-sort units belonging to player, by type, into this array
    var sunit = units[unit_id];
    if (client.conn.playing != null && unit_owner(sunit).playerno == client.conn.playing.playerno) {
      units_sorted_by_type[sunit['type']].push(sunit);
      //console.log("PRESORT: Found a "+unit_type(sunit)['name'],sunit)
    }
  }
  /*
  for (var unit_type_id in unit_types)
  {
    if (units_sorted_by_type[unit_type_id].length)
      //console.log(unit_types[unit_type_id]['name']+": "+units_sorted_by_type[unit_type_id].length);
  }*/

  var count = new Array(unit_types.length); // keeps track of how many units of each type
  for (var unit_type_id in unit_types) { //rows (unit types)
    count[unit_type_id] = 0; 
    unit_row_html = "<tr class='cities_row;'>";
    unit_row_html += "<td style='font-size:85%; text-align:right;' id='ucount"+unit_type_id+"'></td>";
    unit_row_html += "<td style='padding-left:10px; font-size:85%; color:#d0d0d0'>"+unit_types[unit_type_id]['name']+"</td>";
    unit_row_html += "<td id='u"+unit_type_id+"'>";

    for (var unit_index in units_sorted_by_type[unit_type_id]) { //row elements (individual units)
      //console.log("   Adding a "+unit_types[unit_type_id]['name'])
      //console.log("sortunit:",units_sorted_by_type[unit_index])

      var punit = units_sorted_by_type[unit_type_id][unit_index];
      //console.log("punit:   ",punit)
      
      if (!punit) console.log("       punit add was a FAIL!")
      //if (punit['type'] != unit_type_id) continue;  // not needed, we're looking only at units of this type in the array
      
      count[unit_type_id]++; //to do: this can be summed in the earlier iteration and we can skip the step of injecting html later
      var ptype = unit_type(punit);

      // Generate micro-sprite   
      ptype_sprite = {"type":ptype,"sprite":get_unit_type_image_sprite(ptype)};
      hptype_sprite = {"type":ptype,"sprite":get_full_hp_sprite(punit)};

      ptype_img_html = "";
      if (ptype_sprite != null) { 
        sprite = ptype_sprite['sprite'];
        console.log("unit sprite",sprite)
        var hp_sprite = hptype_sprite['sprite'];
        console.log("hp sprite",hp_sprite);

        
        adjust_oversize = (sprite['width']>64) ? -34 : -26;  // "oversize" images space differently
        
        ptype_img_html = "<span class='prod_img' title='"+get_unit_city_info(punit)+"' style='max-height:24px; float:left; padding-left:0px padding-right:0px; content-align:right; margin-top:-13px;"
                + "margin-left:"+adjust_oversize+"px' onclick='city_dialog_activate_unit(units[" + punit['id'] + "]);'>"
                + "<div style='float:left; content-align:left;"
                + "background: transparent url("
                + sprite['image-src']
                + ");transform: scale(0.625); background-position:-" + sprite['tileset-x'] + "px -" + (sprite['tileset-y'])
                + "px;  width: " + (sprite['width']) + "px;height: " + (sprite['height']) + "px;"
                + " content-align: left;"
                + "vertical-align:top; float:left;'>"
                + "</div>"
                //------------------------------ hit point sprite
                + (empire_show_hitpoints ? 
                + ("<div style='margin-left:-80px; margin-top:-6px; float:left; content-align:left;"
                + "background: transparent url("
                + hp_sprite['image-src']
                + ");transform: scale(0.625); background-position:-" + hp_sprite['tileset-x'] + "px -" + (hp_sprite['tileset-y'])
                + "px;  width: " + (hp_sprite['width']) + "px;height: " + (hp_sprite['height']) + "px;"
                + " content-align: left;"
                + "vertical-align:top; float:left;'>"
                + "</div>" ) : "")
                // ------------------------------
                + "</span>";
      }   
      
      unit_row_html += "\n<span id='u_img" + unit_type_id + "'>"
        + "<span style='font-size:1%; color: rgba(0, 0, 0, 0);'>"+(String.fromCharCode(65+unit_type_id))+"</span>"+ptype_img_html+"</span>\n";
        //invisible tiny char for sorting by native unit_type order; defeats js sorting 10 as prior to 2,3,4,...
    
    }
    // only add a row if we have more than 0 units of this type:
    if (count[unit_type_id]>0) {
      type_count++;
      empire_list_html += (unit_row_html +"</td></tr>");
    }
  }  
  empire_list_html += "</tbody></table>";

  console.log(empire_list_html)
  $("#empire_list").html(empire_list_html);

 // Inject the unit type counts after the list becomes active HTML
  // (didn't know counts for rows in the middle of constructing)
  for (unit_type_id in unit_types) {
    if (count[unit_type_id] > 0)
      $("#ucount"+unit_type_id).html(count[unit_type_id]+"&nbsp;");
  }

  if (type_count == 0) {
    $("#empire_table").html("You have no units.");
  }

  $('#empire_scroll').css("height", $(window).height() - 200);

  $("#empire_table").tablesorter({theme:"dark", sortList: sortList});

  if (tiny_screen) {
  }
  else if (redux_screen) {
  } else if (wide_screen) {
  }
/*
  if (retain_checkboxes_on_update)
  {
    retain_checkboxes_on_update = false;
    restore_empire_checkboxes();
  } */
}

/**************************************************************************
 Called when button in #empire_mode_options is pressed to change mode:
**************************************************************************/
function change_empire_mode(mode_selected)
{
  empire_mode = mode_selected;
  update_empire_screen();
}

/**************************************************************************
 Updates the Empire tab when clicked. Does basic common setup, then based 
 on what empire_mode the player is in, calls the appropriate function
 to display that mode and populate the tables.
**************************************************************************/
function update_empire_screen()
{
  if (observing) return;

  // Do all the setup of width, buttons in top panel for switching mode, 
  // then call a separate function based on what mode we're in

  // start at default width
  $('#empire_scroll').css("width", "100%");

  // -------------------------------------------------------------------
  // Carefully set up display mode controls:  wide, reduced standard, tiny:
  var wide_screen = $(window).width()<1340 ? false : true;
  var narrow_screen = $(window).width()<1000 ? true : false;
  var small_screen = is_small_screen();
  var landscape_screen = $(window).width() > $(window).height() ? true : false; 
  var tiny_screen=false;
  var redux_screen=false;  // mid-size screen
  
  // narrow screen triggers tiny screen (becase we need width for city rows)
  // if small_screen and not landscape, that's also a tiny screen:
  if ( (small_screen) || (narrow_screen && !scroll_narrow_x)) {
    /* Exception: scroll_narrow_x is option for users wanting horiz-scroll for
     * more info. They get redux screen instead of tiny: */
    if (scroll_narrow_x) {
      tiny_screen = true; redux_screen=true; wide_screen = false;
      if (scroll_narrow_x && narrow_screen && !landscape_screen) $('#cities_scroll').css("width", "110%");
    } else {
      tiny_screen = true; redux_screen=false; wide_screen = false;
    }
  } else if (!wide_screen) {
      if (narrow_screen) {
        redux_screen=true; tiny_screen=true; wide_screen = false;
      }
      else {
        redux_screen=true; tiny_screen=false; wide_screen = false;
      }
  }
  /*  console.log("Wide:   "+wide_screen);
      console.log("Landscp:"+landscape_screen);
      console.log("Redux:  "+redux_screen);
      console.log("Small:  "+small_screen);
      console.log("Narrow: "+narrow_screen);
      console.log("Tiny:   "+tiny_screen);
      console.log("Scrollx:"+scroll_narrow_x); */

  switch (empire_mode) {
    case EMPIRE_UNIT_TYPE_MODE:
        empire_unittype_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
    case EMPIRE_UNIT_HOMECITY_MODE:
        empire_unit_homecity_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
    case EMPIRE_UNIT_IN_CITY_MODE:
        empire_unitcity_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
    case EMPIRE_ECON_IMPROVEMENTS:
        empire_econ_improvements_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
    case EMPIRE_ECON_UPKEEP:
        empire_econ_upkeep_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
    case EMPIRE_ECON_WORKLISTS:
        empire_econ_worklists_screen(wide_screen,narrow_screen,small_screen,landscape_screen,tiny_screen,redux_screen);
        break;
  }   
}

/**************************************************************************
  Restores retained checkbox states if update_empire_screen() refreshes
  itself while viewing (e.g., bought something, changed production item)
**************************************************************************/
function restore_empire_checkboxes()
{
  //console.log("Restoring checkboxes.");
  // Restore checkbox state in individual city rows:
  if (empire_checkbox_states != null) {
    for (var row_id in empire)  {
      if (empire_checkbox_states[row_id] == true) {
        //console.log("  "+city_id+":"+cities[city_id].name+" == true.  (setting now)");
        $("#cb"+row_id).prop('checked', true);
      } 
    }
  }
  // Restore checkbox state of "master" header checkbox
  $("#master_checkbox").prop('checked', master_empire_checkbox);
}

/**************************************************************************
  Save all checkboxes in city list for restoring if screen updates.
**************************************************************************/
function save_empire_checkbox_states()
{
  for (var row_id in empire)  {
    if ($("#cb"+row_id).is(":checked")) {
      empire_checkbox_states[city_id] = true;
    } else empire_checkbox_states[city_id] = false;
  }
}

/**************************************************************************
  Toggle all checkboxes in empire list for selecting rows
**************************************************************************/
function toggle_empire_row_selections()
{
  for (var row_id in empire)  {
    $("#cb"+row_id).prop('checked', !($("#cb"+row_id).is(":checked")) );
  }
  master_empire_checkbox = $("#master_empire_checkbox").is(":checked");
}

/**************************************************************************
 Callback to handle keyboard events for the empire tab.
**************************************************************************/
function empire_keyboard_listener(ev)
{
  // Check if focus is in chat field, where these keyboard events are ignored.
  if ($('input:focus').length > 0 || !keyboard_input) return;

  if (C_S_RUNNING != client_state()) return;

  /* if (!ev) ev = window.event; INTERNET EXPLORER DEPRECATED */
  var keyboard_key = String.fromCharCode(ev.keyCode);
  var key_code = ev.keyCode;

  switch (key_code) {
    case 0: 
      ev.stopImmediatePropagation();
      setTimeout(function(){  
       
      }, 300);
     break;
  }
  switch (keyboard_key) {

    case 'W': // same command as ESC above (code 27)
      //ev.stopPropagation();
      //chatbox_scroll_to_bottom(false);
      break;
  }
}
