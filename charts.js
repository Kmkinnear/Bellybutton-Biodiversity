function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValue = result.sample_values.map((value) => parseInt(value));

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otuId.slice(0,10).map((id) => "OTU " + id).reverse();

    // 8. Create the trace for the bar chart. 
    //https://plotly.com/javascript/horizontal-bar-charts/
    var barData = {
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      hoverinfo: otuLabel,
      type: "bar",
      orientation: "h",
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      y: 2
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
  

// Bar and Bubble charts
// Create the buildCharts function.

    // 1. Create the trace for the bubble chart.
    //https://plotly.com/javascript/colorscales/
    var bubbleData = {
      x: otuId,
      y: sampleValue,
      text: otuLabel,
      mode: 'markers',
      marker: {
        size: sampleValue,
        color: otuId,
        colorscale: "Earth"
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID",automargin: true},
      yaxis: {automargin: true},
      //https://plotly.com/javascript/hover-events/
      hovermode: "closest",
      //https://stackoverflow.com/questions/35031517/plotly-js-adds-top-margin-to-graphs-inconsistently-how-to-prevent-it
      margin: { t: 55, r: 55, l: 55, b: 55},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

   //Deliverable 3 - Guage Chart
   
   
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
     // Create a variable that holds the first sample in the array.
    var metadata = data.metadata;
    var metaArray = metadata.filter(data => data.id == sample);
  
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValue = result.sample_values.map((value) => parseInt(value));

    // 3. Create a variable that holds the washing frequency.
    //https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
   var washingFreq = metaArray[0].wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10],
          tickmode: "array",
          tickvals: [0,2,4,6,8,10],
          ticktext: [0,2,4,6,8,10]
        },
        bar: {color: "black"},
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "darkgreen" }]
  }}];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 500, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
