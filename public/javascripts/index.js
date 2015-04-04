



var getEneryUseByPropertyTypeBar = function() {
  $.ajax('https://www.apitite.net/api/clean_web/emissions-by-property-type/json', {
        type: 'GET',
        success: function(result) {
          if (result) {
            var usageByPropertyType = result;
            var propertyTypes = _.pluck(usageByPropertyType, 'primary_property_type');
            var values = _.pluck(usageByPropertyType, 'avg_total_ghg_emissions');

            var data = {
              labels: propertyTypes,
                datasets: [
                        {
                            label: "Total GHG Emissions by Building Type",
                            fillColor: "rgba(0,255,68,0.5)",
                            strokeColor: "rgba(151,187,205,0.8)",
                            highlightFill: "rgba(151,187,205,0.75)",
                            highlightStroke: "rgba(151,187,205,1)",
                            data: values
                        }
                      ]
              };



            //Create Chart
            var ctx = document.getElementById("emission-by-building-type-bar").getContext("2d");
            var myRadarChart = new Chart(ctx).Bar(data, {});

          } else {
            // Under nearly all circumstances we shouldn't reach this block
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error:', errorThrown);
          return [];
        }
    });
};

var getEneryUseByPropertyTypeRadar = function() {
  $.ajax('https://www.apitite.net/api/clean_web/emissions-by-property-type/json', {
        type: 'GET',
        success: function(result) {
          if (result) {
            var usageByPropertyType = result;
            var propertyTypes = _.pluck(usageByPropertyType, 'primary_property_type');
            var values = _.pluck(usageByPropertyType, 'avg_total_ghg_emissions');

              var data = {
                  labels: propertyTypes,
                  datasets: [
                      {
                          label: "My First dataset",
                          fillColor: "rgba(0,255,68,0.5)",
                          strokeColor: "rgba(220,220,220,1)",
                          pointColor: "rgba(220,220,220,1)",
                          pointStrokeColor: "#fff",
                          pointHighlightFill: "#fff",
                          pointHighlightStroke: "rgba(220,220,220,1)",
                          data: values
                      },

                  ]
              };
            //Create Chart
            var ctx = document.getElementById("emission-by-building-type-radar").getContext("2d");
            var myRadarChart = new Chart(ctx).Radar(data, {});

          } else {
            // Under nearly all circumstances we shouldn't reach this block
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error:', errorThrown);
          return [];
        }
    });
};


$(document).ready(function() {

  // Popluate Building Drop Down Menu
  getEneryUseByPropertyTypeBar();
  getEneryUseByPropertyTypeRadar();

});