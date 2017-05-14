/**
 * Created by Jane on 5/13/2017.
 */
var paramInfo = {
    //vr function
    "move_object_direction":{
        0:{
            "name":"ID",
            "type":"number",
            "form":"input",
            "idx":0
        },
        1:{
            "name":"distance",
            "type": "number",
            "form":"input",
            "idx":1
        },
        2:{
            "name":"direction",
            "type": "direction",
            "form":"field",
            "idx":-1
        },
        3:{
            "name":"time",
            "type": "number",
            "form":"input",
            "idx":2
        }
    },

    "set_color":{
        0:{
            "name":"ID",
            "type":"number",
            "form":"input",
            "idx":0
        },
        1:{
            "name":"color",
            "type":"color",
            "form":"field",
            "idx":-1
        }
    },

    //logic
    "controls_if":{

    },

    "logic_comapre":{


    },

    "logic_operation":{

    },

    "logic_negate":{

    },

    "logic_boolean":{
        0:{
            "name":"BOOL",
            "type": "boolean",
            "form":"field", //TRUE or FALSE
            "idx":-1
        }
    },

    "logic_null":{

    },

    //repeat
    "controls_repeat_ext":{
        0:{
            "name":"TIMES",
            "type":"number",
            "form":"input",
            "idx":0
        }

    },

    "controls_whileUntil":{

    },

    "controls_for":{
        0:{
            "name":"FROM",
            "type":"number",
            "form":"input",
            "idx":0
        },
        1:{
            "name":"TO",
            "type":"number",
            "form":"input",
            "idx":1
        },
        2:{
            "name":"BY",
            "type":"number",
            "form":"input",
            "idx":2
        }
    },

    //math
    "math_number":{
        0:{
            "name":"NUM",
            "type":"number",
            "form":"input",
            "idx":0
        }
    },

    "math_arithmetic":{
        0:{
            "name":"A",
            "type":"number",
            "form":"input",
            "idx":1
        },
        1:{
            "name":"B",
            "type":"number",
            "form":"input",
            "idx":2

        }
    },

    "math_single":{
        0:{
            "name":"NUM",
            "type":"number",
            "form":"input",
            "idx":0
        }
    },

    "math_random_int":{
        0:{
            "name":"FROM",
            "type":"number",
            "form":"input",
            "idx":0
        },
        1:{
            "name":"TO",
            "type":"number",
            "form":"input",
            "idx":1
        }
    }
}

$(document).ready(function(){
    sessionStorage.setItem("paramInfo", JSON.stringify(paramInfo));
})
