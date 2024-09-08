var spec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A radar chart showing the average diameter of tree species by family.",
  "width": 400,
  "height": 400,
  "padding": 40,
  "autosize": {"type": "none", "contains": "padding"},

  "signals": [
    {"name": "radius", "update": "width / 2"},
    {"name": "metasequoiaAngle", "update": "scale('angular', 'Metasequoia')"},
    {"name": "macluraAngle", "update": "scale('angular', 'Maclura')"},
    {"name": "labelRadius", "update": "radius + 40"}
  ],

  "data": [
    {
      "name": "table",
      "values": [
             {"key": "Acer", "value": 2.99},
        {"key": "Aesculus", "value": 3.50},
        {"key": "Amelanchier", "value": 2.28},
        {"key": "Betula", "value": 2.96},
        {"key": "Carpinus", "value": 2.75},
        {"key": "Celtis", "value": 3.12},
        {"key": "Cercis", "value": 2.86},
        {"key": "Cladastris", "value": 4.00},
        {"key": "Cornus", "value": 3.00},
        {"key": "Crylus", "value": 3.00},
        {"key": "Fagus", "value": 3.00},
        {"key": "Ginkgo", "value": 2.82},
        {"key": "Gleditsia", "value": 2.82},
        {"key": "Hamamelis", "value": 2.00},
        {"key": "Juniperus", "value": 3.00},
        {"key": "Liquidamabar", "value": 3.00},
        {"key": "Liriodendron", "value": 3.50},
        {"key": "Maackia", "value": 2.53},
        {"key": "Maclura", "value": 2.00},
        {"key": "Malus", "value": 2.40},
        {"key": "Metasequoia", "value": 4.00},
        {"key": "Nyssa", "value": 2.78},
        {"key": "Ostrya", "value": 3.00},
        {"key": "Oxydendrum", "value": 3.00},
        {"key": "Parrotia", "value": 2.75},
        {"key": "Plantus", "value": 3.00},
        {"key": "Prunis", "value": 2.00},
        {"key": "Prunus", "value": 2.75},
        {"key": "Pryus", "value": 4.00},
        {"key": "Quercus", "value": 2.75},
        {"key": "Styphnolobium", "value": 3.50},
        {"key": "Styrax", "value": 3.00},
        {"key": "Syringa", "value": 2.55},
        {"key": "Syringia", "value": 2.50},
        {"key": "Taxodium", "value": 2.79},
        {"key": "Ulmus", "value": 2.97},
        {"key": "Zelkova", "value": 2.63}
      ]
    },
    {
      "name": "keys",
      "source": "table",
      "transform": [
        {"type": "aggregate", "groupby": ["key"]}
      ]
    }
  ],

  "scales": [
    {
      "name": "angular",
      "type": "point",
      "range": {"signal": "[-PI, PI]"},
      "padding": 0.5,
      "domain": {"data": "table", "field": "key"}
    },
    {
      "name": "radial",
      "type": "linear",
      "range": {"signal": "[0, radius]"},
      "zero": true,
      "nice": false,
      "domain": {"data": "table", "field": "value"},
      "domainMin": 0
    }
  ],

  "encode": {
    "enter": {
      "x": {"signal": "radius"},
      "y": {"signal": "radius"}
    }
  },

  "marks": [
    {
      "type": "line",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "interpolate": {"value": "linear-closed"},
          "x": {"signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))"},
          "y": {"signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))"},
          "stroke": {"value": "blue"},
          "strokeWidth": {"value": 1},
          "fill": {"value": "blue"},
          "fillOpacity": {"value": 0.1}
        }
      }
    },
    {
      "type": "rule",
      "from": {"data": "keys"},
      "encode": {
        "enter": {
          "x": {"value": 0},
          "y": {"value": 0},
          "x2": {"signal": "radius * cos(scale('angular', datum.key))"},
          "y2": {"signal": "radius * sin(scale('angular', datum.key))"},
          "stroke": {"value": "lightgray"},
          "strokeWidth": {"value": 1}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "keys"},
      "encode": {
        "enter": {
          "x": {"signal": "(radius + 15) * cos(scale('angular', datum.key))"},
          "y": {"signal": "(radius + 15) * sin(scale('angular', datum.key))"},
          "text": {"field": "key"},
          "align": [
            {"test": "sin(scale('angular', datum.key)) > 0", "value": "left"},
            {"value": "right"}
          ],
          "baseline": [
            {"test": "cos(scale('angular', datum.key)) > 0", "value": "bottom"},
            {"value": "top"}
          ],
          "fill": {"value": "black"},
          "fontWeight": {"value": "bold"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "x": {"signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))"},
          "y": {"signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))"},
          "text": {"signal": "format(datum.value, '.2f')"},
          "align": [
            {"test": "sin(scale('angular', datum.key)) > 0", "value": "right"},
            {"value": "left"}
          ],
          "baseline": [
            {"test": "cos(scale('angular', datum.key)) > 0", "value": "top"},
            {"value": "bottom"}
          ],
          "fill": {"value": "black"},
          "fontWeight": {"value": "normal"}
        }
      }
    },
    // Arrow for Metasequoia
    {
      "type": "path",
      "encode": {
        "enter": {
          "path": {
            "signal": "'M' + (radius * cos(metasequoiaAngle)) + ',' + (radius * sin(metasequoiaAngle)) + 'L' + (labelRadius * cos(metasequoiaAngle)) + ',' + (labelRadius * sin(metasequoiaAngle))"
          },
          "stroke": {"value": "red"},
          "strokeWidth": {"value": 2}
        }
      }
    },
    // Text Box for Metasequoia
    {
      "type": "text",
      "encode": {
        "enter": {
          "x": {"signal": "labelRadius * cos(metasequoiaAngle)"},
          "y": {"signal": "labelRadius * sin(metasequoiaAngle)"},
          "text": {"value": "Metasequoia "},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "fill": {"value": "red"}
        }
      }
    },
    // Arrow for Maclura
    {
      "type": "path",
      "encode": {
        "enter": {
          "path": {
            "signal": "'M' + (radius * cos(macluraAngle)) + ',' + (radius * sin(macluraAngle)) + 'L' + (labelRadius * cos(macluraAngle)) + ',' + (labelRadius * sin(macluraAngle))"
          },
          "stroke": {"value": "green"},
          "strokeWidth": {"value": 2}
        }
      }
    },
    // Text Box for Maclura
    {
      "type": "text",
      "encode": {
        "enter": {
          "x": {"signal": "labelRadius * cos(macluraAngle)"},
          "y": {"signal": "labelRadius * sin(macluraAngle)"},
          "text": {"value": "Maclura"},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "fill": {"value": "green"}
        }
      }
    }
  ]
};

vegaEmbed('#vis', spec);
