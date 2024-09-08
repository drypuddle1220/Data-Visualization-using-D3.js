var spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A bubble plot showing the frequency of tree species over years.",
  "data": {
    "url": "/assignment (1).csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {"calculate": "datum.DATEPLANT !== null ? year(datum.DATEPLANT) : null", "as": "Year"},
    {"aggregate": [{"op": "count", "as": "Count"}], "groupby": ["Year", "families"]}
  ],
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "Year",
      "type": "ordinal",
      "axis": {"title": "Year"}
    },
    "y": {
      "field": "families",
      "type": "nominal",
      "axis": {"title": "Tree Species"}
    },
    "size": {
      "field": "Count",
      "type": "quantitative",
      "legend": {"title": "Population Size"}
    },
    "color": {
      "field": "families",
      "type": "nominal",
      "legend": {"title": "Tree Species"}
    }
  }
};

vegaEmbed('#vis2', spec);
