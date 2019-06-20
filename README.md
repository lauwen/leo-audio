# leo-audio
The audio library based on jquery and bootstrap.

# getting started
## install
```
<link href=".../bootstrap.min.css" type="text/css" rel="stylesheet">
<link href=".../leo-audio.min.css" type="text/css" rel="stylesheet"/>
<script src=".../jquery.min.js"></script>
<script src=".../bootstrap.min.js"></script>
<script src=".../leo-audio.min.js"></script>
```
## example
```
<audio src="./last_summer.mp3" id="audioTest" preload="auto" loop></audio>
<div id="leo-audio" class="container"></div>
<script>
    $("#leo-audio").leoAudio("#audioTest", {
        name : "last_summer",
    });
</script>
```
## audio options
```
    name : "Unknown-Audio",
    volume : 0.5,
    pointer : false,
    theme : {
        bgColor :  "#ffffff",
        btnColor : "#888888",
        progressColor : {
            start : "#47CFFF",
            end : "#1D81E4",
            bar : "#1D81E4",
            cursor : "#1d83ec",
            pointer : "orangered",
            bg : "f5f5f5"
        },
        volumeColor : {
            start : "#47CFFF",
            end : "#1D81E4",
            cursor : "#1d83ec",
            pointer : "#1D81E4",
            bg : "#f5f5f5"
        },
        rateColor : {
            bg : "white",
            font: "black",
            border: "#888888"
        }
    }
```

