if exists("b:current_syntax")
    finish
endif

set list
set listchars=tab:\ ▸

syntax keyword cheapsoundKeyword print
syntax keyword cheapsoundKeyword if else

syntax match cheapsoundOperator "\v\*"
syntax match cheapsoundOperator "\v/"
syntax match cheapsoundOperator "\v\+"
syntax match cheapsoundOperator "\v-"
syntax match cheapsoundOperator "\v\^"
syntax match cheapsoundOperator "\v\%"
syntax match cheapsoundOperator "\v\="
highlight link cheapsoundOperator Operator

syntax match cheapsoundLambda "\v\=\>"
highlight link cheapsoundLambda Special

syntax match cheapsoundNumber "\v\d+"
syntax match cheapsoundFloat "\v\d+\.\d+"
highlight link cheapsoundFloat Number
highlight link cheapsoundNumber Number

syntax match cheapsoundComment "\v\/\/.*$"
highlight link cheapsoundComment Comment

highlight link cheapsoundKeyword Keyword

let b:current_syntax = "cheapsound"
