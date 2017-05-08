// Coded By: Ryan Mroczenski on 02/16/2010
// Update 1.1 Changed code to support firefox browser
// Update 1.2 
// Update 1.5 Added group dropdown selection, tried to speed up widget.
// Update 1.6 Changed the way we pull information from groups to speed things up!
//            Thanks to the spiceworks team for tips on ways to speed up our widget
//            Thanks to EMC for the awesome function 'number_to_human_size'!!!
// Update 1.7 Commented out the code that has to do with user preferences when viewing the inventory.
// Update 2.0 Added the ability to filter/sort.  There is a switch in the plugin Configurtion that also dictates if we are dealing with SIZE or % or the drive.
// Update 3.0 ASYNCHRONOUS LOADING!!! and jQuery Updates.

//p-78046e90-bfeb-012b-e32b-0016353cc494-1489961369
plugin.configure({
    settingDefinitions:[{ name:'type', 
                          label:'Display Type', 
                          type:'enumeration',
                          defaultValue:'%x', options:['%x', 'Sizex']}
    ]
  });

//SPICEWORKS.utils.include(plugin.contentUrl("init2.js"));
//SPICEWORKS.utils.include(plugin.contentUrl("init3.js"));
plugin.includeStyles();

var $j = jQuery.noConflict();
var maxLength = '(705.71 MB)'.length;
var PBInfo = new Array();
var pbNumber = 0;

var defaultz = {
  redChange:  "Default: 75",
  warnChange:  "Default: 50",
  low_color:  "Default: B0E2B0<br/>",
  warning_color:  "Default: FFFFAA<br/>",
  high_color: "Default: E2B0B0<br/>",
  watchComputers:"example: test1;test;",
  hide: 'Default: System Reserved'
};

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

// UPTIME SIDGET

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

SPICEWORKS.plugin.add(     { name:"Device Uptime",
      version:"2.001",
      description:"See how many devices in an Inventory group are online versus how many are offline.",
      id: 101,
      guid:"p-54bafa20-e9e5-012c-f1d1-002481aaf3e4-1264207091",
      settings:{},
      contentAreas: [{"content_name":"chart_stylesheet.css","content_type":"server/css","description":null,"id":640,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null},{"content_name":"device_uptime_controller.rb","content_type":"server/controller","description":null,"id":641,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null},{"content_name":"device_uptime_route.rb","content_type":"server/route","description":null,"id":642,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null},{"content_name":"fusion_charts_theme.js","content_type":"server/javascript","description":null,"id":643,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null},{"content_name":"initialize.js","content_type":"server/javascript","description":null,"id":644,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null},{"content_name":"widget_partial.html.erb","content_type":"server/view","description":null,"id":645,"updated_at":"2017-03-17T18:21:27-04:00","user_id":null}],
      translations: [],
      initialize: function(plugin) {
        // Copyright ¬© 2009-16 Spiceworks, Inc.  All Rights Reserved.  http://www.spiceworks.com
// @env dev
// @guid p-931942c0-c5ba-012c-642f-00237de05916-1263272506

// Plugin to graph the online/offline history for a group of devices

var inventoryGroups = selectUserGroups(SPICEWORKS.data.Group.find('all')),
    historyAmounts = [['1 Day', 24], ['3 Days', 3*24], ['1 Week', 7*24], ['1 Month', 31*24], ['All Available', 0]];

// a global function to our widget for parsing out the groups we care about from the entire inventory groups collection and also presenting them to us in a nice way (ordered, grouped for a select)
function selectUserGroups(collection){
  // we only want groups that the user has control over
  return collection.select(function(group){
    return !$w('identified offline wireless wired dhcp static anti_virus_current anti_virus_out anti_virus_none computers anti_virus_status_unknown devices').include(group.name);
  }).collect(function(group){
    // group them into arrays that the select fieldset element understands
    return [group.name.truncate(30), group.id];
  }).sortBy(function(group){
    // and sort them for easy reading
    return group[0];
  });
}


SPICEWORKS.app.dashboard.addWidgetType({
  name: 'updown-widget',
  label: 'Device Uptime',
  prefs: [
    { name: 'inventoryGroup', label: 'Inventory Group', type: 'select', defaultValue: '2', options: inventoryGroups},
    { name: 'historyAmount',  label: 'History Amount', type: 'select', defaultValue: 3*24, options: historyAmounts}
  ],
  icon: "/images/icons/small/start_scan.png",
  widgetOptions: { hover_title: 'View device uptime by group'},
  update: function (element, options) {
    SPICEWORKS.utils.include(plugin.contentUrl("fusion_charts_theme.js"), function() {
      plugin.includeStyles();

      // show the loading screen
      element.update('<h6>Loading ...</h6>');

      // set the element ID so we know how to replace it when
      // executing the RJS on the server.
      element.id = "device_uptime_" + (new Date().getTime());
      element.addClassName('device-uptime-widget');

      // make the request which will send over the settings
      // and replace the element with the partial
      new Ajax.Request('/integrations/device_uptime', { method:'get', requestClass: "",
        parameters: $H({element_id: element.id, guid: plugin.guid}).merge(options)
      });
    });
  }
});
      }
    }
 );

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------

function SW_Request(url, params){
    return (new Ajax.Request('http://oapps.tocci.com:9675/api/' + url, 
        {method:'get',asynchronous:false ,parameters:params})).transport.responseText.evalJSON()
} 

function SW_Request1(url){
    return (new Ajax.Request('http://oapps.tocci.com:9675/api/' + url, 
        {method:'get',asynchronous:false})).transport.responseText.evalJSON();
}
var vms = ds('groups/99.json?method=members&jester=t')
var defs = {
   groups: 'groups.json?jester=t',
   groups_O: SPICEWORKS.data.Group.find('all'),
   monitors: SPICEWORKS.data.DataMonitor.find('all'),
   polling: 'settings/scan_polling'
}
document.getElementById('right').innerHTML += '<ol><li>html data</li></ol>'
var printers = SPICEWORKS.data.Device.find('all')
var mon = SPICEWORKS.data.DataMonitor.find('all')

var scan_tasks = [
"1	all",
"2	resources",
"3	utilization",
"4	events",
"5	updown",
"6	cloud_service"
]


//--------------------------------------------------------------------------------------------------------------

var SIZE_LABELS = ['MB','GB','TB','PB'];
var SHOW = ['All', 'Only Over Limit', 'Order by Drive Free Space %'];

function selectUserGroups(collection){
  // we only want groups that the user has control over
  return collection.select(function(group){
    return !$w('identified offline wireless wired dhcp static anti_virus_current anti_virus_out anti_virus_none computers anti_virus_status_unknown devices blank').include(group.name);
  }).collect(function(group){
    // group them into arrays that the select fieldset element understands
    return [group.name.truncate(30),group.id];
  }).sortBy(function(group){
    // and sort them for easy reading
    return group[0];
  });
}

var inventoryGroups = selectUserGroups(SPICEWORKS.data.Group.find('all'));

function sortByDeviceName(a,b){
  try {
  var x=a.name.toLowerCase();
  var y=b.name.toLowerCase();
    return ((x<y) ?-1:((x>y) ? 1:0));
  }
    catch(e){}
}

function ExactRound(a,e){
    if (a.toString().indexOf(".") == -1){
    return number(a);
    }
    else{
    var deci;
    a=String(a);
    deci = a.split(".")[1].length;
      var c= Number(a);
      var expo= (Math.pow(10,deci));
      var result=((Math.round(c*expo)/expo).toFixed(e));
      //alert('a'+result);
      return result;   
    }
  }

function number_to_human_size(bytes,toLabel) {
  // if its bytes just ignore it and label it
  if ( bytes < 1024 && !toLabel){
    return bytes + " bytes";
  }

  var true_size = bytes;
  var reductions = -1;
  // we know due to the early return we can
  // at least do this safetly once
  do {
    true_size = true_size / 1024.0;
    ++reductions;
    // if we have toLabel, then return the actual value
    // without the label at that particular size
    if ( toLabel && SIZE_LABELS[reductions-1] === toLabel ) {
      return true_size;
    }
  } while( (true_size >= 1024.0 && reductions < 4) || toLabel );
  return ExactRound(true_size,2)+ " " + SIZE_LABELS[reductions-1]; 
}

function Server(serverName, totalHTML, driveAlert, freeSpacePct, slink){
  this.Server = serverName;
  this.totalHTML = totalHTML;
  this.driveAlert = driveAlert;
  this.freeSpacePct = freeSpacePct;
  this.slink = slink;
}

// ------------------------------------------------------------------------------------------------------------------


 

function doSize(element, settings){
  var changeAt = '';
  var aHideDrives = settings.hide.split(",");

    if (settings.redChangeMB.toString().indexOf(".") == -1){
      settings.redChangeMB += '.';
    }

   changeAt = ExactRound(settings.redChangeMB, 4);

    for (test = 0; test <= inventoryGroups.length; test++)
    {
      if (inventoryGroups[test][1] == settings.inventoryGroup)
      {
        element.innerHTML += '<center><h3>' + inventoryGroups[test][0] + '</h3></center><hr/>';
        test = inventoryGroups.length;
      }
    }

    var less50 = settings.low_color;
    var more50 = settings.high_color;
    var totalHTML = '';
    var SpiceWorksDevices = SW_Request1('groups/' + settings.inventoryGroup, '.json?method=members');
    SpiceWorksDevices.sort(sortByDeviceName);

    var SpiceworksDrives = new Array();
    var server = '';
    var alert = '0';
    var driveNumber = 0;
    for (y = 0; y <= SpiceWorksDevices.length; y++)
    {
      try
       {
         var discs = SW_Request('devices/' + SpiceWorksDevices[y].id + '.json', 'method=local_disks');
         var dlink = "/inventory/groups/" + settings.inventoryGroup + "/" + SpiceWorksDevices[y].id +  "?tab=configuration";

         for (x = 0; x <= discs.length; x++)
         {
           alert = '0';

           var driveHTML = '';
           if (discs[x] === undefined)
           {
             x = discs.length;
           }
           else
           {
             var spwdevice = discs[x];
             var driveLetter = spwdevice.name;

             if (driveLetter == "/"){
               driveLetter = driveLetter + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
             }else if (driveLetter == "/boot"){
               driveLetter = driveLetter + '&nbsp;&nbsp;&nbsp;';                   
             }


             var usedPCT = (((spwdevice.size-spwdevice.free_space)/spwdevice.size)*100).toFixed(0);
             var freePCT = ((spwdevice.free_space/spwdevice.size)*100).toFixed(0);

             var freePCTSTR;

             var changeAtDos = number_to_human_size(spwdevice.free_space, settings.size_Option);
             var len = String(changeAtDos).length;
             changeAtDos = String(changeAtDos).substring(0, len - 3);

             var totalSize = number_to_human_size(spwdevice.size, settings.size_Option);
             len = String(totalSize ).length;
             totalSize = String(totalSize ).substring(0, len - 3);

             if(freePCT < 10)
             {
               freePCTSTR = '&nbsp;&nbsp;' + freePCT;
             }
             else if(freePCT >= 10 && freePCT < 100)
             {
               freePCTSTR = '&nbsp;' + freePCT;
             }
             else
             {
               freePCTSTR = '&nbsp;' + freePCT;
             }

             var beginningHTML = '';
             var endingHTML = '';
       if ($j.inArray(spwdevice.name, aHideDrives) == -1  ){
        beginningHTML = '<div class="pbz" id="' + SpiceWorksDevices[y].name.toUpperCase() + driveNumber.toString() + '"><div class="label">';
        endingHTML =  '<div style="display: inline; float:left; margin-left:0px; margin-top: 0px; margin-right:0px; margin-bottom: 0px">' + driveLetter + '</div><div style="display: inline; float:right; margin-left:0px; margin-top: 0px; margin-right:0px; margin-bottom: 0px">' + number_to_human_size(spwdevice.size) + '</div><div><br/>'+freePCTSTR+'% Free <i>(' + number_to_human_size(spwdevice.free_space) +')</i></div></div></div>';

        if (parseFloat(ExactRound(changeAt ,4).toString()) >= parseFloat(ExactRound(changeAtDos ,4).toString()))
        {
          alert = '1';
          driveHTML += beginningHTML+endingHTML;
          PBInfo[pbNumber] = SpiceWorksDevices[y].name.toUpperCase() + driveNumber.toString() + ',' + usedPCT + ',' + more50;
          pbNumber += 1;
        }
        else             
        {
          driveHTML += beginningHTML+endingHTML;
          PBInfo[pbNumber] = SpiceWorksDevices[y].name.toUpperCase() + driveNumber.toString() + ',' + usedPCT + ',' + less50;
          pbNumber += 1;               
        }    

         if (driveHTML.length > 0) {
            if (server !== SpiceWorksDevices[y].name.toUpperCase()){
                if (server !== ""){
                    totalHTML += "</div>";
                    }
          
                    totalHTML += '<br/><div class="server"><a href="' + dlink 
                        + '" target="_blank"><b>'+SpiceWorksDevices[y].name.toUpperCase()+
                        '</b></a><div class="expander" style="font-size: .75em; display: inline; float:right; margin-left:0px; margin-top: 0px; margin-right:0px; margin-bottom: 0px"><i>(expand)</i></div>';
                    server = SpiceWorksDevices[y].name.toUpperCase();
                 }
                totalHTML += driveHTML;

                SpiceworksDrives[driveNumber] =  new Server(SpiceWorksDevices[y].name.toUpperCase(),  driveHTML,
                           alert,
                           freePCT,
                           dlink);
                driveNumber += 1;
             }
       }

             }
           }
       }
       catch (e){}
      }

      if (totalHTML.length > 0){         
         //SpiceworksDrives.sort(function(a,b){return a.freeSpacePct - b.freeSpacePct}); 

         if (settings.show.toString() == 'All'){
            element.innerHTML += totalHTML;
         }else if (settings.show.toString() == 'Order by Drive Free Space %'){
             for (y = 0; y <= SpiceworksDrives.length; y++){
                 try{
                    element.innerHTML += '<br/><div class="server"><a href="' + SpiceWorksDevices[y].dlink 
                                      + '" target="_blank"><b>' + SpiceWorksDevices[y].name.toUpperCase()
                                      +'</b></a>' + SpiceworksDrives[y].totalHTML + '</div>';
                 }
                 catch(ee){}
             }        
         }
         //
         else{
             for (y = 0; y <= SpiceworksDrives.length; y++){
                 try{
                    if (SpiceworksDrives[y].driveAlert.toString()=='1'){
                       element.innerHTML += '<br/><div class="server"><a href="' + SpiceWorksDevices[y].dlink 
                                         + '" target="_blank"><b>'+SpiceWorksDevices[y].name.toUpperCase()+'</b></a>' + SpiceworksDrives[y].totalHTML + '</div>';
                    }
                 }
                 catch(ee){}
             }        
         }
      }
}


//var size_opts = ;

 // var default_opts = ;

//this runs at plugin initialization
if (plugin.settings.type== 'Sizex') {
  SPICEWORKS.app.dashboard.addWidgetType({
  name: 'DiskSummary',
  label: 'DiskSummary',
  icon: '/images/icons/small/storage.png',
  prefs: function(){ return [
    {name: 'inventoryGroup', label: 'Watch Group',         type: 'select', defaultValue: inventoryGroups[0][1],      options: inventoryGroups},
    {name: 'redChange' ,     label: 'Change Graph to High Color at %',   type: 'string', defaultValue: '75',     example: defaultz.redChange},
    {name: 'warnChange' ,    label: 'Change Graph to Warn Color at %',   type: 'string', defaultValue: '50',     example: defaultz.warnChange},
    {name: 'low_color' ,     label: 'Low Color',           type: 'string', defaultValue: 'B0E2B0', example: defaultz.low_color},
    {name: 'med_color' ,     label: 'Warning Color',       type: 'string', defaultValue: 'FFFFAA', example: defaultz.warning_color},
    {name: 'high_color',     label: 'High Color',          type: 'string', defaultValue: 'E2B0B0', example: defaultz.high_color},
    {name: 'show1',          label: 'Show:',               type: 'select', defaultValue: SHOW[0], options: SHOW},
    {name: 'hide',           label: 'Hide Drives (csv delimitted):', type: 'string', defaultValue: 'System Reserved', example: defaultz.hide}
  ]},

  update: function (element, settings){
    setTimeout(function() {
      doSize(element, settings);
      $j(function(){
        $j('.pbz').progressbar(); 

        for (y = 0; y < PBInfo.length; y++){
        try{     
          var attrs = PBInfo[y].split(",");
          $j('#' + attrs[0]).progressbar("option", {value: Math.floor(attrs[1])});
          $j('#' + attrs[0]).find( ".ui-progressbar-value" ).css({"background": '#' + attrs[2]});
          $j('.pbz').removeClass('.ui-widget-header');
          //$j('.pbz').css("height", "15px");
        }
        catch(ee){alert(y + ' : ' +ee);}
        }

        $j( ".pbz" ).mouseenter(function() {
            $j( this ).css("height", "30px");
        
        }).mouseleave(function() {
            $j( this ).css("height", "15px");
        });

        $j(".expander").click(function(){
            if ($j(this).html().indexOf("<i>(expand)</i>") !== -1){
                $j(this).siblings('.pbz').css("height", "30px");
            $j(this).html($j(this).html().replace("<i>(expand)</i>","<i>(collapse)</i>"));
            } else{
                $j(this).siblings('.pbz').css("height", "15px");
                $j(this).html($j(this).html().replace("<i>(collapse)</i>","<i>(expand)</i>"));
            }
        });

    });
    }, 1000);
    }
  });

}

//
else
{
 
}​