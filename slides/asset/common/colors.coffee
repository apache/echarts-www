define((require) ->
    palette = require('./palette')

    colorLabel = [
        ['Red', 'A400']
        ['Yellow', 'A200']
        ['Blue', 'A400']
        ['Grey', '400']
        ['Light Blue', 'A400']
        ['White']
        ['Orange', 'A400']
        ['Lime', 'A400']
        ['Blue Grey', '200']
        ['Teal', 'A400']
        ['Cyan', 'A400']
        ['Blue', '900']
        ['Purple', '400']
        ['Deep Orange', '300']
        ['Purple']
        ['Cyan']
        ['Teal']
        ['Green']
    ]



    exports = {
        getItemColor: (n) ->
            colors = colorLabel.map((val) ->
                palette.get(val[0], val[1] || '')
            )
            if n then colors.slice(0, n) else colors.slice()

        getAxis: () ->
            palette.get('White', 'Secondary Text')

        getText: () ->
            palette.get('White', 'Text')

        getDefault: () ->
            @getItemColor()
    }

    exports
)