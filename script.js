const width = 960, height = 600;
const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoMercator()
    .center([137.7272, 38.2048]) // Center on Japan
    .scale(2000) // Adjust scale for better fit
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Load and display the Japan map
d3.json("https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson").then(function (data) {
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .attr("stroke", "#333");

    // Load the earthquake data
    d3.csv("earthquakes_cleaned.csv").then(function (earthquakeData) {
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("z-index", "1000");

        // Process the earthquake data
        earthquakeData.forEach(d => {
            d.latitude = +d.Latitude;
            d.longitude = +d.Longitude;
            d.magnitude = +d.Mag;
            d.year = +d.Year;
        });

        // Extract and sort unique years for dropdown
        const years = Array.from(new Set(earthquakeData.map(d => d.year))).sort();
        const yearSelect = d3.select('#yearSelect');
        yearSelect.selectAll('option')
            .data(years, d => d)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', d => d);

        // Update map based on selected year
        yearSelect.on('change', function() {
            updateMap(+this.value);
        });

        function updateMap(year) {
            const filteredData = earthquakeData.filter(d => d.year === year);
            const earthquakes = svg.selectAll(".earthquake")
                .data(filteredData, d => d.id);

            earthquakes.enter().append("circle")
                .attr("class", "earthquake")
                .attr("cx", d => projection([d.longitude, d.latitude])[0])
                .attr("cy", d => projection([d.longitude, d.latitude])[1])
                .attr("r", d => Math.sqrt(d.magnitude) * 5)
                .attr("fill", "red")
                .attr("opacity", 0.6)
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`Magnitude: ${d.magnitude}<br>Year: ${d.year}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            earthquakes.exit().remove();
        }
    });
});
